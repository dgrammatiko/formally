# Formally-valid

Using the Formally-valid validation library is extremely easy. The procedure involves 3 simple steps:
- Include the script in the page with a form that needs to be client-side validated
- Add the preferred attributes in the form element(s)
- Add the respected attributes in every form child element that needs to be validated

## The script

The script in the default distribution is provided in two different versions: esm and iife. The esm version needs an attribute `type="module"` and the iife an attribute `nomodule`. So in the head of your page this could be translated as:

```html
<script type="module" src="/path/to/script.esm.js"></script>
<script nomodule defer src="/path/to/script.iife.js"></script>
```

!> The `nomodule` attribute can be skipped if there is no need for support of older browsers (Eg.: IE11). The attribute `type=module` supported by all the browsers since 2017 

## The form Element

The form element needs a few attributes to control the behaviour of the Formally-valid validator. A basic example is as:

```html
<form 
  action="someAction"
  data-valid-class="is-valid"
  data-invalid-class="is-invalid"
  data-invalid-form-alert="false"
  data-indicator="true"
  data-indicator-position="after"
  data-indicator-class="invalid-feedback"
  data-indicator-element="span"
  data-invalid-form="Invalid form"
>
```

For a detailed explnation of each attribute please refer to the [Form](/documentation/form.md) documentation page.

## The form children element

```html
<div>
  <label for="text">Text input</label>
  <input
    type="text"
    class="form-control"
    id="text"
    placeholder="Required example textarea"
    minlength="5"
    maxlength="10"
    pattern="^[a-z]+$"
    required
    data-value-missing="The Text Input cannot be empty"
    data-pattern-mismatch="Only lowercase letters here"
    data-too-long="Not bigger than 10 letters"
    data-too-short="Not smaller than 5 letters"
    data-custom-Error="Ooops">
</div>
```

For a detailed explnation of each attribute please refer to the [input](/documentation/input.md) documentation page.
