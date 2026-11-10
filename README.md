# Formally

![Formally logo](formally.svg)

Form validation leveraging the platform. Formally is a vanilla JavaScript form validation library that builds on top of the browser's native Constraint Validation API. No dependencies, no framework required—just add a class to your form and validation works.

[![Tests](https://github.com/dgrammatiko/formally/workflows/.github/workflows/basic.yml/badge.svg)](https://github.com/dgrammatiko/formally/actions)

## Features

- **Zero dependencies** — plain vanilla JavaScript (ES modules)
- **Native validation** — uses the browser's Constraint Validation API (`checkValidity`, `setCustomValidity`, `reportValidity`)
- **Auto-initialization** — forms with the `validate` class are wired up automatically
- **Custom error messages** — via `data-*` attributes (`data-value-missing`, `data-pattern-mismatch`, etc.)
- **Live checking** — optional real-time validation on input (`data-live-check="true"`)
- **Custom classes** — configurable valid/invalid CSS classes (`data-valid-class`, `data-invalid-class`)
- **Dynamic forms** — MutationObserver watches for added/removed fields
- **j-formally** — Joomla-specific extension with custom handlers (username, password, email, numeric)
- **Small** — ~3 KB minified

## Installation

### npm

```bash
npm install @dgrammatiko/formally
```

### CDN

Use the built bundles from `dist/`:

```html
<!-- ES Module -->
<script type="module">
  import { Formally } from "https://cdn.jsdelivr.net/npm/@dgrammatiko/formally@latest/dist/formally.esm.min.js";
</script>

<!-- IIFE (global `FormValidator`) -->
<script src="https://cdn.jsdelivr.net/npm/@dgrammatiko/formally@latest/dist/formally.iife.min.js"></script>
```

### Download

Grab the latest release from GitHub and include `dist/formally.iife.min.js` (IIFE) or `dist/formally.esm.min.js` (ES module).

## Quick Start

### 1. Add the `validate` class to your form

Forms with class `validate` (and without `novalidate`) are auto-initialized when you load `form-validator.js`:

```html
<script type="module" src="dist/form-validator.esm.min.js"></script>

<form class="validate" data-live-check="true">
  <label for="email">Email</label>
  <input type="email" name="email" required>

  <label for="password">Password</label>
  <input type="password" name="password" required minlength="8">

  <button type="submit">Submit</button>
</form>
```

### 2. Or initialize manually

```html
<script type="module">
  import { Formally } from "./dist/formally.esm.min.js";

  const form = document.querySelector("form");
  const validator = new Formally(form);

  // Validate on demand
  if (validator.isValid()) {
    console.log("Form is valid");
  }

  // Clean up
  validator.dispose();
</script>
```

## Form Options

Options are read from `data-*` attributes on the `<form>` element:

| Attribute | Default | Description |
|-----------|---------|-------------|
| `data-valid-class` | `is-valid` | CSS class added to valid fields |
| `data-invalid-class` | `is-invalid` | CSS class added to invalid fields |
| `data-live-check` | `false` | Set `"true"` to validate on every keystroke |
| `novalidate` | — | If present, Formally skips the form entirely |

```html
<form class="validate"
      data-valid-class="is-valid"
      data-invalid-class="is-invalid"
      data-live-check="true">
  ...
</form>
```

## Field Validation

Formally relies on standard HTML5 validation attributes (`required`, `min`, `max`, `minlength`, `maxlength`, `pattern`, `type`, `step`). Custom error messages are supplied via `data-*` attributes matching the validity state:

| Data attribute | Validity state | Triggered when |
|----------------|----------------|----------------|
| `data-value-missing` | `valueMissing` | Field is empty but `required` |
| `data-type-mismatch` | `typeMismatch` | `type="email"`/`"url"` value is malformed |
| `data-pattern-mismatch` | `patternMismatch` | Value doesn't match `pattern` |
| `data-too-long` | `tooLong` | Value exceeds `maxlength` |
| `data-too-short` | `tooShort` | Value is below `minlength` |
| `data-range-underflow` | `rangeUnderflow` | Value below `min` |
| `data-range-overflow` | `rangeOverflow` | Value above `max` |
| `data-step-mismatch` | `stepMismatch` | Value doesn't fit `step` |
| `data-bad-input` | `badInput` | Value can't be converted (e.g. non-numeric in `type="number"`) |

The browser's default validation UI (`reportValidity`) is used to display the message.

```html
<input type="email"
       name="email"
       required
       data-value-missing="Please enter your email"
       data-type-mismatch="That doesn't look like a valid email">
```

## API

### `new Formally(form)`

Creates a validator instance for the given `<form>` element. Throws if the element is not an `HTMLFormElement`. Returns early (no-op) if the form has `novalidate`.

### `formally.isValid() → boolean`

Validates all registered fields and returns `true` if the form is valid. Invalid fields are marked and focused.

### `formally.dispose()`

Removes all event listeners, disconnects the MutationObserver, and clears the tracked elements. Call this when the form is removed from the DOM to avoid memory leaks.

### `formally.elementsForValidation`

Array of form elements currently tracked for validation (useful for introspection).

## Dynamic Fields

Formally uses a `MutationObserver` to watch the form. Fields added to the form after initialization are automatically picked up; fields removed are automatically unwound (listeners removed).

## j-formally (Joomla Extension)

`src/j-formally.js` extends `Formally` for Joomla integration. It adds:

- Custom field handlers: `username`, `password`, `email`, `numeric`
- `setHandler(name, fn, enabled)` / `custom` getter/setter for custom validators
- Joomla message rendering via `Joomla.Text._()` and `Joomla.renderMessages()`
- Bootstrap-style markup classes (`form-control-success`, `form-control-danger`, `has-success`, `has-danger`)

```html
<script type="module">
  import { JFormally } from "./dist/j-formally.esm.min.js";
  window.JFormally = JFormally;
</script>

<form id="jform" class="form-validate">
  <input type="text" name="username" class="required validate-username" required>
  <input type="password" name="password" class="required validate-password" required>
  <input type="email" name="email" class="required validate-email" required>
  <button type="submit" class="validate">Submit</button>
</form>

<script>
  const form = document.getElementById("jform");
  const jf = new JFormally(form);

  // Add a custom validator
  jf.custom = {
    alwaysFail: { exec: () => false }
  };
</script>
```

## Building

```bash
npm run build   # rolldown → dist/*.esm.min.js / *.iife.min.js
```

## Browser Support

All modern browsers that support ES modules and the Constraint Validation API (Chrome, Edge, Firefox, Safari). IE11 is not supported.

## License

MIT