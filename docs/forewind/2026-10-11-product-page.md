# ForeWind product page

**Date:** 2026-10-11
**Status:** Implemented

## What changed

- `forewind/index.html` is now a product page, in the RefundHound/Fuseday layout
  (`product.css`, `data-app="forewind"`).
- The support page moved to `forewind/support/index.html` (`/forewind/support/`). Its
  relative links, canonical URL and footer were updated; the privacy page's footer now
  points at `../support/` and gains an "About ForeWind" link, as RefundHound's does.
- Old deep links such as `/forewind/#compass-wrong` are forwarded to
  `/forewind/support/#compass-wrong` by a small inline script in the product page's
  `<head>`. Its id list must match the ids in `forewind/support/index.html`.
- `product.css` gained the ForeWind accent block, copied from `support.css`.
- Studio home: the ForeWind card gains a "Learn more" link next to Support.
- `404.html` now lists every app's product, support and privacy pages (it still had
  RefundHound's support at `/refundhound/` and no Fuseday).

## Assets

- **Screenshots** are the English Android captures from the ForeWind repo's
  `docs/store/play-listing/appstore-screenshot-N-original-en.png` (598×1296), with the
  80 px system nav bar cropped off to 598×1216, as RefundHound's are. They are kept at
  native size rather than upscaled: the frame is at most 272 CSS px, so 598 covers 2×
  screens. Saved in `assets/images/forewind/` as `compass.png`, `plays-as.png`,
  `weather.png` and `settings.png`, with originals in `docs/forewind/screenshots-original/`.
  Android rather than iPhone shots because the CSS frame reads as an Android phone, and an
  iOS UI inside it looked wrong.
- **Known flaw:** the English Settings capture shows Swedish unit names ("Meter per
  sekund (m/s)"). Swap `settings.png` when there is a clean re-capture.
- **Share card** `assets/images/forewind/og-cover.png` (1200×630) is rendered from
  `docs/forewind/og-cover.html` with headless Edge:

  ```
  msedge --headless=new --hide-scrollbars --force-device-scale-factor=1
         --allow-file-access-from-files --window-size=1200,630
         --screenshot=og-cover.png docs/forewind/og-cover.html
  ```

## Copy sources

Every claim is from the ForeWind repo's `docs/store/play-listing/play-listing.md`
("Claims verified against the codebase") or from the support page, which is itself
sourced from the code. The "150 m plays like 180 m into 10 m/s" example is read off
the hero screenshot; the iPhone capture says 185 m, so re-check it if the shots change.
The privacy panel names both things that leave the phone (the
position sent to MET Norway, and the Google-served banner). It does not claim "no
tracking", because the privacy policy's Remove Ads caveat says the Google SDK still
starts after the purchase.

## Follow-ups (not done here)

- App Store Connect and Play Console list `https://nilbytestudio.com/forewind/` as the
  Support URL. That still works, since it lands on the product page, which links to
  support and shows the email. Pointing them at `/forewind/support/` would save a click.
- `AppConfiguration.Links.Website` in the app is also `/forewind/`. That is now the
  better target for it, so no change is needed.
