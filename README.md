# nilbytestudio.com

The Nilbyte Studio site, plus the support and privacy pages for each app.
Hand-written HTML, CSS and vanilla JS — no build step, no framework, no
third-party requests.

## Layout

```
index.html                    studio site            /
404.html                      not-found page
forewind/index.html           support + FAQ          /forewind/
forewind/privacy/index.html   privacy policy         /forewind/privacy/
refundhound/index.html        support + FAQ          /refundhound/
refundhound/privacy/index.html  privacy policy       /refundhound/privacy/

CNAME  robots.txt  sitemap.xml  _config.yml  .gitattributes

assets/
  css/    fonts.css · styles.css (studio) · support.css (app pages)
  fonts/  InterTight-latin.woff2 (variable, 100–900)
  images/ nilbyte-mark.svg (favicon)
  js/     main.js (studio site only)

docs/     internal notes and brand masters — excluded from the published site
```

**URLs have no file extension.** Each page is `<name>/index.html`, so it serves
as `/forewind/privacy/` rather than `/forewind/privacy.html`. That keeps the
URL independent of how the page happens to be built, which matters because
these addresses go into App Store Connect and Play Console and should not have
to change again. Adding a page means adding a directory.

## Rules worth knowing

**No third-party requests, anywhere.** The app privacy pages state that they
hand a visitor's IP to nobody. A single Google Fonts link would make that
false, which is why Inter Tight is self-hosted. Keep it that way.

**One skeleton, one accent.** `assets/css/support.css` holds the structure for
every app support page; each app supplies only an accent colour, selected by
`data-app` on `<html>`. Add an app by copying one `[data-app='…']` block and
taking its Primary from the app's `Resources/Styles/Colors.xaml`. Surfaces stay
studio ink and mist — the app colour is an accent, per the brand sheet.

**`docs/` is not published.** `_config.yml` excludes it. Do not add a
`.nojekyll` file: that turns Jekyll off and with it the exclusion, which would
make the internal notes publicly reachable.

**Known duplication.** `styles.css` and `support.css` each carry their own copy
of the design tokens, reset and layout primitives — about 150 lines. They are
never loaded together (the studio page uses one, app pages the other), so this
costs nothing at runtime, but a token change has to be made twice. Splitting a
shared `base.css` out is the obvious fix if the pair drifts.

## Local preview

Any static server from the repo root, e.g.:

```bash
npx --yes serve -l 5173
```

Directory indexes must resolve (`/forewind/` → `forewind/index.html`), which
GitHub, Cloudflare and Netlify Pages all do.
