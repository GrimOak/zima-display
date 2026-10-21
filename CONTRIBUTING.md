# Contributing

Contributions are welcome. Before opening a pull request, please search existing issues and keep changes focused on one problem.

## Development checks

```bash
gofmt -w ./cmd ./internal
go test ./...
node --check web/app.js
node scripts/check-i18n.mjs
node scripts/test-web-language.mjs
node scripts/test-home-ui.mjs
node scripts/test-settings-ui.mjs
sh -n scripts/*.sh packaging/raw/usr/libexec/zima-display/start-renderer
./scripts/test-renderer-fallback.sh
```

Build the native package when changing packaging, renderer or frontend files:

```bash
./scripts/build.sh amd64
./scripts/test-package.sh
```

Renderer and packaging changes also require the ZimaOS HDMI acceptance test described in [docs/testing.md](docs/testing.md).

## Pull requests

- Explain the user-visible behavior and the ZimaOS environment used for testing.
- Add or update tests for configuration, API and renderer logic.
- Update both README files when changing installation or usage.
- Update both locale dictionaries when adding visible web text.
- Never commit server passwords, private IP details, CasaOS tokens, logs or uploaded media.

Use conventional, concise commit subjects such as `feat: add dashboard language setting` or `fix: reconnect stale mpv socket`.
