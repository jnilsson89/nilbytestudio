# Jingle Drop product, support & privacy pages — notes and checklist

**Date:** 2026-10-22
**Status:** Written on branch `jingledrop/site-pages`, with all images.

## Pages

| File | URL |
|---|---|
| `jingledrop/index.html` | `/jingledrop/` — product page |
| `jingledrop/support/index.html` | `/jingledrop/support/` |
| `jingledrop/privacy/index.html` | `/jingledrop/privacy/` |

The product page is Fuseday's with the content swapped. It keeps the same top bar, hero, feature rows, facts grid, privacy panel, help section and footer.

Like Fuseday, it has **no store badges** while the game is in closed test. The status line says "Coming soon to Android", and the structured data has no `downloadUrl`.

The support and privacy pages are Fuseday's with the content swapped and `data-app="jingledrop"`. They add no new CSS beyond the accent block.

## What is new: a landscape phone

Jingle Drop is the first landscape game, and a portrait frame at 272 px wide would show its screenshots 125 px tall. `product.css` gains three classes:

- **`.shot--landscape`:** a phone on its side, up to 540 px wide. The portrait frame scales its padding and corners off its width, which is the phone's short side. This one scales them off `--shot-short` (width × 1080/2340), so both frames have the same bezel.
- **`.feature--landscape` and `.hero__inner--landscape`:** between 48rem and 64rem these stack instead of sitting side by side, because a sideways phone needs about twice the room.

Checked in the browser:
- 1024 px: side by side.
- 768 px: stacked.
- 375 px: stacked, no horizontal scroll.
- Light and dark modes.

## Source of truth

The text comes from the game repository (`SantasSleigh`), not from here:

- `docs/store/support.md`: how to play, scoring, streaks, lives, high scores, FAQ;
- `docs/store/privacy.md`: the policy;
- `docs/store/play-listing/play-listing.md` and `docs/store/play-forms.md`: facts the pages must agree with (no internet permission, no AD_ID, Auto Backup, the Families policy).

If either page changes, change the game repo's source first, or record why they differ. Today's differences, all deliberate:

- The site uses the first person ("I", "me") where the source says "we", to match the other apps.
- **The privacy page adds the site's standard sections:** *Backups*, *Contacting support*, *Retention and deletion*, *Your rights*, and *Who is responsible* (with the address and IMY). It also mentions the AndroidX signature-level permission.
- **Its *Children* section is longer than the other apps'.** Jingle Drop is the first app aimed at children: it says why there is nothing for a parent to consent to, and names COPPA and the GDPR's rules for children.
- **The support page adds two items:** "Which devices are supported?" (Android 8.0+, closed test, no iPhone) and a keyboard note.

## Accent — the game's own colours

Like the other apps, every colour comes from the game, here `Assets/NilbyteStudio/SantaRun/Resources/SantaUiTheme.asset`.

The game is a night sky in every scene, so, like Fuseday, the header is the game's panel navy in both modes.

| Token | Game source | Light | Dark |
|---|---|---|---|
| `--accent-container` (header) | `PanelColor` | `#142142` | `#142142` |
| `--on-accent-container` | `TextColor` | `#FFFFFF` — 15.8:1 | same |
| `--accent` / `--accent-strong` | `PrimaryColor` (light) / `AccentColor` (dark) | `#C7333D` — 5.29 white, 4.9 tint | `#FFD66B` — 13.1 on bg |
| `--mark-bits` | `PrimaryColor` lightened | `#D9434A` — 3.66 header / 4.33 stems | same |

Light theme-color is `#142142`. The contrast workings are in the `support.css` comment.

## Images

| File | Source |
|---|---|
| `assets/images/jingledrop/glow.png` | 2340×1080 capture halved to 1170×540, from the game repo's capture tool |
| `assets/images/jingledrop/stars.png` | S22 capture, halved |
| `assets/images/jingledrop/streak.png` | Capture tool: a ×4 hit, halved |
| `assets/images/jingledrop/best.png` | Capture tool: game over with a "New best!" #1 medal, halved |

These are the same raw captures as the Play screenshots. The game repo's `docs/store/play-listing/play-listing.md` says how they are made.
| `assets/images/jingledrop/og-cover.png` | `docs/jingledrop/og-cover.html` rendered with headless Edge (the command is in the file) |

The originals are in `docs/jingledrop/screenshots-original/`.

The halved PNGs are about 1 MB each. That's fine for now, but quantise them (as RefundHound's are) before the page gets real traffic.

## To do

- [ ] **Set up the `jingledrop@nilbytestudio.com` mailbox** before the pages go live.
- [ ] **Publish before the Play Data safety form**, which needs `/jingledrop/privacy` live.
- [ ] **At public launch:**
  - on the product page: the store badges and `downloadUrl`;
  - on the home page: the badge to *Live*, a Google Play link, a `makesOffer` entry, and "Apps shipped".
- [ ] **When ads arrive:** the privacy page, the "no ads" claims on the product page, the home-page card and the money paragraph in About all change.
