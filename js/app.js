import { data } from '../data/index.js';
import { storage } from './storage.js';
import { createWizard } from './wizard.js';
import {
    closeLanguageModal,
    closeLightbox,
    initLightbox,
    initTheme,
    isLanguageModalOpen,
    isLightboxOpen,
    openLanguageModal,
    showToast
} from './ui.js';

const wizard = createWizard();

initTheme();
initLightbox();

function boot() {
    const savedLang = storage.get('lang');
    const savedStep = Number.parseInt(storage.get('step'), 10);

    if (savedLang && data[savedLang]) {
        wizard.start(savedLang, {
            reset: false,
            step: Number.isFinite(savedStep) ? savedStep : 0
        });

        const resumedStep = wizard.getStep();
        if (resumedStep > 0) {
            setTimeout(() => {
                showToast(data[savedLang].resumed.replace('{s}', resumedStep + 1));
            }, 500);
        }
    } else {
        openLanguageModal();
    }
}

document.querySelectorAll('.lang-btn').forEach((button) => {
    button.addEventListener('click', () => wizard.start(button.dataset.lang));
});

document.getElementById('logo-btn')?.addEventListener('click', (event) => {
    event.preventDefault();
    openLanguageModal(event.currentTarget);
});

document.getElementById('btn-lang')?.addEventListener('click', (event) => {
    openLanguageModal(event.currentTarget);
});

document.addEventListener('keydown', (event) => {
    if (isLightboxOpen()) {
        if (event.key === 'Escape') closeLightbox();
        return;
    }

    if (isLanguageModalOpen()) {
        if (event.key === 'Escape' && wizard.hasStarted()) closeLanguageModal();
        return;
    }

    const tag = document.activeElement ? document.activeElement.tagName : '';
    if (['INPUT', 'TEXTAREA', 'SELECT'].includes(tag)) return;
    if (tag === 'IMG' && (event.key === 'Enter' || event.key === ' ')) return;
    if ((event.key === 'Enter' || event.key === ' ') && ['BUTTON', 'A'].includes(tag)) return;

    const isRtl = document.documentElement.dir === 'rtl';
    const nextKey = isRtl ? 'ArrowLeft' : 'ArrowRight';
    const prevKey = isRtl ? 'ArrowRight' : 'ArrowLeft';

    if (event.key === nextKey || event.key === 'Enter') {
        event.preventDefault();
        wizard.next();
    } else if (event.key === prevKey) {
        event.preventDefault();
        wizard.prev();
    } else if (event.key === 'Escape') {
        openLanguageModal();
    }
});

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot, { once: true });
} else {
    boot();
}
