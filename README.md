# Tishan Guha Roy: Portfolio

Static portfolio site (plain HTML, CSS and JS, no build step).

## Deploy on GitHub Pages

1. Create a new public repo named `<your-github-username>.github.io` (this gives you the root URL `https://<username>.github.io`). Any other repo name works too, but then the URL will be `https://<username>.github.io/<repo>/`.
2. Upload `index.html`, `style.css`, `script.js` and your resume PDF (see below) to the repo root.
3. In the repo go to **Settings → Pages**, set **Source** to *Deploy from a branch*, choose branch `main` and folder `/ (root)`, then save.
4. Wait a minute or two and visit your URL.

Or from the terminal:

```bash
git init
git add .
git commit -m "Add portfolio site"
git branch -M main
git remote add origin https://github.com/<username>/<username>.github.io.git
git push -u origin main
```

## Resume download button

Place your resume in the repo root as `Tishan_Guha_Roy_Resume.pdf`, or edit the link in `index.html`. Note that a PDF resume usually contains your phone number, so consider a redacted copy for a public site.

## Customising

- Text lives in `index.html`; colours are CSS variables at the top of `style.css`.
- The rotating hero lines are in the `lines` array in `script.js`.
