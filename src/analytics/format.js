import { __, sprintf } from '@wordpress/i18n';

const numberFormat = new Intl.NumberFormat();

export const formatNumber = (value) => numberFormat.format(Math.round(Number(value) || 0));

export const formatDuration = (totalSeconds) => {
	const seconds = Math.max(0, Math.round(Number(totalSeconds) || 0));
	const h = Math.floor(seconds / 3600);
	const m = Math.floor((seconds % 3600) / 60);
	const s = seconds % 60;
	if (h > 0) {
		/* translators: 1: hours, 2: minutes */
		return sprintf(__('%1$dh %2$dm', 'html5-audio-player'), h, m);
	}
	if (m > 0) {
		/* translators: 1: minutes, 2: seconds */
		return sprintf(__('%1$dm %2$ds', 'html5-audio-player'), m, s);
	}
	/* translators: %d: seconds */
	return sprintf(__('%ds', 'html5-audio-player'), s);
};

export const formatDate = (isoDate, withYear = false) => {
	const [y, m, d] = String(isoDate).split('-').map(Number);
	const date = new Date(Date.UTC(y, (m || 1) - 1, d || 1));
	return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: withYear ? 'numeric' : undefined, timeZone: 'UTC' });
};

export const sourceHost = (source) => {
	try {
		const url = new URL(source, window.location.origin);
		if (url.host !== window.location.host) {
			return url.host;
		}
		// Show the folder too (2026/09/a.mp3), so two uploads with the same name can be told apart.
		const inUploads = url.pathname.match(/\/uploads\/(.+)$/);
		return decodeURIComponent(inUploads ? inUploads[1] : url.pathname.split('/').slice(-2).join('/'));
	} catch (e) {
		return '';
	}
};
