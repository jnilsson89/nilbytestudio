# Store privacy declarations — checklist

Everything that needs changing in Google Play Console and App Store Connect so both listings
match the privacy policy at `https://jnilsson89.github.io/forewind-support/privacy.html`.

Derived from the ForeWind source and from the privacy manifests inside the AdMob bindings —
not from the old flycricket policy.

**Status as of 28 July 2026**

| Section | State |
|---|---|
| 0. Policy URL on both stores | Done |
| 1. Play Data safety form | Done, including the corrected diagnostics rows |
| 2. App Store Connect labels | Done, including the corrected diagnostics rows |
| 3. iOS privacy manifest | Done — merged, and verified by a CI step that needs no Mac |
| 4. Policy text (GDPR / CPRA) | Done — live, no legal review by choice |
| 5. Consistency check | Policy side done; verify against the two forms |

---

## 0. Both stores — the policy URL

- [x] **Google Play Console** → Policy → App content → Privacy policy →
      `https://jnilsson89.github.io/forewind-support/privacy.html`
- [x] **App Store Connect** → App Information → Privacy Policy URL → same URL
- [x] Remove every remaining reference to the old flycricket URL

> Not a store setting, but related: `AppConfiguration.Links.Website` in the app still points at
> `https://forewind.app/`, which is not where these pages are hosted. Decide whether the app
> should link to the GitHub Pages URL or whether `forewind.app` will eventually serve them.

---

## 1. Google Play — Data safety form

The definition that catches people out: Play counts data as **collected** when it is
*transmitted off the device*, and **shared** when it reaches a *third party*. Having no server
of your own does not make it "not collected" — MET Norway and Google are both third parties.

### Data types

| Data type | Collected | Shared | Purpose | Why |
|---|---|---|---|---|
| **Precise location** | Yes | Yes | App functionality | `WeatherService` sends lat/lon at `F4` (~10 m) to MET Norway. Play's "precise" threshold is an area under 3 km², so this qualifies. |
| **Approximate location** | Yes | Yes | Advertising or marketing | Derived by AdMob from the IP address |
| **Device or other IDs** | Yes | Yes | Advertising or marketing; Fraud prevention, security & compliance | Advertising ID, used by the Mobile Ads SDK |
| **App interactions** | **Yes** | Yes | Advertising or marketing; Analytics | ⚠️ **Corrected.** Google's SDK manifest declares `ProductInteraction` — this is no longer "verify", it is collected |
| **Crash logs** | **Yes** | Yes | Analytics | ⚠️ **Corrected.** Google's SDK manifest declares `CrashData`. Your own code ships no crash reporter, but the SDK's collection counts as yours to declare |
| **Diagnostics** | **Yes** | Yes | Analytics; Advertising or marketing | ⚠️ **Corrected.** Google's SDK declares `PerformanceData` and `OtherDiagnosticData` |
| Personal info, messages, photos, contacts, calendar, files | **No** | No | — | No such permission or feature exists |

- [x] All rows above entered
- [x] **Re-check the three corrected rows if you already submitted this form** — see the
      correction note at the foot of this file

### Security & handling

- [x] Data is **encrypted in transit** → Yes (HTTPS throughout)
- [x] Data deletion → no accounts exist; answer accordingly rather than claiming a deletion flow
- [x] Users can choose whether data is collected → tied to the location permission and the UMP
      consent form; do not mark the advertising ID as optional outside consent regions

### Elsewhere in Play Console

- [x] App content → **Ads** → "Yes, my app contains ads"
- [x] Advertising ID declaration matches the `AD_ID` permission already in `AndroidManifest.xml`
- [x] Target audience → **not** child-directed (the app serves ads)

---

## 2. App Store Connect — App Privacy labels

These rows are taken from Google's own `PrivacyInfo.xcprivacy`, read out of
`Jc.GMA.iOS 12.2.1` and `Jc.UMP.iOS 2.7.3` — not inferred. Google's flags are authoritative for
its SDK, so match them rather than over-declaring.

