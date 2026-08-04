# Fonts

The site self-hosts **Inter Tight** so that no page makes a third-party request.
That matters beyond performance: the app privacy pages state that they hand your
IP to nobody, and a Google Fonts request would quietly make that false.

## What is in the repo

| File | Size | Covers |
|---|---|---|
| `assets/fonts/InterTight-latin.woff2` | 43.8 KB | weights 100–900, Latin subset |

It is the **variable** build — one file spanning the whole weight axis, not a set
of static cuts. `assets/css/styles.css` asks for `550` and `650` in places, and
with a variable font those render exactly rather than snapping to 600/700.

Declared once in `assets/css/fonts.css` with `font-weight: 100 900`.

Monospace accents (eyebrows, tags, stat labels) use the system mono stack and
download nothing. To brand those, add a JetBrains Mono woff2 here and a second
`@font-face`.

## Refreshing or adding a subset

Google Fonts' zip download contains **TTF only** — no woff2. The CSS API serves
woff2, but you have to ask for it with a modern browser User-Agent, otherwise
Google returns TTF.

The API also returns one file *per subset* (latin, latin-ext, cyrillic,
cyrillic-ext, greek, greek-ext, vietnamese) — 7 URLs, not 1. All weights share a
single URL because the font is variable.

PowerShell:

```powershell
$ua = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
$css = Invoke-RestMethod 'https://fonts.googleapis.com/css2?family=Inter+Tight:wght@400..700' -Headers @{ 'User-Agent' = $ua }
$url = [regex]::Match($css, '/\*\s*latin\s*\*/\s*@font-face\s*\{[^}]*?url\((https://[^)]+)\)').Groups[1].Value
Invoke-WebRequest $url -OutFile 'assets/fonts/InterTight-latin.woff2'
```

Swap `latin` in the regex for `latin-ext`, `greek`, etc. to pull another subset,
then add a matching `@font-face` with that subset's `unicode-range`.

## Gotcha worth remembering

Do not paste that regex into a CSS comment. It contains `*/`, which terminates
the comment early and silently invalidates whatever rule follows. That is
exactly how the `@font-face` block got dropped once already — the stylesheet
parsed to **zero rules** and every page fell back to a system font while still
looking superficially fine.

If text ever stops rendering in Inter Tight, check this first:

```js
[...document.styleSheets].find(s => s.href?.includes('fonts.css')).cssRules.length
```

It should be `1`. If it is `0`, the file has a parse error.
