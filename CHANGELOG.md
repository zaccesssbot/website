# Changelog

All notable changes to this project are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) and this project
adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [0.2.0] - 2026-11-03

### Added

- A documentation section at `/docs/`, drawn from the markdown in every product repository at the
  release it describes: install pages for the reader, the scenes, the games and the themes, a page
  for each product document, the Lua guides, the community files in full and a reference sheet for
  each tool. Every page names its release and links to its source on GitHub.
- `scripts/sync-docs.mjs` and `scripts/docs-manifest.mjs`, which pull those pages before every
  build, with the release lookup the sync scripts share moved into `scripts/lib/release.mjs`.
- Search over the documentation with Pagefind, built into the sidebar and working without a server.
- Mermaid diagrams in the documentation drawn at sync time as images in both high contrast themes,
  with the source kept on the page as text.
- The documentation drawn in the two high contrast themes from the themes release, with
  `scripts/check-contrast.mjs` holding every colour pair to the site's floors on every build.
- Docs in the main navigation and a Docs column in the footer, with a copyright line.
- A weekly link check over every outbound link in the built site.
- The four install routes of Zacess Scenes and Zacess Games on their product pages: Homebrew,
  winget, Cargo from crates.io and the release archives.

### Changed

- `npm run verify` also checks the documentation pages, the search index, the security header the
  search needs, the canonical address of every page and the contrast floors.
- Routine tidy-up.

[Unreleased]: https://github.com/zacesshq/website/compare/v0.2.0...HEAD
[0.2.0]: https://github.com/zacesshq/website/releases/tag/v0.2.0