| Data | Purpose | Linked to user | Used for tracking | Source |
|---|---|---|---|---|
| **Precise Location** | App Functionality | No | No | App code — MET Norway |
| **Coarse Location** | Third-Party Advertising; Analytics; Developer Advertising | Yes | No | GMA SDK |
| **Device ID** | Third-Party Advertising; Analytics; Developer Advertising | Yes | **Yes** | GMA SDK — the only type Google flags as tracking |
| **Advertising Data** | Third-Party Advertising; Analytics; Developer Advertising | Yes | No | GMA SDK |
| **Product Interaction** | Analytics; Third-Party Advertising; Developer Advertising | Yes | No | GMA SDK |
| **Crash Data** | Analytics | No | No | GMA SDK |
| **Performance Data** | Third-Party Advertising; Developer Advertising; Analytics | No | No | GMA SDK |
| **Other Diagnostic Data** | Third-Party Advertising; Developer Advertising; Analytics | No | No | GMA SDK |

- [x] All rows above entered
- [x] ⚠️ **Diagnostics is NOT "none"** — an earlier version of this checklist said to declare
      none. That was wrong: the Mobile Ads SDK collects crash, performance and other diagnostic
      data. If you already submitted the labels, revise them.

The "Used for Tracking = Yes" rows are what justify your ATT prompt. Apple checks the pairing
both ways: prompting without tracking labels, or tracking labels without a prompt, both draw
review attention. `AppDelegate` does call `ATTrackingManager.RequestTrackingAuthorization`, so
the prompt side is satisfied.

Purchases are processed by Apple and are not declared as collected by you.

---

## 3. iOS privacy manifest (code, not a form) — **done**

Merged to `main` in the ForeWind repo. `PrivacyInfo.xcprivacy` now sets `NSPrivacyTracking` =
true and declares one collected data type: precise location, for app functionality, unlinked
and not tracking.

It deliberately does **not** repeat the advertising data types. Verified by reading the package
contents: `Jc.GMA.iOS 12.2.1` and `Jc.UMP.iOS 2.7.3` embed Google's own
`PrivacyInfo.xcprivacy` inside `GoogleMobileAds.framework` and
`UserMessagingPlatform.framework`, and Xcode merges those into the privacy report. Duplicating
them at app level risked contradicting Google's flags on the next SDK bump — an earlier draft
did exactly that, marking coarse location and advertising data as tracking when Google marks
them as not.

`NSPrivacyTrackingDomains` is absent because **Google's manifest declares no tracking domains
either** — the SDK handles ATT compliance in code rather than by domain blocking. This was the
open question that previously needed a Mac; it is now answered from the package itself.

- [x] Merge the branch
- [x] **Verify the merged report.** No Mac required: `scripts/privacy-report.mjs` in the
      ForeWind repo reproduces what Xcode's *Generate Privacy Report* shows, by reading every
      `PrivacyInfo.xcprivacy` in the restore graph. It runs on the existing `macos-latest`
      runner as a step in `ios-release.yml`, prints the merged table to the job summary, and
      works locally too:

      ```
      node scripts/privacy-report.mjs
      ```

- [x] **Guard against SDK drift.** The same script compares against
      `scripts/privacy-baseline.json` and **fails the release build** if an SDK bump changes
      what the app must declare, with instructions in the error. It runs after restore and
      before the build, so drift costs seconds rather than a full archive. Accept a reviewed
      change with `node scripts/privacy-report.mjs --update`.

---

## 4. Policy text — **done**

All three gaps are written into the policy. This was drafted from the app's actual behaviour
and from published regulator and store guidance; it is not legal advice, and no lawyer has
reviewed it. That is a deliberate, recorded decision — see *Proceeding without legal review*
below.

- [x] **Controllership.** The blanket "I am not a controller" claim is gone. The new
      *Who is responsible for your data* section names Nilbyte Studio as controller for support
      correspondence, and acknowledges **joint controllership with Google** for the collection
      and transmission the ad SDK performs — while being clear that what Google subsequently
      does with the data is Google's own.
