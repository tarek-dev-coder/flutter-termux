import { data, fdroidIcon, successSvg } from '../data/index.js';
import { clamp, escapeHtml } from './utils.js';
import { storage } from './storage.js';
import { closeLanguageModal, openLightbox, showToast } from './ui.js';

const content = document.getElementById('wizard-content');
const progressBar = document.getElementById('progress-bar');
const stepIndicator = document.getElementById('step-indicator');

function scrollToTop() {
    if (typeof window.scrollTo === 'function') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
}

function renderLinks(stepData) {
    return `<div class="download-grid">
        ${stepData.links.map((link) => `
            <a href="${escapeHtml(link.url)}" target="_blank" rel="noopener noreferrer" class="btn-download">
                ${fdroidIcon}<span>${escapeHtml(link.text)}</span>
            </a>`).join('')}
    </div>`;
}

function renderCode(stepData, langData) {
    let html = `<div class="code-wrapper">
        <div class="lang-tag">BASH</div>
        <button class="copy-btn" id="btn-copy" type="button">${langData.copyText}</button>
        <pre><code class="language-bash" id="code-block">${escapeHtml(stepData.code)}</code></pre>
    </div>`;
    if (stepData.extraCode) {
        html += `<div class="code-wrapper">
            <div class="lang-tag">BASH</div>
            <button class="copy-btn" id="btn-copy-extra" type="button">${langData.copyText}</button>
            <pre><code class="language-bash" id="code-block-extra">${escapeHtml(stepData.extraCode)}</code></pre>
        </div>`;
    }
    return html;
}

function renderImage(image) {
    const portraitClass = image.portrait ? ' portrait' : '';
    const dimensions = image.width && image.height
        ? ` width="${image.width}" height="${image.height}"`
        : '';
    return `<figure class="step-figure">
        <img class="screenshot${portraitClass}" src="${escapeHtml(image.src)}" alt="${escapeHtml(image.alt)}"${dimensions} loading="lazy" decoding="async" tabindex="0" role="button">
        ${image.caption ? `<figcaption>${escapeHtml(image.caption)}</figcaption>` : ''}
    </figure>`;
}

function renderImages(stepData) {
    if (!stepData.images || stepData.images.length === 0) return '';

    const useTwoColumns = stepData.imageLayout === 'two'
        || (!stepData.imageLayout && stepData.images.length > 1);
    const gridClass = useTwoColumns ? 'screenshot-grid two' : 'screenshot-grid';

    return `<div class="${gridClass}">
        ${stepData.images.map(renderImage).join('')}
    </div>`;
}

async function copyToClipboard(text) {
    if (navigator.clipboard && window.isSecureContext) {
        try {
            await navigator.clipboard.writeText(text);
            return;
        } catch {
            // Fall through to the older copy path.
        }
    }

    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.setAttribute('readonly', '');
    textarea.style.position = 'fixed';
    textarea.style.top = '-1000px';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();
    textarea.setSelectionRange(0, textarea.value.length);

    let copied = false;
    try {
        copied = document.execCommand('copy');
    } finally {
        textarea.remove();
    }

    if (!copied) throw new Error('Copy command failed');
}

function bindCopyButton(langData) {
    const button = document.getElementById('btn-copy');
    const code = document.getElementById('code-block');
    if (button && code) {
        let resetTimer;
        button.addEventListener('click', async () => {
            clearTimeout(resetTimer);
            try {
                await copyToClipboard(code.textContent);
                button.textContent = langData.copiedText;
                showToast(langData.copiedText);
                resetTimer = setTimeout(() => { button.textContent = langData.copyText; }, 2000);
            } catch {
                showToast(langData.copyFailText);
            }
        });
        try {
            window.hljs?.highlightElement(code);
        } catch {
            // Highlighting is optional.
        }
    }

    const extraButton = document.getElementById('btn-copy-extra');
    const extraCode = document.getElementById('code-block-extra');
    if (extraButton && extraCode) {
        let extraResetTimer;
        extraButton.addEventListener('click', async () => {
            clearTimeout(extraResetTimer);
            try {
                await copyToClipboard(extraCode.textContent);
                extraButton.textContent = langData.copiedText;
                showToast(langData.copiedText);
                extraResetTimer = setTimeout(() => { extraButton.textContent = langData.copyText; }, 2000);
            } catch {
                showToast(langData.copyFailText);
            }
        });
        try {
            window.hljs?.highlightElement(extraCode);
        } catch {
            // Highlighting is optional.
        }
    }
}

