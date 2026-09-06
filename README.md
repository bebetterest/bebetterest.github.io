# Yujian Li's personal site

This repository is Yujian Li's academic homepage, built from the [al-folio](https://github.com/alshedivat/al-folio) Jekyll starter and intended for GitHub Pages.

## Content map

- Homepage: `_pages/about.md`
- Archived CV data (not published as a standalone page): `_data/cv.yml`
- Homepage papers: `_bibliography/papers.bib`
- Blog posts: `_posts/`
- Public links: `_data/socials.yml`
- Site identity and deployment URL: `_config.yml`
- Profile photo: `assets/img/prof_pic.jpg`

The site intentionally does not publish a phone number or the original unredacted CV PDF.

## Local preview

The upstream project recommends Docker:

```bash
docker compose pull
docker compose up
```

The site will be available at `http://localhost:8080/` with the root-path configuration.

## GitHub Pages

The repository must be named `bebetterest.github.io` to publish the user homepage at:

```text
https://bebetterest.github.io/
```

Enable GitHub Actions, grant workflow read/write permission, and configure Pages to publish the `gh-pages` branch produced by the included deployment workflow.

Before publishing, the workflow runs `bundle exec ruby test/integration_personal_site.rb`
against the built site. Run the same command after a local production build to
check published-file boundaries, local links, official citations, the sitemap,
and the feed. If adding a new public page deliberately, update its allowlist too.

### One deployment, one canonical domain

The Pages custom domain is now `liyujian.cn`. Keep `url: https://liyujian.cn`,
`baseurl: ""`, and the Pages custom-domain setting in sync. The existing
deployment action preserves the `CNAME` file on `gh-pages`. The GitHub Pages address
redirects to the custom domain; there is only one deployment. Canonical metadata,
Open Graph URLs, sitemap entries, and the feed all use the custom domain.

Local configuration checks do not establish that repository Pages settings,
DNS, certificates, or a remote deployment are ready.

## Site-specific presentation

`_plugins/personal_site.rb` composes this homepage on top of the pinned theme at
build time. It places the authored intro, portrait card, and download controls
in their final positions before the browser receives any HTML. It also adds
accessible Bib disclosures without changing the official citation text.
No installed gem files are edited or copied.

- Portrait order, labels, original images, and optional display derivatives live
  in `_data/portraits.yml`. Keep `image` as the original file; use `preview` for a
  lightweight display version. Only the first image loads without interaction.
- Math is opt-in with page front matter `math: true` (or `pseudocode: true`).
- Image zoom is opt-in with `images: { medium_zoom: true }`.
- Additional icon sets are opt-in with `icon_sets: [academicons, scholar-icons]`.
- Shared site-only color/disclosure styles live in `assets/personal-site.css`.

After changes, build and run `test/integration_personal_site.rb` and the local
browser regression tests:

```bash
JEKYLL_ENV=production bundle exec jekyll build
bundle exec ruby test/integration_personal_site.rb
bundle exec ruby test/integration_personal_features.rb
node test/personal-site-browser.cjs
node test/export-downloads.cjs
```

The browser tests expect a local preview at `http://127.0.0.1:4011/`; override it
with `SITE_TEST_URL` / `EXPORT_TEST_URL`. Install Playwright Chromium or set
`CHROME_PATH` to an existing Chrome executable. The export test verifies that
the existing single-page PDF links and long PNG exports still work.
For a deterministic local-asset check when third-party CDNs are unavailable,
set `SITE_TEST_OFFLINE=1`; also run with actual fonts and icons before visual approval.
