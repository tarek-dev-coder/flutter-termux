const PREFIX = 'flutter_';

function read(key) {
    try {
        return localStorage.getItem(PREFIX + key);
    } catch {
        return null;
    }
}

function write(key, value) {
    try {
        localStorage.setItem(PREFIX + key, String(value));
    } catch {
        // Storage can be blocked (private mode, old WebView). The guide still works.
    }
}

function remove(key) {
    try {
        localStorage.removeItem(PREFIX + key);
    } catch {
        // Ignore storage errors.
    }
}

export const storage = { get: read, set: write, remove };
