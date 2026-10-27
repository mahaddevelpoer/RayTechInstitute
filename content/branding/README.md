# RayTech Institute logo delivery

The supplied circular RT graduation-cap logo is the edit target, not a request for a new brand design. `raytech-logo-source.png` is the reviewed cutout. The original white interior of the circular badge is retained as part of the artwork for readability; the outside background is transparent. The source photograph in Downloads is unchanged.

`scripts/prepare-brand-assets.mjs` creates a 2560 x 2560 PNG export, a 192px transparent header WebP, standard square PNG favicons, Apple/Android icons and a small three-frame ICO. Resizing delivery assets does not add real detail beyond the supplied source. The large HD export is not downloaded by the site header.

Header images use contain sizing, reserved square dimensions and no additional box, colored frame or decorative crop. Homepage checks passed at 375, 768 and 1280px in both light and dark themes.

The favicon URLs remain stable. Root metadata references `/favicon.ico` and `/favicon-96x96.png`, plus smaller browser alternatives and the Apple touch icon. Duplicate manually written favicon tags were removed in favor of Next metadata. Public robots rules allow the homepage and icon paths. After an approved release, check the actual HTTPS icon responses and request a homepage recrawl through Search Console if needed.

Google's favicon guidance: https://developers.google.com/search/docs/appearance/favicon-in-search . Eligibility and correct files do not guarantee Google will show the favicon or update it immediately; Google describes recrawling as taking days to weeks.
