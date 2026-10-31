# Deal Logger website

Three plain HTML pages, no build step:

- `index.html`    Home
- `features.html` Features
- `info.html`     Info (free, privacy, your story)
- `privacy.html`  Privacy Policy (use its link in the Chrome Web Store and Firefox Add-ons forms)
- `dashboard.html` + `dashboard.js`  Live demo of the Sales Tracker (opened by "Show Dashboard")

## Before you publish

1. **Store links** – search the files for `https://chromewebstore.google.com/` and `https://addons.mozilla.org/firefox/` and replace them with your Chrome and Firefox listing URLs.
2. **Your email** – replace `[YOUR EMAIL]` in the footer Contact link.
3. **Footer links** – Privacy is done. Support and Terms still point to `#`.
4. **Accent color** – change `--accent` near the top of each file.

## Hosting

Upload the three files to any static host: GitHub Pages, Netlify, Vercel, Cloudflare Pages, or your own server. `index.html` is the home page.
