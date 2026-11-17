# Meera Verma workshop landing page

A responsive, single-page React implementation of the supplied desktop and mobile workshop designs. The page uses semantic HTML, CSS Modules, the supplied SVG assets, and accessible client-side registration validation. Registration data stays in browser memory and is never sent or stored.

## Run locally

Node 22.12 or newer is required.

```bash
npm ci
npm run dev
```

Open the local URL printed by Vite.

## Verify and build

```bash
npm run test:validation
npm run build
npm run preview
```

`npm run test:validation` checks all 23 supplied name and email fixtures. The production build is emitted to `dist/`.

## Structure

- `src/components/` contains the header, hero, learning, agenda, registration, form, and footer components.
- `src/content.json` keeps authoritative page copy separate from presentation.
- `src/validation.js` contains pure normalization and validation functions.
- `src/App.module.css` implements the responsive visual system and breakpoints.
- `public/assets/` contains the supplied logo and planning illustration.
- `scripts/browser-check.mjs` performs local Chrome viewport, overflow, and form-state checks.
- `tests/form-test-cases.json` contains the validation fixtures.

There is no backend, authentication, analytics, network submission, or browser storage.
