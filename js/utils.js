const HTML_ESCAPES = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
};

export function escapeHtml(value) {
    return String(value).replace(/[&<>"']/g, (char) => HTML_ESCAPES[char]);
}

export function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
}
