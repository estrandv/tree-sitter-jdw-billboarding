# Publishing a New Version

1. Update version in: `pyproject.toml`, `setup.py`, `Cargo.toml`, `Package.swift`, `CMakeLists.txt`, `binding.gyp`, `Makefile`, `tree-sitter.json`
2. If grammar changed, update `grammar.js` and run `tree-sitter test`
3. Commit and push to `main`
4. Tag the release: `git tag -a v<version> -m "v<version>"` (e.g. `v0.2.0`)
5. Push the tag: `git push origin v<version>`
6. Create a **published** (not draft) GitHub Release from the tag
7. CI builds wheels and publishes to PyPI automatically
