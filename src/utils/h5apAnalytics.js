// Listening analytics. Never throws into the player: every entry point is wrapped, and it does
// nothing unless the server printed window.h5apAnalytics (analytics on, front end, not an excluded admin).

const FLUSH_INTERVAL = 30000;
const MAX_TICK_GAP = 2500;
const BATCH_SIZE = 50;
const noop = () => {};

const config = () => {
	const cfg = window.h5apAnalytics;
	return cfg && typeof cfg.endpoint === 'string' && cfg.endpoint ? cfg : null;
};

const randomHex = (length) => {
	const bytes = new Uint8Array(length / 2);
	if (window.crypto && window.crypto.getRandomValues) {
		window.crypto.getRandomValues(bytes);
	} else {
		for (let i = 0; i < bytes.length; i++) {
			bytes[i] = Math.floor(Math.random() * 256);
		}
	}
	return Array.from(bytes, (b) => (b < 16 ? '0' : '') + b.toString(16)).join('');
};

// Several bundles (each block's view script, the Elementor player) import this module,
// so the queue, session and listeners live on window to stay single per page.
const runtime = () => {
	if (!window.__h5apAnalyticsRuntime) {
		const rt = {
			queue: [],
			session: randomHex(16),
			sent: new Set(),
			flushers: new Set(),
		};
		window.__h5apAnalyticsRuntime = rt;

		const flushAll = (useBeacon) => {
			rt.flushers.forEach((flush) => {
				try {
					flush();
				} catch (e) {
					// ignore
				}
			});
			send(useBeacon);
		};

		window.setInterval(() => flushAll(false), FLUSH_INTERVAL);
		document.addEventListener('visibilitychange', () => {
			if (document.visibilityState === 'hidden') {
				flushAll(true);
			}
		});
		window.addEventListener('pagehide', () => flushAll(true));
	}
	return window.__h5apAnalyticsRuntime;
};

function send(useBeacon) {
	const cfg = config();
	const rt = window.__h5apAnalyticsRuntime;
	if (!cfg || !rt || !rt.queue.length) {
		return;
	}

	while (rt.queue.length) {
		const body = JSON.stringify({
			sk: rt.session,
			pid: cfg.pid || 0,
			pt: cfg.pt || 'other',
			ref: document.referrer || '',
			ev: rt.queue.splice(0, BATCH_SIZE),
		});

		try {
			// text/plain keeps the request "simple" for sendBeacon in every browser; the server parses the raw body.
			if (useBeacon && navigator.sendBeacon && navigator.sendBeacon(cfg.endpoint, new Blob([body], { type: 'text/plain' }))) {
				continue;
			}
			if (window.fetch) {
				window.fetch(cfg.endpoint, {
					method: 'POST',
					body,
					keepalive: true,
					credentials: 'omit',
					headers: { 'Content-Type': 'text/plain' },
				}).catch(noop);
			}
		} catch (e) {
			// ignore
		}
	}
}

const enqueue = (event) => {
	runtime().queue.push(event);
};

const isEditingContext = () => {
	const body = document.body;
	if (body && (body.classList.contains('wp-admin') || body.classList.contains('block-editor-page') || body.classList.contains('editor-styles-wrapper'))) {
		return true;
	}
	try {
		return !!(window.elementorFrontend && window.elementorFrontend.isEditMode && window.elementorFrontend.isEditMode());
	} catch (e) {
		return false;
	}
};

const cleanTitle = (title) => {
	if (typeof title !== 'string') {
		return '';
	}
	const text = title.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
	return text.slice(0, 200);
};

/**
 * Tracks one Plyr player. getInfo() returns the track currently loaded: { src, title }.
 * Returns a detach function that sends what's pending; call it before destroying the player.
 */
export default function trackPlayer(player, getInfo, options = {}) {
	try {
		if (!config() || !player || typeof player.on !== 'function' || isEditingContext()) {
			return noop;
		}
		return attach(player, getInfo, options);
	} catch (e) {
		return noop;
	}
}

