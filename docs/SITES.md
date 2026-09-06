# Sites deployment

Public mirror: [Yujian Li — Personal Homepage](https://yujian-li.betterest.chatgpt.site).

The Sites mirror publishes a static build of this repository. GitHub Pages keeps
using `_config.yml`; the Sites build also reads `_config.sites.yml` to label its
hosting provider correctly. Both builds retain `https://liyujian.cn` as their
canonical origin.

The Sites project ID is recorded in the repository's `.openai/hosting.json`.
Reuse that exact ID for subsequent releases, including after a URL change.

## Relationship to GitHub Pages

GitHub Actions builds with `_config.yml` and publishes `_site/` to `gh-pages`.
Sites publishes the separately saved static snapshot from `.sites-checkout/out/`.
Updating either deployment does not update the other. Sites has no custom-domain
binding for `liyujian.cn`; that domain remains assigned to GitHub Pages.

Navigation and page assets use root-relative paths, so each deployment loads its
own files. Fonts and icons retain the existing external CDN dependencies. The
canonical URL, social metadata, sitemap, and feed identify `liyujian.cn` as the
primary site; canonical metadata does not redirect browser navigation. The
explicit personal-homepage link and the fallback link on the 404 page also point
to that primary site. The 404 page's automatic redirect uses `/` on the current
origin.

## Build and validate

Run from the repository root with Ruby, Bundler, and Node.js available:

```bash
bundle check
JEKYLL_ENV=production bundle exec jekyll build --config _config.yml,_config.sites.yml
bundle exec ruby test/integration_personal_site.rb
bundle exec ruby test/integration_personal_features.rb
npm run lint:style-contract
npm run lint:prettier
```

The existing integration checks enforce the page and published-file allowlists,
local resource paths, publication citations, and canonical metadata. The PDF and
PNG controls and their vendored libraries are included in the static output.

## Publish the snapshot

Use the Sites plugin's hosting workflow to open this project in the ignored
`.sites-checkout/` directory before editing an existing release. It has its own
Sites source history, separate from this repository's GitHub history.

After a successful build, replace only `.sites-checkout/out/` with `_site/`.
The Sites checkout's `.openai/hosting.json` must contain the same project ID and:

```json
{
  "static": {
    "directory": "out",
    "not_found_handling": "404-page"
  }
}
```

The snippet shows the static configuration; retain `project_id` alongside it.
Store a short provenance note in the Sites checkout's README. The source uploaded
to Sites is the generated static snapshot; the editable Jekyll source remains
here. Keep credentials in the plugin session, never in either checkout.

Run the plugin's `site-workflow.mjs` from the Sites checkout to save its source and
package the static output. Pass the returned commit and archive to the native
Sites save/deploy tools, preserve the requested public audience, and wait for a
successful deployment status before reporting its URL.

Publishing is manual. A GitHub Pages release does not automatically refresh the
Sites mirror.
