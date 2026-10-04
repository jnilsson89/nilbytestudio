# Fuseday support & privacy pages — notes and checklist

**Date:** 2026-10-04
**Status:** Implemented — support and privacy pages live in this repo; landing page pending

## Pages

| File | URL |
|---|---|
| `fuseday/support/index.html` | `/fuseday/support/` |
| `fuseday/privacy/index.html` | `/fuseday/privacy/` |
| *(not yet)* `fuseday/index.html` | `/fuseday/` — landing page |

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

## Accent

Fuseday's Glow line cyan `#4DBEF0` (`UiTheme.Cyan` in the game). It is a light-on-dark
colour, so:

| Token | Light | Dark |
|---|---|---|
| `--accent` (graphics, focus ring) | `#108FC8` — 3.63 white / 3.25 tint | `#4DBEF0` — 8.63 bg |
| `--accent-strong` (link text) | `#0D709C` — 5.50 white / 4.92 tint | `#4DBEF0` |
| `--accent-container` (header) | `#D2EFFC` | `#003C55` |
| `--on-accent-container` | `#00202D` — 14.06 | `#D2EFFC` — 9.84 |
| `--mark-bits` | `#0D709C` — 4.59 header / 3.07 stems | `#108FC8` — 3.25 header / 3.02 stems |

`#4DBEF0` itself is 2.11:1 on white and 1.89:1 on `--bg-tint`, failing both 4.5:1 and 3:1,
so light mode uses the same hue darkened — the ForeWind pattern. The brand colour is used
unchanged in dark mode, which is the game's own context.

Known, shared with every app page (not Fuseday-specific): the `.updated` date sits inside
the 0.85-opacity tagline, so it lands at about 3.5:1 (light) / 3.9:1 (dark) on the header —
RefundHound's is 3.3:1. And in dark mode the skip link puts white text on a light
`--accent-strong` (Fuseday 2.11:1, RefundHound 1.70, ForeWind 1.60). Fix both in
`support.css` / `base.css` for all apps at once if at all.

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
- [ ] **Landing page** at `fuseday/index.html`, once the screenshots exist. Until then
      `/fuseday/` — the URL on every shared result — is a 404. When it lands: add it to
      `sitemap.xml`, the README layout, an *About Fuseday* footer link on both pages
      (RefundHound's pattern), and decide whether Fuseday goes on the studio home page and
      in the 404 page's link list.
- [ ] **Publish before the Play Data safety form** — `play-forms.md` needs
      `/fuseday/privacy` live before it is submitted.
- [ ] Re-check both pages whenever `docs/store/support.md` or `privacy.md` changes, and
      when the link thresholds are finalised after the beta.
