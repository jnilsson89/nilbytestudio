# Fuseday support & privacy pages — notes and checklist

**Date:** 2026-10-04
**Status:** Implemented — support, privacy and landing pages live in this repo

## Pages

| File | URL |
|---|---|
| `fuseday/index.html` | `/fuseday/` — landing page, and the link on every shared result |
| `fuseday/support/index.html` | `/fuseday/support/` |
| `fuseday/privacy/index.html` | `/fuseday/privacy/` |

The landing page is RefundHound's product page with the content swapped: same top bar,
hero, alternating feature rows, facts grid, privacy panel, help section and footer. Its
text comes from `docs/store/listing.md` and `support.md` in the game repo. Differences:

- **No store badges** while the game is in closed beta: a closed-test Play listing only
  opens for invited testers, so a badge would be a dead end for anyone the share text
  reaches. The status line says "In closed beta on Android" instead, and the structured
  data has no `downloadUrl`. Add both when the game is public (the comment in the hero
  says where).
- **No "What it costs" section**: there is nothing to buy in this build. Revisit if the
  archive ever ships.
- **Screenshots** are the S22 captures from the game repo's
  `docs/store/screenshots/original/`, scaled to 720×1560, in `assets/images/fuseday/`.
  Originals are copied to `docs/fuseday/screenshots-original/`. The hero is the placement
  screen, because it shows the outline; the how-to card is left out because most of it is
  empty screen.
- **Share card** `assets/images/fuseday/og-cover.png` (1200×630): the game's dark
  background, the Nilbyte mark with the game-blue bits, the name, "One board a day.
  Commit once, watch the chain.", and the placement screen in the CSS phone frame. It was
  rendered from HTML with headless Edge in real Inter Tight (the woff2 embedded), not
  composited in GDI+ like RefundHound's.

Both pages are RefundHound's support and privacy pages with the content swapped and
`data-app="fuseday"`: same head, same header lockup and footer, same components
(contact card, quick links, `<details>`, table, summary box, address block). No new CSS
beyond the accent block.

## Source of truth

The text comes from the game repository (`UntitledUnityProject`), not from here:

- `docs/store/support.md` — how to play, par, the five links, midnight, streaks, practice, FAQ
- `docs/store/privacy.md` — the policy
- `docs/store/listing.md` and `docs/store/play-forms.md` — facts the pages must agree with
  (permissions, no internet permission, no AD_ID, Auto Backup)

If either page changes, change the game repo's source first, or record why they differ.
Differences today, all deliberate:

- The site's first person ("I", "me") replaces the source's "we", to match RefundHound and
  ForeWind.
