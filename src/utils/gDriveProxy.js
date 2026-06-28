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

    let normalizedSrc = src.trim();

    // Convert standard Google Drive sharing/viewer link to direct download link
    if ((normalizedSrc.includes('drive.google.com') || normalizedSrc.includes('docs.google.com')) && !normalizedSrc.includes('/uc')) {
        let fileId = '';
        const fileDMatch = normalizedSrc.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
        if (fileDMatch) {
            fileId = fileDMatch[1];
        } else {
            const idParamMatch = normalizedSrc.match(/[?&]id=([a-zA-Z0-9_-]+)/);
            if (idParamMatch) {
                fileId = idParamMatch[1];
            }
        }
        if (fileId) {
            normalizedSrc = 'https://docs.google.com/uc?export=download&id=' + fileId;
        }
    }

    const ajaxUrl =
        (window.h5apPlayer && window.h5apPlayer.ajaxUrl)
            ? window.h5apPlayer.ajaxUrl
            : (window.h5apAll && window.h5apAll.ajaxUrl)
                ? window.h5apAll.ajaxUrl
                : '';

    if (ajaxUrl) {
        if (normalizedSrc.includes('googleapis.com/drive') || normalizedSrc.includes('docs.google.com/uc') || normalizedSrc.includes('drive.google.com/uc')) {
            return ajaxUrl + '?action=h5ap_gdrive_proxy&url=' + encodeURIComponent(normalizedSrc);
        }

        if (normalizedSrc.includes('soundcloud.com') && !normalizedSrc.includes('api.soundcloud.com') && !normalizedSrc.includes('h5ap_soundcloud_stream')) {
            return ajaxUrl + '?action=h5ap_soundcloud_stream&sc_url=' + encodeURIComponent(normalizedSrc);
        }
    }

    return normalizedSrc;
}
