# nilbytestudio.com

The Nilbyte Studio site, plus the support and privacy pages for each app.
Hand-written HTML, CSS and vanilla JS — no build step, no framework, no
third-party requests.

## Layout

```
index.html                       studio site         /
404.html                         not-found page
forewind/index.html              support + FAQ       /forewind/
forewind/privacy/index.html      privacy policy      /forewind/privacy/
refundhound/index.html           product page        /refundhound/
refundhound/support/index.html   support + FAQ       /refundhound/support/
refundhound/privacy/index.html   privacy policy      /refundhound/privacy/

CNAME  robots.txt  sitemap.xml  _config.yml  .gitattributes

assets/
  css/    fonts.css · base.css (shared) · styles.css (studio)
          support.css (docs) · product.css (product pages)
  fonts/  InterTight-latin.woff2 (variable, 100–900)
  images/ nilbyte-mark.svg (favicon) · refundhound/ (product screenshots)
  js/     main.js (studio site only)

docs/     internal notes, brand masters and screenshot originals —
          excluded from the published site
```

**ForeWind has no product page yet**, so `/forewind/` is still its support
page. If one is added, it takes `/forewind/` and support moves to
`/forewind/support/`, matching RefundHound.

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
every app support page and `product.css` for every product page; each app
supplies only an accent colour, selected by `data-app` on `<html>`. Add an app
by copying one `[data-app='…']` block and taking its Primary from the app's
`Resources/Styles/Colors.xaml`. Surfaces stay studio ink and mist — the app
colour is an accent, per the brand sheet.

Load order is always `fonts.css → base.css → styles.css | support.css |
product.css`. The three context sheets are never loaded together, and each one
defines its own type scale, so the context sheet must come last.

**`docs/` is not published.** `_config.yml` excludes it. Do not add a
`.nojekyll` file: that turns Jekyll off and with it the exclusion, which would
make the internal notes publicly reachable.

**Product screenshots are the screen only.** The PNGs in
`assets/images/refundhound/` are cropped to the live screen inside the device
bezel, with the Android system nav bar trimmed off, then reduced to a 256-colour
palette (720px wide, ~600 KB for four). The phone frame is drawn in CSS by
`product.css`, so it stays theme-aware, sharp at any DPI, and platform-neutral
on a page that says "iOS and Android". Unmodified exports are kept in
`docs/refundhound/screenshots-original/`.

The crop is rectangular but the real screen has rounded corners, so a sliver of
bezel survives in each corner of the PNG; `.shot__screen` uses a slightly larger
radius to clip it. Re-exporting at a different device size means re-measuring
the crop — the numbers are recorded in the `product.css` comment.

**Known duplication.** The `[data-app='refundhound']` accent block exists twice:
once in `support.css`, once in `product.css`. Hoisting it into `base.css` is the
better end state, but the generic dark-theme rule there
(`:root:not([data-theme='light'])`) and an app block (`:root[data-app='…']`)
have identical specificity, so the app blocks only win by living in a later
sheet. Moving them means ordering them against that rule by hand, and getting it
wrong would silently repaint the shipped support and privacy pages. One app has
a product page today, so this is one duplicated block. Revisit when the second
one lands.

## Local preview

Any static server from the repo root, e.g.:

```bash
npx --yes serve -l 5173
```

Directory indexes must resolve (`/forewind/` → `forewind/index.html`), which
GitHub, Cloudflare and Netlify Pages all do.
