import { storage } from './storage.js';

const DARK_CODE_THEME = 'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/atom-one-dark.min.css';
const LIGHT_CODE_THEME = 'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/github.min.css';
const DARK_BG = '#0d1117';
const LIGHT_BG = '#f6f8fa';
const FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

const toast = document.getElementById('toast');
const modal = document.getElementById('language-modal');
const lightbox = document.getElementById('lightbox');
const lightboxImage = document.getElementById('lightbox-img');
const lightboxClose = document.getElementById('lightbox-close');
const themeToggle = document.getElementById('theme-toggle');
const codeTheme = document.getElementById('hljs-theme');
const themeColorMeta = document.querySelector('meta[name="theme-color"]');

let toastTimer;
let modalOpen = false;
let lightboxOpen = false;
let modalTrigger = null;
let lightboxTrigger = null;

function isVisible(element) {
    if (!element || !element.isConnected) return false;
    const style = getComputedStyle(element);
    return style.display !== 'none' && style.visibility !== 'hidden' && element.getClientRects().length > 0;
}

function setBodyLock() {
    document.body.classList.toggle('no-scroll', modalOpen || lightboxOpen);
}

function focusableItems(container) {
    return Array.from(container.querySelectorAll(FOCUSABLE)).filter(isVisible);
}

function trapTab(event, container) {
    if (event.key !== 'Tab') return;

    const items = focusableItems(container);
    if (items.length === 0) {
        event.preventDefault();
        return;
    }

    const first = items[0];
    const last = items[items.length - 1];
    const active = document.activeElement;

    if (event.shiftKey && (active === first || !container.contains(active))) {
        event.preventDefault();
        last.focus();
    } else if (!event.shiftKey && (active === last || !container.contains(active))) {
        event.preventDefault();
        first.focus();
    }
}

function restoreFocus(trigger, fallback) {
    const target = isVisible(trigger) ? trigger : fallback;
    if (target && typeof target.focus === 'function') target.focus();
}

export function showToast(message) {
    clearTimeout(toastTimer);
    toast.textContent = message;
    toast.classList.add('show');
    toastTimer = setTimeout(() => toast.classList.remove('show'), 3000);
}

export function openLanguageModal(trigger) {
    if (modalOpen) return;

    modalTrigger = trigger || document.activeElement;
    modal.classList.remove('hidden');
    modal.setAttribute('aria-hidden', 'false');
    modalOpen = true;
    setBodyLock();

    const firstButton = modal.querySelector('.lang-btn');
    if (firstButton) firstButton.focus();
}

export function closeLanguageModal() {
    modal.classList.add('hidden');
    modal.setAttribute('aria-hidden', 'true');

    if (!modalOpen) return;

    modalOpen = false;
    setBodyLock();
    const trigger = modalTrigger;
    modalTrigger = null;
    restoreFocus(trigger, document.getElementById('btn-lang'));
}

export function isLanguageModalOpen() {
    return modalOpen;
}

function applyTheme(theme) {
    const isDark = theme !== 'light';
    document.documentElement.classList.toggle('dark', isDark);
    themeToggle.textContent = isDark ? '☀️' : '🌙';
    themeToggle.setAttribute('aria-label', isDark ? 'Switch to light theme' : 'Switch to dark theme');
    codeTheme.href = isDark ? DARK_CODE_THEME : LIGHT_CODE_THEME;
    if (themeColorMeta) themeColorMeta.setAttribute('content', isDark ? DARK_BG : LIGHT_BG);
}

export function initTheme() {
    applyTheme(storage.get('theme') === 'light' ? 'light' : 'dark');

    themeToggle.addEventListener('click', () => {
        const nextTheme = document.documentElement.classList.contains('dark') ? 'light' : 'dark';
        applyTheme(nextTheme);
        storage.set('theme', nextTheme);
    });
}

export function openLightbox(src, alt, trigger) {
    lightboxTrigger = trigger || document.activeElement;
    lightboxImage.src = src;
    lightboxImage.alt = alt || '';
    lightbox.classList.remove('hidden');
    lightbox.setAttribute('aria-hidden', 'false');
    lightboxOpen = true;
    setBodyLock();
    lightboxClose.focus();
}

export function closeLightbox() {
    lightbox.classList.add('hidden');
    lightbox.setAttribute('aria-hidden', 'true');
    lightboxImage.removeAttribute('src');

    if (!lightboxOpen) return;

    lightboxOpen = false;
    setBodyLock();
    const trigger = lightboxTrigger;
    lightboxTrigger = null;
    restoreFocus(trigger, null);
}

export function isLightboxOpen() {
    return lightboxOpen;
}

export function initLightbox() {
    lightboxClose.addEventListener('click', closeLightbox);
    lightboxImage.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', (event) => {
        if (event.target === lightbox) closeLightbox();
    });
    lightbox.addEventListener('keydown', (event) => trapTab(event, lightbox));
    modal.addEventListener('keydown', (event) => trapTab(event, modal));
}
