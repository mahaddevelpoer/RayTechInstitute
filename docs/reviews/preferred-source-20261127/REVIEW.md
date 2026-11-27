# Official Google Preferred Sources widget

Implementation follows https://developers.google.com/search/docs/appearance/preferred-sources (standard script and declarative container; documented SDK callback only to rescan a replacement page).

- Shared root client hook reads the actual URL and robots/googlebot metadata before mounting.
- Only academic route families and indexable article detail routes qualify. Homepage / and /index.html, noindex/none, absent robots metadata, admin, unrelated pages, blog listings and the legacy /blogs/post/ route are excluded.
- The only inserted markup is Google's div with google-add-preferred-source-btn and data-lang=en. It sits directly after the main H1. No custom button, icons, CSS or fallback link.
- Container is created before the asynchronous official https://news.google.com/swg/js/v1/publisher.js script is appended to head. Existing containers/scripts are reused; repeated setup and Strict Mode replay do not add duplicates.
- Metadata changes are observed so a later noindex removes the container. Framework route changes can rescan through Google's documented callback API without another loader.
- Firebase/Cloudflare CSP permits exactly https://news.google.com for script, connect and frame directives. Existing sandbox-specific restrictions remain intact.

Validation: eight focused/widget-routing and Cloudflare tests passed; local typecheck passed. Isolated browser fixtures used the actual remote Google script and verified the official shadow-DOM button at 360/1366px across academic/future-article and excluded routes (12 scenarios). No account preference was changed and no widget flow was clicked.

Full application export/browser build and publication status are recorded in build-receipt.json when completed. This feature is added to the previous unpublished educational cleanup branch; no existing article noindex policy is changed. Publication still requires approval for the combined current changes under AGENTS.md.

Final application result: artifact-only build 45967899465 (source cb72aa1703129c0ad5dd61433fbfab43045e0371) passed. Fourteen real application browser scenarios passed: six official Google-rendered widgets directly below H1 at 360/1366px, and eight excluded-page cases. There was one head loader/container on each eligible page and none on excluded pages. The real SDK rendered its own shadow-DOM UI without app CSS/icons or fallback buttons. Inspected mobile note and desktop Python screenshots. Existing academic resources, all 639 article noindex rules, prepared audio and the previous cleanup checks passed. No production deployment or source-preference account action was performed.
