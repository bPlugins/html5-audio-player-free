/**
 * Escape a value for safe use inside HTML text or a quoted attribute.
 * Skin templates are injected by Plyr as raw HTML, so every dynamic value must pass through here.
 */
export const escHTML = (value = '') => String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');

/**
 * Drop script-capable URLs (javascript:, vbscript:, non-image data:). Returns the URL unescaped,
 * so it can be used directly in JSX (React escapes attributes itself).
 */
export const safeURL = (value = '') => {
    const url = String(value ?? '').trim();
    // Strip control chars/whitespace before the protocol check (browsers ignore them, e.g. "java\tscript:")
    const normalized = url.replace(/[\u0000- ]/g, '');
    if (/^(javascript|vbscript):/i.test(normalized) || (/^data:/i.test(normalized) && !/^data:image\/(png|jpe?g|gif|webp);/i.test(normalized))) {
        return '';
    }
    return url;
};

/**
 * Safe URL escaped for use in src/href inside an HTML template string.
 */
export const escURL = (value = '') => escHTML(safeURL(value));
