# UIX Playground

Standalone playground for UIX examples.

Includes:
- Monaco editor with custom attribute highlighting
- Split layout (code/result/console)
- Sandboxed runner iframe
- Built-in examples
- Local vendored UIX runtime for portability

## Run locally

```bash
npm run serve
```

Open:
- http://127.0.0.1:4173/index.html

## Monorepo compatibility

This folder is self-contained so it can be split and pushed as a separate repository.
It still works from the monorepo path:
- `/modules/core/static/components/playground/`