- [x] **GDPR Art. 13 items.** Added: a *Legal bases* table covering all five purposes, an
      *International transfers* section (MET Norway is in the EEA; Google relies on the EU–US
      Data Privacy Framework and SCCs), the right to complain to a supervisory authority with
      **IMY** named as lead authority, and the controller's postal address in Varberg.
- [x] **CPRA sharing.** A *California privacy rights* section states plainly that personalised
      advertising **is** "sharing" under the CPRA, lists the categories, and gives three working
      opt-out routes (iOS tracking setting, Android advertising ID, Remove Ads). The
      "no sharing" bullet elsewhere in the policy was corrected to match.

The two questions previously left open have been closed by taking the more conservative option
in each case, rather than leaving them hanging:

- [x] **Legal basis for non-personalised ads.** Was legitimate interests. Now **consent**,
      because serving any ad reads and writes information on the device, and the ePrivacy rules
      require consent for that regardless of which GDPR basis applies. Legitimate interests is
      now claimed only for fraud prevention, which is the use it comfortably supports. This is
      the harder position to attack, and it matches what the consent form already does.
- [x] **Joint-controllership allocation.** The policy now points at Google's terms as the
      arrangement between the joint controllers and spells out the split: Google is responsible
      for the data it collects and for answering requests about it; Nilbyte Studio is
      responsible for this policy being accurate, for showing the consent form, and for ads
      running at all.

### Proceeding without legal review

Reviewed by a solicitor: **no**, by choice. Recorded here so the reasoning is not lost.

What that actually risks is modest but not zero. The app collects almost nothing on its own
account; the exposure is the ad SDK, which is the same exposure every free ad-supported app
carries, and this policy now describes it more precisely than most. Regulators prioritise
large-scale processing, and the realistic worst case for an app this size is a complaint that
prompts a fix, not a fine.

Free options if a question ever comes up, none of which involve hiring anyone:

- **IMY** — the Swedish authority publishes guidance for small businesses and answers questions
  from those it regulates. As lead authority for a Varberg-based studio, it is the right first
  call.
- **verksamt.se** — Swedish government business advice, including data protection basics.
- Get a lawyer if a regulator writes to you, if a user complains formally, or if ForeWind ever
  starts collecting data on your own servers. Those are the triggers; until one fires, this is
  proportionate.

---

## 5. Consistency check before shipping

The policy, the Play Data safety form and the Apple labels must agree:

- [ ] Location is **precise**, and is **shared** with MET Norway — in all three places
- [ ] The **advertising identifier** is the item used for tracking; coarse location and
      advertising data are collected but Google does not flag them as tracking
- [ ] **Crash, performance and diagnostic data ARE collected** by the ad SDK — in all three
      places. The policy was corrected on 28 July 2026; the store forms need the same change.

---

## Correction log

**28 July 2026 — diagnostics.** The first version of this checklist told you to declare
diagnostics as *not collected* on both stores, on the basis that `ForeWind.csproj` ships no
analytics or crash-reporting package. That reasoning was right about your code and wrong about
the app: reading `Jc.GMA.iOS 12.2.1`'s embedded privacy manifest shows the Google Mobile Ads
SDK collects `CrashData`, `PerformanceData`, `OtherDiagnosticData` and `ProductInteraction`.
A third-party SDK's collection is yours to declare.

If you have already submitted either store form, three rows need revising:

| Store | Row | Was | Should be |
|---|---|---|---|
| Play | Crash logs | No | **Yes**, shared, Analytics |
| Play | Diagnostics | No | **Yes**, shared, Analytics + Advertising |
| Play | App interactions | *verify* | **Yes**, shared, Advertising + Analytics |
| Apple | Diagnostics | declare none | **Crash Data, Performance Data, Other Diagnostic Data** |
| Apple | Usage Data | absent | **Product Interaction**, linked, not tracking |

The live privacy policy has been updated to match.
