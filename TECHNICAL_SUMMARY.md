# Technical summary

## Architecture

The Vite entry point renders one `App` component. `App` composes semantic header, main, section, navigation, list, form, and footer elements from small components in `src/components`. Copy and list data live in `src/content.json`; rendering logic does not duplicate workshop content. The form owns only in-memory React state and calls pure functions from `src/validation.js`.

## Responsive CSS

The page uses one CSS Module plus a small global reset. Desktop content is capped at 1120 px. Grid controls the hero, learning cards, agenda, and registration panel; media queries adapt the layout at 980, 820, 760, 599, and 340 px. The 820 px breakpoint stacks the registration panel before its copy becomes cramped. At widths below 600 px, secondary navigation links are hidden and all main content stacks. The supplied SVG assets retain intrinsic dimensions to limit layout shift.

## Registration behavior

Name input is trimmed, internal whitespace is collapsed, and 2–60 Unicode characters are accepted when they contain at least one Unicode letter and only letters, combining marks, spaces, hyphens, or straight/curly apostrophes. Email input is trimmed and lowercased, limited to 254 characters, and checked for one `@`, valid dot-separated domain labels, and forbidden whitespace or edge/consecutive dots.

Invalid submission exposes text errors, sets `aria-invalid`, connects errors with `aria-describedby`, preserves values, and focuses the first invalid field. After an attempted submit, edited fields revalidate. Valid submission displays normalized values and one live status message. Repeated submission updates the existing status region. No HTML injection, request, cookie, local storage, or session storage is used.

## Verification results

- `npm ci`: passed with 19 audited packages and zero reported vulnerabilities.
- `npm run test:validation`: 23/23 fixtures passed (`V01–V06`, `N01–N06`, `E01–E10`, `B01`).
- `npm run build`: passed with Vite 8.3.8. Output: HTML 0.55 kB (0.34 kB gzip), CSS 7.60 kB (2.13 kB gzip), JavaScript 229.95 kB (72.01 kB gzip).
- Chrome 157.0.8103.51 on Windows 10.0.26300: verified at 1440, 768, 375, and 320 CSS pixels. `scrollWidth` equaled `clientWidth` at every viewport, so no horizontal overflow was present. The 1440 render matched the 2077 px reference height; the 375 render flowed to 2815 px to preserve responsive content.
- Chrome interaction check: both errors appeared, the full-name field received focus first, correction cleared errors, normalized values remained visible, success was announced in one status region, and both storage counts remained zero.
- Edge 157.0.4341.60: headless tablet smoke render completed on Windows.
- Firefox and native Safari were unavailable in this environment and are not represented as tested.

Finished screenshots are `desktop-finished.png`, `mobile-finished.png`, `tablet-finished.png`, and `narrow-finished.png`.
