/**
 * Front-end transcript: highlights the line being spoken, jumps the audio when a line is
 * clicked, and filters lines by a search term. The markup comes from H5APPlayer\Helper\Transcript::render().
 * Loaded only on pages that show a transcript.
 */
import '../css/transcript.scss';

const AUTO_SCROLL_PAUSE = 4000;

// The file the <audio> is playing now.
const currentSource = (media) => media.currentSrc || media.getAttribute('src') || media.querySelector('source')?.src || '';

// Same file? Compares the address without query string or hash (players add things like ?download=false).
const sameSource = (a, b) => {
    const clean = (url) => {
        try {
            const parsed = new URL(url, window.location.href);
            return decodeURIComponent(parsed.origin + parsed.pathname).toLowerCase();
        } catch (e) {
            return String(url).split(/[?#]/)[0].toLowerCase();
        }
    };
    return clean(a) === clean(b);
};

const setupTranscript = (box) => {
    box.dataset.ready = '1';

    const list = box.querySelector('.h5ap-transcript__lines');
    const lines = Array.from(box.querySelectorAll('.h5ap-transcript__line'));
    if (!list || !lines.length) {
        return;
    }

    const starts = lines.map((line) => parseFloat(line.dataset.start) || 0);
    const texts = lines.map((line) => line.querySelector('.h5ap-transcript__text')?.textContent || '');
    // Playlists print one box per track (data-source = the track's file); only the playing track's box is shown.
    const trackSource = box.dataset.source || '';
    let audio = null;
    let active = -1;
    let userScrolledAt = 0;

    const scrollToLine = (line) => {
        if (Date.now() - userScrolledAt < AUTO_SCROLL_PAUSE || !box.open) {
            return;
        }
        list.scrollTo({ top: line.offsetTop - list.clientHeight / 3, behavior: 'smooth' });
    };

    const clearActive = () => {
        if (active > -1) {
            lines[active].classList.remove('is-active');
            lines[active].removeAttribute('aria-current');
        }
        active = -1;
    };

    const sync = () => {
        if (!audio || (trackSource && box.hidden)) {
            return;
        }
        const time = audio.currentTime;
        let index = -1;
        // Nothing is highlighted until the audio has started (the player sets the time to 0 when it loads).
        if (!(audio.paused && time === 0)) {
            for (let i = 0; i < starts.length && starts[i] <= time + 0.05; i++) {
                index = i;
            }
        }
        if (index === active) {
            return;
        }
        if (active > -1) {
            lines[active].classList.remove('is-active');
            lines[active].removeAttribute('aria-current');
        }
        active = index;
        if (index > -1) {
            lines[index].classList.add('is-active');
            lines[index].setAttribute('aria-current', 'true');
            scrollToLine(lines[index]);
        }
    };

    // Track boxes: show this box only while the player is on its track.
    const updateTrack = () => {
        if (!trackSource) {
            return;
        }
        const playing = audio ? currentSource(audio) : '';
        const isMine = Boolean(playing) && sameSource(playing, trackSource);
        if (box.hidden === isMine) {
            box.hidden = !isMine;
        }
        if (!isMine) {
            clearActive();
        }
    };

    const onSourceChange = () => {
        updateTrack();
        sync();
    };

    const attach = (media) => {
        if (media === audio) {
            return;
        }
        if (audio) {
            ['timeupdate', 'seeked'].forEach((type) => audio.removeEventListener(type, sync));
            ['loadstart', 'emptied', 'loadedmetadata'].forEach((type) => audio.removeEventListener(type, onSourceChange));
        }
        audio = media;
        if (audio) {
            ['timeupdate', 'seeked'].forEach((type) => audio.addEventListener(type, sync));
            ['loadstart', 'emptied', 'loadedmetadata'].forEach((type) => audio.addEventListener(type, onSourceChange));
        }
        onSourceChange();
    };

    const findAudio = () => {
        const root = document.getElementById(box.dataset.player);
        return root ? root.querySelector('audio') : null;
    };

    // The player is mounted by React (sometimes lazily), so look for its <audio> when needed.
    const getAudio = () => {
        if (!audio || !audio.isConnected) {
            attach(findAudio());
        }
        return audio;
    };

    // Keep watching: playlists rebuild their player (a new <audio>) after a search, filter or page change.
    const root = document.getElementById(box.dataset.player);
    attach(findAudio());
    if (root && typeof MutationObserver !== 'undefined') {
        new MutationObserver(() => {
            if (!audio || !audio.isConnected) {
                attach(findAudio());
            } else {
                updateTrack();
            }
        }).observe(root, { childList: true, subtree: true });
    }

    // Before the audio has loaded, the player resets the time to its Start Time when metadata arrives,
    // so apply the jump right after that instead.
    let pendingTime = null;
    const seek = (media, time) => {
        if (media.readyState >= 1) {
            media.currentTime = time;
            return;
        }
        if (pendingTime === null) {
            media.addEventListener('loadedmetadata', () => {
                setTimeout(() => {
                    media.currentTime = pendingTime;
                    pendingTime = null;
                }, 0);
            }, { once: true });
        }
        pendingTime = time;
    };

    const playFrom = (index) => {
        const media = getAudio();
        if (!media || index < 0) {
            return;
        }
        userScrolledAt = 0;
        seek(media, starts[index]);
        const playing = media.play();
        if (playing && typeof playing.catch === 'function') {
            playing.catch(() => { });
        }
    };

    list.addEventListener('click', (event) => {
        const line = event.target.closest('.h5ap-transcript__line');
        // Let people select text without jumping the audio.
        if (!line || String(window.getSelection?.() || '').length > 0) {
            return;
        }
        playFrom(lines.indexOf(line));
    });

    ['wheel', 'touchmove'].forEach((type) => {
        list.addEventListener(type, () => { userScrolledAt = Date.now(); }, { passive: true });
    });

    // Search
    const input = box.querySelector('.h5ap-transcript__input');
    const count = box.querySelector('.h5ap-transcript__count');
    if (!input) {
        return;
    }

    const paint = (line, text, term) => {
        const target = line.querySelector('.h5ap-transcript__text');
        target.textContent = '';
        if (!term) {
            target.textContent = text;
            return 0;
        }
        const lower = text.toLocaleLowerCase();
        let from = 0;
        let found = 0;
        let at = lower.indexOf(term);
        while (at !== -1) {
            target.append(text.slice(from, at));
            const mark = document.createElement('mark');
            mark.textContent = text.slice(at, at + term.length);
            target.append(mark);
            from = at + term.length;
            found++;
            at = lower.indexOf(term, from);
        }
        target.append(text.slice(from));
        return found;
    };

    let timer;
    const search = () => {
        const term = input.value.trim().toLocaleLowerCase();
        let total = 0;
        lines.forEach((line, i) => {
            const found = paint(line, texts[i], term);
            total += found;
            line.hidden = Boolean(term) && found === 0;
        });
        if (count) {
            const label = !term ? '' : total === 0 ? count.dataset.none : (total === 1 ? count.dataset.one : count.dataset.many);
            count.textContent = (label || '').replace('%d', total);
        }
    };

    input.addEventListener('input', () => {
        clearTimeout(timer);
        timer = setTimeout(search, 120);
    });

    // Enter plays from the first matching line.
    input.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            search();
            playFrom(lines.findIndex((line) => !line.hidden));
        }
    });
};

