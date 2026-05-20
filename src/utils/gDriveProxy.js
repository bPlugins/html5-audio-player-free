/**
 * Google Drive Audio Proxy Utility
 *
 * googleapis.com/drive URLs cannot be streamed directly in the browser
 * due to CORS and Range-request limitations introduced by Google's API policy changes.
 *
 * This utility transparently replaces any googleapis.com/drive URL with
 * a WordPress server-side proxy URL (h5ap_gdrive_proxy action) so that
 * Plyr can load audio metadata (duration) and seek correctly.
 */

export function resolveAudioSrc(src) {
    if (!src || typeof src !== 'string') {
        return src;
    }

    if (src.includes('googleapis.com/drive')) {
        const ajaxUrl =
            (window.h5apPlayer && window.h5apPlayer.ajaxUrl)
                ? window.h5apPlayer.ajaxUrl
                : (window.h5apAll && window.h5apAll.ajaxUrl)
                    ? window.h5apAll.ajaxUrl
                    : '';

        if (ajaxUrl) {
            return ajaxUrl + '?action=h5ap_gdrive_proxy&url=' + encodeURIComponent(src);
        }
    }

    return src;
}
