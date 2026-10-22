# nilbytestudio.com

The Nilbyte Studio site, plus the support and privacy pages for each app.
Hand-written HTML, CSS and vanilla JS — no build step, no framework, no
third-party requests.

## Layout

```
index.html                       studio site         /
404.html                         not-found page
forewind/index.html              product page        /forewind/
forewind/support/index.html      support + FAQ       /forewind/support/
forewind/privacy/index.html      privacy policy      /forewind/privacy/
refundhound/index.html           product page        /refundhound/
refundhound/support/index.html   support + FAQ       /refundhound/support/
refundhound/privacy/index.html   privacy policy      /refundhound/privacy/
fuseday/index.html               product page        /fuseday/
fuseday/support/index.html       support + FAQ       /fuseday/support/
fuseday/privacy/index.html       privacy policy      /fuseday/privacy/
jingledrop/index.html            product page        /jingledrop/
jingledrop/support/index.html    support + FAQ       /jingledrop/support/
jingledrop/privacy/index.html    privacy policy      /jingledrop/privacy/

CNAME  robots.txt  sitemap.xml  _config.yml  .gitattributes

assets/
  css/    fonts.css · base.css (shared) · styles.css (studio)
          support.css (docs) · product.css (product pages)
  fonts/  InterTight-latin.woff2 (variable, 100–900)
  images/ nilbyte-mark.svg (favicon) · forewind/ · refundhound/ · fuseday/ ·
          jingledrop/
          (product screenshots and share cards)
  js/     main.js (studio site only)

docs/     internal notes, brand masters and screenshot originals —
          excluded from the published site
```

**ForeWind's support page moved** from `/forewind/` to `/forewind/support/`
in October 2026, when the product page took the address. Old deep links such
as `/forewind/#compass-wrong` are forwarded by a small inline script in
`forewind/index.html`; keep its id list in step with the support page. The
bare `/forewind/` is still `AppConfiguration.Links.Website` in the app and the
Support URL in both store consoles. It now lands on the product page, which
links to support and shows the email address.

**Fuseday's product page is also the address on every shared result**: the
game's share text links to `nilbytestudio.com/fuseday`. It has no store badges
while the game is in closed beta, because a closed-test Play listing only opens
for invited testers.

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

Fuseday's are simpler: Unity draws edge to edge, so the S22 captures have no
status bar, nav bar or bezel to crop. They are scaled from 1080×2340 to
720×1560 (~380 KB for four, small enough unquantised), and the app block sets
`--shot-ratio` to match. Originals are in `docs/fuseday/screenshots-original/`.

Jingle Drop is the first landscape game. Its S22 captures are 2340×1080, scaled to an
exact half (1170×540), and its pages use `.shot--landscape`, a phone on its side whose
padding and corners scale off the short side. Feature rows and the hero with a landscape
phone stack until 64rem (`.feature--landscape`, `.hero__inner--landscape`), because a
sideways phone needs twice the room. Originals are in `docs/jingledrop/screenshots-original/`.

**Known duplication.** Each app's `[data-app='…']` accent block exists twice: once in `support.css`, once in `product.css`. Hoisting it into `base.css` is the
better end state, but the generic dark-theme rule there
(`:root:not([data-theme='light'])`) and an app block (`:root[data-app='…']`)
have identical specificity, so the app blocks only win by living in a later
sheet. Moving them means ordering them against that rule by hand, and getting it
wrong would silently repaint the shipped support and privacy pages. All three
apps have product pages now, so hoisting is worth doing — as its own change,
with every page checked in both themes.

## Local preview

Any static server from the repo root, e.g.:

```bash
npx --yes serve -l 5173
```

Directory indexes must resolve (`/forewind/` → `forewind/index.html`), which
GitHub, Cloudflare and Netlify Pages all do.
