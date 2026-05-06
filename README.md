# Portavox website

Static landing page for [portavox.ai](https://portavox.ai). Hosted on GitHub Pages with a custom domain.

## Stack
Plain HTML + CSS + a tiny JS file for the rotating hero words. No build step.

## Local preview
Just open `index.html` in a browser, or:

```bash
python3 -m http.server 8000
# then visit http://localhost:8000
```

## Deploy
Pushes to `main` deploy automatically via GitHub Pages.
The `CNAME` file in the repo root binds the site to `portavox.ai`.

## Things to swap in
- `assets/intro.mp4` — demo video (16:9 recommended)
- `assets/poster.jpg` — video poster image
- `index.html` — the `#mac-download` `href` once the Mac DMG/ZIP is hosted

## DNS (Namecheap → portavox.ai → Advanced DNS)
| Type  | Host | Value                       |
|-------|------|-----------------------------|
| A     | @    | 185.199.108.153             |
| A     | @    | 185.199.109.153             |
| A     | @    | 185.199.110.153             |
| A     | @    | 185.199.111.153             |
| CNAME | www  | christiaanhenny.github.io.  |

## GitHub Pages settings
Repo → Settings → Pages
- Source: Deploy from branch
- Branch: `main` / `/ (root)`
- Custom domain: `portavox.ai`
- Enforce HTTPS: ✓ (after the cert provisions, ~10–30 min)
