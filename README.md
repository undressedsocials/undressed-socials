# undressed.socials

Boutique social media agency website by Linda Hiller. Static site (HTML/CSS/JS),
prototype exported from Claude Design and hosted on Vercel for testing.

## Build note (performance setup, 2026-07-01)

The browser no longer compiles JSX — `index.html` loads a precompiled bundle:

- `js/bundle.min.js` — all ten `js/*.jsx` files compiled (Babel, preset-react) and minified (terser), concatenated in this order: components, tweaks-panel, data, fx, chrome, home-layouts, pages-a, pages-b, pages-c, app.
- `js/vendor/` — self-hosted React 18.3.1 production UMD builds.

**If you edit any `js/*.jsx` file, you must rebuild `js/bundle.min.js`** (npx: `babel --presets @babel/preset-react`, concatenate in the order above, then `terser --compress --mangle`), otherwise the change won't appear on the site. The `.jsx` sources stay in the repo as the source of truth.

Fonts are served as woff2 (converted with fonttools); the `.ttf` files remain as fallback only.