/**
 * Sticky player: the transcript sits in a dock above the fixed bar, opened with the "Transcript" button.
 * The dock follows the bar's height and is hidden while the bar is hidden (closed by the visitor).
 */
const setupDock = (dock) => {
    dock.dataset.ready = '1';
    const toggle = dock.querySelector('.h5ap-transcript-dock__toggle');
    const panel = dock.querySelector('.h5ap-transcript');
    const root = document.getElementById(dock.dataset.player);
    if (!toggle || !panel || !root) {
        return;
    }

    const setOpen = (open) => {
        dock.classList.toggle('is-open', open);
        toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
        panel.open = open;
    };
    setOpen(dock.dataset.open === '1');
    toggle.addEventListener('click', () => setOpen(!dock.classList.contains('is-open')));
    // The panel's own header also closes it.
    panel.querySelector('.h5ap-transcript__summary')?.addEventListener('click', (event) => {
        event.preventDefault();
        setOpen(false);
    });

    const place = () => {
        const bar = root.querySelector('.h5ap-sticky');
        const visible = Boolean(bar) && bar.getClientRects().length > 0 && getComputedStyle(bar).visibility !== 'hidden';
        dock.hidden = !visible;
        if (visible) {
            dock.style.setProperty('--h5ap-dock-bottom', `${Math.round(bar.getBoundingClientRect().height) + 12}px`);
        }
    };
    place();
    if (typeof MutationObserver !== 'undefined') {
        new MutationObserver(place).observe(root, { childList: true, subtree: true, attributes: true, attributeFilter: ['style', 'class'] });
    }
    window.addEventListener('resize', place);
};

const initTranscripts = () => {
    document.querySelectorAll('.h5ap-transcript[data-player]:not([data-ready])').forEach(setupTranscript);
    document.querySelectorAll('.h5ap-transcript-dock[data-player]:not([data-ready])').forEach(setupDock);
};

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initTranscripts);
} else {
    initTranscripts();
}
document.addEventListener('h5ap_init', initTranscripts);

// Elementor re-renders widgets while editing; set up any new transcript it adds.
if (window.jQuery) {
    window.jQuery(window).on('elementor/frontend/init', () => {
        window.elementorFrontend?.hooks?.addAction('frontend/element_ready/global', initTranscripts);
    });
}
