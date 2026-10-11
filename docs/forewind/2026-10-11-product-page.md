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

- **Screenshots** are the English 6.7" iPhone captures from the ForeWind repo's
  `docs/store/appstore-listing/appstore-screenshot-N-original-en.png` (1290×2796), scaled
  to 720×1560 in `assets/images/forewind/` as `calculator.png`, `weather.png` and
  `settings.png`. Originals are copied to `docs/forewind/screenshots-original/`. iOS
  exports the screen alone, so there is nothing to crop. The iPhone set was chosen over
  the Play captures because those are 598 px wide and would have to be upscaled.
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
sourced from the code. The "150 m plays like 185 m into 10 m/s" example is read off
the hero screenshot. The privacy panel names both things that leave the phone (the
position sent to MET Norway, and the Google-served banner). It does not claim "no
tracking", because the privacy policy's Remove Ads caveat says the Google SDK still
starts after the purchase.

## Follow-ups (not done here)

- App Store Connect and Play Console list `https://nilbytestudio.com/forewind/` as the
  Support URL. That still works, since it lands on the product page, which links to
  support and shows the email. Pointing them at `/forewind/support/` would save a click.
- `AppConfiguration.Links.Website` in the app is also `/forewind/`. That is now the
  better target for it, so no change is needed.
