# ForeWind Support & Privacy pages — design

**Date:** 2026-07-28
**Status:** Implemented

## Goal

Two static pages for ForeWind: a Support/FAQ page and a Privacy Policy that accurately
describes what the app does. Replaces a generic third-party (flycricket) privacy policy that
described data collection the app has never performed.

## Decisions

| Decision | Choice |
|---|---|
| Layout | `index.html` (Support) + `privacy.html`, repo root, cross-linked in footers |
| Hosting | GitHub Pages at `jnilsson89.github.io/forewind-support` — relative links only, no absolute site URL hard-coded |
| Theme | RefundHound's page structure and typography, recoloured with ForeWind's M3 palette from `Resources/Styles/Colors.xaml` |
| Fonts | System stack only — no webfont request, so the pages don't hand a visitor's IP to a third party |
| Dark mode | `prefers-color-scheme`, using the app's own dark tokens |

### Palette mapping

Taken from `ForeWind/src/ForeWind/Resources/Styles/Colors.xaml`:

| Token | Light | Dark |
|---|---|---|
| `--primary` | `#3D9046` (brand green) | `#A7D9A9` (`PrimaryLight`) |
| `--primary-container` | `#C2EDC4` | `#1F3F23` |
| `--surface` | `#F6FAF0` | `#10140E` |
| `--surface-container` | `#ECF1E5` | `#1C201A` |
| `--on-surface` | `#191D17` | `#E1E4DB` |
| `--outline-variant` | `#C2C9BC` | `#43483F` |
| notice card (privacy) | `#FFE8C2` / `#6F4F00` | `#2B1C00` / `#FFDDA8` |

## Source of truth

Every factual claim is drawn from the ForeWind repo, not from the old policy:

- **Wind model** — `ShotCalculationService`: cosine-interpolated, 1 %/mph headwind,
  0.5 %/mph tailwind; silent air-density correction vs ISA standard
- **Location** — `LocationService`: `LocationWhenInUse` only, `GeolocationAccuracy.Medium`,
  reuses a fix up to 10 minutes old
- **Weather** — MET Norway Locationforecast 2.0; User-Agent is
  `ForeWind/{version} ({support email})` and carries nothing about the user or device
- **Cache** — `WeatherCacheEntity`: coordinates rounded to 2 dp (~1 km), 5–10 min TTL
- **Refresh** — `GolfMainViewModel.RefreshWeatherAsync` is pull-to-refresh and **skips the
  fetch while the cache is still valid**; the Support page says so rather than implying a
  forced refresh
- **Permissions** — `AndroidManifest.xml` / `Info.plist`: location, AD_ID, motion; no camera,
  contacts, photos, mic, or background location
- **Ads** — AdMob banner, UMP consent, iOS ATT, SKAdNetwork list
- **Purchases** — `Plugin.InAppBilling`, one-time `remove_ads`, restore flow in Settings
- **No analytics** — verified against `ForeWind.csproj`: only `Plugin.AdMob` and
  `Plugin.InAppBilling` ship; no analytics or crash-reporting package exists

## The Remove Ads caveat

`StartAdsIfEnabled` (iOS `AppDelegate`) and Android's `UseAdMob()` initialise the Google
Mobile Ads SDK at startup based only on the build-level `AdMobConfiguration.AdsEnabled` flag.
The purchase is checked later, in `MainPage.xaml.cs → ConfigureAdBanner`, which only skips
creating the banner. The iOS ATT prompt also fires regardless of purchase state.

The privacy policy states this in a highlighted callout. Claiming the purchase stops data
reaching Google would be false. If the app is later changed to gate SDK initialisation on the
purchase, this callout should be revised.

## Corrections to the previous policy

The flycricket policy claimed the app collects browsing history, general usage/analytics data,
uses "cookies, SDKs, pixels" for analytics, and retains data on a server for 12–24 months.
None of this is true of the code. The new policy replaces those claims with the two real
egress paths (MET Norway, Google AdMob) and an explicit "no fifth row" statement on the
recipients table.

## Follow-ups (not in scope here)

- `AppConfiguration.Links.Website` points at `https://forewind.app/`, which is not where these
  pages are hosted
- Google Play and App Store Connect listings still reference the flycricket privacy URL
