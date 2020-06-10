# Form dictated behaviour

## Activating the validation behaviour
This is just what the platform already provides: if an attribute `novalidate` exists in the form the form **should not** be validated. The absence of that attribute enables the default HTML5 validation and since formally just extends that behavour will also enable all the extra functionality provided by Formally.

### Examples
#### Form shouldn't validate

```html
<form novalidate>...</form>
```

#### Form should validate

```html
<form>...</form>
```

## Controling the styling
The default behaviour of the browsers is to activate the `:valid` or `:invalid` in the CSS side per input. This introduces a problem when we need to server render an empty form as the empty fields that have a required attribute will be indicated as invalid, although the potential user didn't even had a chance to even interact with the page. Sad... But do not dispare, we will bend the rules a bit here to achieve what we want without any drawbacks: we'll use our own css classes. All the popular CSS Frameworks follow this path for the same exact reason. We're not inventing the wheel here.

### Example

```html
<form 
data-valid-class="is-valid"
data-invalid-class="is-invalid">
..
</form>
```

#### Explainer
`data-valid-class="is-valid"` Sets the class for the **valid** fields
`data-invalid-class="is-invalid"` Sets the class for the **invalid** fields
The classes are toggled depending on the state of the field and applied only in the input element.

## Controlling the notifications
The default behaviour of the browsers is to show a popup-tip like message depending of the error in the input element and just activate the `:valid` or `:invalid` in the CSS side. Formally allows us to interfere here and get the messages in the page's HTML, allowing to maintain a concistency in the language and also set us free to get more customised messages per error. How all these will work? But of course by setting some more attributes.

Note: because the valid attributes per HTML Element are defined Formally cannot introduce random attributes but rather needs to fall back to the allowed `data-*`

### Examples
#### Form should use custom mesagegs
This **DISABLES** the default browser popups-tips and **REQUIRES** all the decentant elements to provide thier own error messages!

```html
<form 
data-invalid-form-alert="true"
data-indicator="true"
data-indicator-position="after"
data-indicator-class="invalid-feedback">
..
</form>
```

#### Explainer
`data-invalid-form-alert="true"` Enables a custom notification if the form is invalid (throwed only through the isValid method)

`data-indicator="true"` Enables the custom error messaging per field

`data-indicator-position="after"` Provides the positon for the messages, no default value*

`data-indicator-class="invalid-feedback"` The class that will be toggled in the indicator element


<codepen-demo data-css="https://stackpath.bootstrapcdn.com/bootstrap/4.5.0/css/bootstrap.min.css" data-js="https://formally-valid.info/dist/bootstrap4/nocode-bootstrap4.iife.min.js">

```html
<form 
data-valid-class="is-valid"
data-invalid-class="is-invalid"
data-invalid-form-alert="true"
data-indicator="true"
data-indicator-position="after"
data-indicator-class="invalid-feedback">
  <div class="form-row">
    <div class="col-md-4 mb-3">
      <label for="validationServer01">First name</label>
      <input type="text" class="form-control" id="validationServer01" value="Mark" required>
    </div>
    <div class="col-md-4 mb-3">
      <label for="validationServer02">Last name</label>
      <input type="text" class="form-control" id="validationServer02" value="Otto" required>
    </div>
    <div class="col-md-4 mb-3">
      <label for="validationServerUsername">Username</label>
      <div class="input-group">
        <div class="input-group-prepend">
          <span class="input-group-text" id="inputGroupPrepend3">@</span>
        </div>
        <input type="text" class="form-control" id="validationServerUsername" aria-describedby="inputGroupPrepend3" required>
      </div>
    </div>
  </div>
  <div class="form-row">
    <div class="col-md-6 mb-3">
      <label for="validationServer03">City</label>
      <input type="text" class="form-control" id="validationServer03" required>
    </div>
    <div class="col-md-3 mb-3">
      <label for="validationServer04">State</label>
      <select class="custom-select" id="validationServer04" required>
        <option selected value="">Choose...</option>
        <option value="1">Something meaningful</option>
        <option value="2">Something else</option>
      </select>
    </div>
    <div class="col-md-3 mb-3">
      <label for="validationServer05">Zip</label>
      <input type="text" class="form-control" id="validationServer05" required>
    </div>
  </div>
  <div class="form-group">
    <div class="form-check">
      <input class="form-check-input" type="checkbox" value="" id="invalidCheck3" required>
      <label class="form-check-label" for="invalidCheck3">
        Agree to terms and conditions
      </label>
    </div>
  </div>
  <button id="button" class="btn btn-primary" type="button">Submit form</button>
</form>
```

Some JavaScript to showcase the functionality

```js
document.getElementById('button').addEventListener('click', function(e) {
  e.preventDefault();
  if(!document.forms[0].Formally.isValid()){
    alert('Form is not valid 😩')
    } else {
      alert('Form is valid 😀');
      document.forms[0].submit();
  }
});
```

</codepen-demo>