- The privacy page adds the site's standard sections that `privacy.md` lacks: *Backups*
  (expanded from the source's exception paragraph), *Contacting support*, *Retention and
  deletion*, *Your rights*, and *Who is responsible* with the Nilbyte Studio address and
  the IMY complaint right. It also mentions the AndroidX signature-level permission from
  `play-forms.md`. Its date is therefore 4 October 2026, not the source's 30 September.
- The support page adds "Which devices are supported?" (Android, closed beta, no iPhone yet).

**Never mention the tap-to-speed-up skip** on any Fuseday page. The beta survey asks whether
players found it on their own.

## Accent — the game's own colours

Like ForeWind and RefundHound, every colour comes from the app. Fuseday is a Unity game, so
the source is `UntitledUnityProject/unity/Assets/Scripts/UI/UiTheme.cs` (and
`unity/Assets/Scripts/View/BlockPalette.cs` for the mark), not a Colors.xaml. The game is
dark-only, so by Johan's choice the header is **the game's dark screen in both modes**.

| Token | Game source | Light | Dark |
|---|---|---|---|
| `--accent-container` (header) | `UiTheme.Background` | `#141418` | `#141418` |
| `--on-accent-container` | `UiTheme.Text` | `#EDEDF2` — 15.75 (tagline 11.48) | same |
| `--accent` (graphics, focus ring) | `UiTheme.Cyan`, darkened in light | `#108FC8` — 3.63 white / 3.25 tint | `#4DBEF0` — 8.63 bg |
| `--accent-strong` (link text) | `UiTheme.Cyan`, darkened in light | `#0D709C` — 5.50 white / 4.92 tint | `#4DBEF0` |
| `--accent-soft` | derived from the cyan | `rgba(16,143,200,.10)` | `rgba(77,190,240,.12)` |
| `--mark-bits` | `BlockPalette` blue (0.20, 0.45, 0.80) | `#3373CC` — 3.91 header / 4.03 stems | same |

`#4DBEF0` is 2.11:1 on white and 1.89:1 on `--bg-tint`, failing both 4.5:1 and 3:1, so light
mode's body links and graphics use the same hue darkened — the ForeWind precedent
(`#3D9046` → `#2F7238`).

Mark-bit candidates, all game colours (vs `#141418` header / vs `#EDEDF2` stems): cyan
`#4DBEF0` 8.70 / 1.81, link yellow `#FFD040` 12.55 / 1.25, block red `#D95E1C` 4.87 / 3.23,
block green `#59B35C` 7.02 / 2.24, **block blue `#3373CC` 3.91 / 4.03**, block yellow
`#F2D940` 12.93 / 1.22. Blue is the best balanced.

Because the header stays dark on a light page, `:root[data-app='fuseday'] .page-header`
re-scopes three light-mode tokens inside it:

- `--accent: #4DBEF0` — the studio link's focus ring gets the real cyan (8.70:1), not the
  darkened one;
- `--text-strong: #EDEDF2` — the `<h1>` title is coloured by `--text-strong`, which is ink
  `#0E1C2B` in light mode: 1.07:1 on the header, i.e. invisible;
- `--text-muted: #92A7B8` — the privacy page's "last updated" date. Light slate `#5A6B7B`
  would be 2.76:1 inside the 0.85-opacity tagline; `#92A7B8` (the site's dark-mode muted,
  so dark mode is unchanged) is 5.65. The game's Muted `#8A8A99` would be 4.23, under AA.

Light `theme-color` is `#141418` (the header, as RefundHound uses its header colour); dark
stays the site's `#0B1622`.

Known: in dark mode the `#141418` header sits on the `#0B1622` page at 1.01:1 — it separates
by hue only, unlike the other apps' coloured dark headers. Not a WCAG requirement for a
background surface, but it is flatter. The dark-mode skip link (white on a light
`--accent-strong`: Fuseday 2.11, RefundHound 1.70, ForeWind 1.60) is a site-wide issue for
`base.css`.

## Why the folder is lowercase

The game's Settings links and the share card use lowercase URLs —
`https://nilbytestudio.com/fuseday/support`, `/fuseday/privacy` and `nilbytestudio.com/fuseday`
— and GitHub Pages paths are case-sensitive. The folder was first created as `Fuseday/`;
on Windows it has to be renamed through a temporary name, and `git ls-files` must show
`fuseday/…`. GitHub Pages redirects the slash-less forms to `/fuseday/support/` etc.

## To do

- [ ] **Set up the `fuseday@nilbytestudio.com` mailbox** (or alias) before the pages go
      live. Every contact link on both pages points at it, and the Play Console contact
      email, IARC email and listing should use the same address (they are still
      `[contact email — Johan to fill]` in the game repo's `docs/store/`).
- [x] **Landing page** at `fuseday/index.html`, with its sitemap entry, README layout line
      and an *About Fuseday* footer link on both pages.
- [ ] **Johan to decide:** whether Fuseday goes on the studio home page (`index.html`'s app
      cards, structured data and meta description) and in the 404 page's link list, now or
      at public launch.
- [ ] **At public launch:** store badges and `downloadUrl` on the landing page.
- [ ] **Publish before the Play Data safety form** — `play-forms.md` needs
      `/fuseday/privacy` live before it is submitted.
- [ ] Re-check both pages whenever `docs/store/support.md` or `privacy.md` changes, and
      when the link thresholds are finalised after the beta.