function attach(player, getInfo, options) {
	const rt = runtime();
	const kind = options.kind === 'radio' ? 'radio' : 'audio';
	const surface = options.surface || 'player';
	const container = options.container || (player.elements && player.elements.container);
	let ref = 0;
	if (container && container.closest) {
		const refEl = container.closest('[data-h5ap-ref]');
		ref = refEl ? parseInt(refEl.getAttribute('data-h5ap-ref'), 10) || 0 : 0;
	}

	let current = null;
	let lastTick = null;

	const readInfo = () => {
		let info = null;
		try {
			info = getInfo ? getInfo() : null;
		} catch (e) {
			info = null;
		}
		const src = info && typeof info.src === 'string' ? info.src : '';
		return { src, title: cleanTitle(info && info.title) };
	};

	const base = (src, title) => ({ s: src, n: title, k: kind, u: surface, r: ref });

	const flushCurrent = () => {
		if (!current || !current.dirty) {
			return;
		}
		// Rounded, with the difference carried into the next batch, so totals don't drift low.
		const whole = Math.max(0, Math.round(current.sec));
		current.sec -= whole;
		enqueue({ t: 'beat', ...base(current.src, current.title), sec: whole, pct: current.pct, end: current.end });
		current.dirty = false;
		current.end = false;
	};

	const ensureCurrent = () => {
		const info = readInfo();
		if (!info.src) {
			return null;
		}
		if (!current || current.src !== info.src) {
			flushCurrent();
			current = { src: info.src, title: info.title, sec: 0, pct: 0, end: false, dirty: false };
		}
		return current;
	};

	const tick = () => {
		const now = window.performance ? window.performance.now() : Date.now();
		if (lastTick !== null && current) {
			const gap = now - lastTick;
			if (gap > 0 && gap < MAX_TICK_GAP) {
				current.sec += gap / 1000;
				current.dirty = true;
			}
		}
		lastTick = now;

		// Live streams have no end, so progress is only tracked for regular audio.
		const duration = player.duration;
		if (current && kind !== 'radio' && Number.isFinite(duration) && duration > 0) {
			const pct = Math.min(100, Math.floor((player.currentTime / duration) * 100));
			if (pct > current.pct) {
				current.pct = pct;
				current.dirty = true;
			}
		}
	};

	const impression = () => {
		const info = readInfo();
		if (!info.src) {
			return;
		}
		const key = `imp|${ref}|${info.src}`;
		if (rt.sent.has(key)) {
			return;
		}
		rt.sent.add(key);
		enqueue({ t: 'imp', ...base(info.src, info.title) });
	};

	const safe = (fn) => (...args) => {
		try {
			fn(...args);
		} catch (e) {
			// ignore
		}
	};

	player.on('ready', safe(impression));
	player.on('loadedmetadata', safe(impression));

	player.on('playing', safe(() => {
		ensureCurrent();
		lastTick = window.performance ? window.performance.now() : Date.now();
	}));

	player.on('timeupdate', safe(() => {
		if (player.paused) {
			lastTick = null;
			return;
		}
		if (!ensureCurrent()) {
			return;
		}
		tick();
	}));

	player.on('pause', safe(() => {
		if (current) {
			tick();
		}
		lastTick = null;
		flushCurrent();
		send(false);
	}));

	player.on('ended', safe(() => {
		if (current) {
			tick();
			current.end = kind !== 'radio';
			current.dirty = true;
		}
		lastTick = null;
		flushCurrent();
		send(false);
	}));

	const media = player.media || (container && container.querySelector ? container.querySelector('audio') : null);
	const onError = safe(() => {
		const code = media && media.error ? media.error.code : 0;
		// 1 = aborted by the user/page; not a broken file.
		if (!code || code === 1) {
			return;
		}
		const info = readInfo();
		const key = `err|${info.src}`;
		if (!info.src || rt.sent.has(key)) {
			return;
		}
		rt.sent.add(key);
		enqueue({ t: 'err', ...base(info.src, info.title), c: code });
		send(false);
	});
	if (media && media.addEventListener) {
		media.addEventListener('error', onError);
	}

	safe(impression)();
	rt.flushers.add(flushCurrent);

	return () => {
		try {
			flushCurrent();
			rt.flushers.delete(flushCurrent);
			if (media && media.removeEventListener) {
				media.removeEventListener('error', onError);
			}
			send(true);
		} catch (e) {
			// ignore
		}
	};
}