function bindScreenshots() {
    document.querySelectorAll('.screenshot').forEach((image) => {
        const open = () => openLightbox(image.currentSrc || image.src, image.alt, image);
        image.addEventListener('click', open);
        image.addEventListener('keydown', (event) => {
            if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                open();
            }
        });
    });
}

export function createWizard() {
    let lang = 'en';
    let step = 0;
    let started = false;
    let finished = false;

    function applyChrome(langData) {
        document.title = langData.docTitle;
        document.documentElement.lang = lang;
        document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
        document.body.style.fontFamily = lang === 'ar' ? "'Cairo', sans-serif" : "'Inter', sans-serif";

        const languageText = document.getElementById('btn-lang-text');
        if (languageText) languageText.textContent = langData.langBtn;

        const languageAction = document.getElementById('btn-lang-action');
        if (languageAction) languageAction.textContent = ' ' + langData.changeLang;

        const logoAction = document.getElementById('logo-action');
        if (logoAction) logoAction.textContent = ' ' + langData.changeLang;
    }

    function render() {
        scrollToTop();

        const langData = data[lang];
        const stepData = langData.steps[step];
        const totalSteps = langData.steps.length;

        storage.set('step', step);
        progressBar.style.width = `${((step + 1) / totalSteps) * 100}%`;
        stepIndicator.textContent = langData.stepOf
            .replace('{c}', step + 1)
            .replace('{t}', totalSteps);

        const block = stepData.links ? renderLinks(stepData) : renderCode(stepData, langData);

        content.innerHTML = `<div class="step-content active">
            <h2 class="step-title"><span aria-hidden="true">${stepData.icon}</span> ${stepData.title}</h2>
            <p class="step-desc">${stepData.desc}</p>
            ${block}
            ${renderImages(stepData)}
            <div class="nav-buttons">
                <button class="btn btn-secondary" id="btn-prev" type="button" ${step === 0 ? 'disabled' : ''}>${langData.prevBtn}</button>
                <button class="btn btn-primary" id="btn-next" type="button">${step === totalSteps - 1 ? langData.doneBtn : langData.nextBtn}</button>
            </div>
            <div class="keyboard-hint">${langData.keyboardHint}</div>
        </div>`;

        document.getElementById('btn-prev').addEventListener('click', prev);
        document.getElementById('btn-next').addEventListener('click', next);

        if (!stepData.links) bindCopyButton(langData);
        bindScreenshots();
    }

    function start(nextLang, options = {}) {
        if (!data[nextLang]) return;

        const reset = options.reset ?? (!started || finished);
        const initialStep = options.step ?? step;
        const lastStep = data[nextLang].steps.length - 1;

        lang = nextLang;
        step = reset ? 0 : clamp(Number.isFinite(initialStep) ? initialStep : 0, 0, lastStep);
        started = true;
        finished = false;

        storage.set('lang', lang);
        storage.set('step', step);

        applyChrome(data[lang]);
        closeLanguageModal();
        render();
    }

    function next() {
        if (finished) return;

        if (step < data[lang].steps.length - 1) {
            step += 1;
            render();
        } else {
            finish();
        }
    }

    function prev() {
        if (finished || step === 0) return;
        step -= 1;
        render();
    }

    function finish() {
        scrollToTop();
        finished = true;
        storage.remove('step');
        progressBar.style.width = '100%';
        stepIndicator.textContent = '';

        const langData = data[lang];
        content.innerHTML = `<div class="step-content active finish">
            ${successSvg}
            <h2>${langData.doneTitle}</h2>
            <p>${langData.doneDesc}</p>
            <button class="btn btn-primary" id="btn-restart" type="button">${langData.restartBtn}</button>
        </div>`;

        document.getElementById('btn-restart').addEventListener('click', () => {
            window.location.reload();
        });
    }

    return {
        start,
        next,
        prev,
        getStep: () => step,
        hasStarted: () => started
    };
}
