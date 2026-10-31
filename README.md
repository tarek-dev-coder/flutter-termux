# Flutter on Termux

Build Flutter apps on your phone. No PC needed. This 7-step guide covers setup in English, French, and Arabic.

Everything happens on the Android phone itself: SDK setup, building, and running. It works even if your computer is old or you don't have one.

## Run locally

Use a static server. ES modules do not load over `file://`.

```bash
python -m http.server 8000
```

Then open <http://localhost:8000>.

## Deploy to GitHub Pages

1. Push this folder to a GitHub repository.
2. In the repository, go to **Settings → Pages**.
3. Choose **Deploy from a branch**.
4. Pick your branch (for example `main`) and the `/ (root)` folder.
5. Save. The guide goes live at `https://<username>.github.io/<repo>/`.

All paths are relative. `.nojekyll` is included so GitHub Pages serves the files as-is.

This repo assumes the Pages URL is:

```text
https://tarek-dev-coder.github.io/flutter-termux/
```

If the repository name changes, update these places:

- `index.html` — canonical, Open Graph, Twitter, and JSON-LD URLs
- `robots.txt`
- `sitemap.xml`

## SEO

The page includes:

- Title, description, keywords, author, and robots meta
- Canonical URL
- Open Graph and Twitter cards with a 1200×630 preview image
- `WebSite` + `HowTo` JSON-LD structured data
- `robots.txt` and `sitemap.xml`
- Static `<h1>`, summary, and `<noscript>` fallback for crawlers

After deployment, submit the sitemap to:

- Google Search Console
- Bing Webmaster Tools
- Yandex Webmaster

Search engines decide their own rankings. Good metadata and a sitemap help discovery, but no setup can guarantee a top spot on every engine.

## Structure

```text
index.html            markup, SEO tags, and the saved-theme bootstrap script
.nojekyll             tells GitHub Pages to serve files as-is
.gitignore            keeps local tooling out of the repo
css/
  base.css            theme, header, language picker, toast
  guide.css           wizard, code blocks, screenshots, finish screen
data/
  en.js               English copy
  fr.js               French copy
  ar.js               Arabic copy
  icons.js            shared SVG icons
  index.js            data exports
js/
  app.js              entry point and keyboard shortcuts
  wizard.js           step rendering and navigation
  ui.js               theme, toast, language modal, lightbox
  storage.js          safe localStorage wrapper
  utils.js            escaping and small helpers
assets/
  screenshots/        APK, ADB, build, and app-preview screenshots
  Wireless/           localized wireless-debugging screenshots
  icons/              PWA icons
  og-image.png        social preview
favicon.ico / favicon.svg
manifest.webmanifest
robots.txt / sitemap.xml
```

There is no build step and no dependencies: no `node_modules`, no `package.json`. GitHub Pages serves these files directly, so Node is only needed if you want to run a local server yourself.
