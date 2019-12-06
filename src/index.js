import { defaults } from './defaults.js';

const guid = () => {
  let s4 = () => {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }
  return s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4();
};

class FormValidator {
  constructor(form) {
    this.form = form;
    if (!form || form.constructor.name !== 'HTMLFormElement') {
      throw new Error('Validator needs a form element');
    }

    if (this.form.hasAttribute('novalidate')) {
      return;
    }

    // Options through data-*
    // Eg: for validClass the attribute will be data-valid-class
    this.options = defaults;

    if (this.form.dataset) {
      for (const data in this.form.dataset) {
        if (this.options.hasOwnProperty(data)) {
          if (data === 'indicator' || data === 'attachChange' || data === 'attachInput') {
            this.options[data] = (this.form.dataset[data] === 'true');
          } else {
            this.options[data] = this.form.dataset[data];
          }
        }
      }
    }

    this.passiveSupported = false;
    this.elementsForValidation = [];
    this.formElementValidate = this.formElementValidate.bind(this);
    this.reAttachElement = this.reAttachElement.bind(this);

    this.uaSupportsPassive();
    this.init();

    // The class instance is accesible at: form.Testa
    this.form[this.options.instanceName] = this;
  }


  uaSupportsPassive() {
    try {
      const options = {
        get passive() {
          this.passiveSupported = true;
          return false;
        }
      };

      window.addEventListener("test", null, options);
      window.removeEventListener("test", null, options);
    } catch (err) {
      this.passiveSupported = false;
    }
  }

  formElementValidate(event) {
    const formElement = event.target;
    if (typeof formElement[this.options.customValidatorName] === 'function') {
      formElement.customValidator()
    } else {
      formElement.checkValidity();
      this.changeHtmlMarkup(formElement);
    }
  }

  getCustomMessage(input, type, validity) {
    var data = input.dataset;
    if (typeof data === 'object') {
      if (validity.typeMismatch && data[type + 'Mismatch']) {
        return data[type + 'Mismatch'];
      } else {
        for (var invalidKey in data) {
          if (data.hasOwnProperty(invalidKey) && validity[invalidKey]) {
            return data[invalidKey];
          }
        }
      }
    }
    return undefined;
  }

  switchClasses(formElement, isValid) {
    if (isValid) {
      formElement.classList.remove(this.options.invalidClass);
      formElement.classList.add(this.options.validClass);
    } else {
      formElement.classList.remove(this.options.validClass);
      formElement.classList.add(this.options.invalidClass);
    }
  }

  changeHtmlMarkup(formElement) {
    const isValid = formElement.validity.valid;
    const type = formElement.getAttribute('type');
    const message = isValid ? null : this.getCustomMessage(formElement, formElement.type, formElement.validity);

    this.switchClasses(formElement, isValid)

    // Radios need a bit more
    if (type && type === 'radio') {
      const name = formElement.name;

      this.elementsForValidation.forEach((el) => {
        if (el.name && el.name === name || el === formElement) {
          this.switchClasses(el, isValid)
        }
      });
    }

    if (!this.options.indicator) {
      if (message) {
        formElement.setCustomValidity(message);
      }

      formElement.reportValidity();
    } else {
      if (message) {
        formElement.setCustomValidity('');
        const ariaMessage = formElement.parentNode.querySelector('[aria-live="polite"]');
        if (ariaMessage) {
          ariaMessage.innerText = message;
        }
      }
    }
  }

  isValid() {
    this.elementsForValidation.forEach((formElement) => {
      if (!formElement.validity.valid) {
        formElement.classList.add(this.options.validClass);
        formElement.classList.remove(this.options.validClass);
      } else {
        formElement.classList.remove(this.options.validClass);
        formElement.classList.add(this.options.validClass);
      }
      this.changeHtmlMarkup(formElement)
    });

    if (this.form.checkValidity()) {
      return true;
    } else {
      return false;
    }
  }

  init() {
    [].slice.call(this.form.elements).forEach((formElement) => {
      const type = formElement.tagName.toLowerCase();
      if (type && (type === 'input' || type === 'select' || type === 'textarea')) {
        this.elementsForValidation.push(formElement)
        formElement.addEventListener('blur', this.formElementValidate), this.passiveSupported ? { passive: true } : false;

        if (this.options.attachChange || this.form.dataset.attachChange) {
          formElement.addEventListener('change', this.formElementValidate, this.passiveSupported ? { passive: true } : false);
        }

        if (this.options.attachInput || this.form.dataset.attachInput) {
          formElement.addEventListener('change', this.formElementValidate, this.passiveSupported ? { passive: true } : false);
        }

        if (this.options.indicator && (this.form.dataset && Object.keys(this.form.dataset).length !== 0)) {
          const span = document.createElement(this.options.indicatorElement);
          if (span) {
            span.setAttribute('aria-live', 'polite');
            const id = guid();
            span.id = id;
            formElement.setAttribute('aria-controls', id);
            span.classList.add(this.options.indicatorClass);

            if (this.options.indicatorPosition === 'after') {
              formElement.insertAdjacentElement('afterend', span)
              formElement.parentNode.appendChild(span)
            } else if (this.options.indicatorPosition === 'before') {
              formElement.insertAdjacentElement('beforebegin', span)
            }
          }
        }
      }
    })
  }

  reAttachElement(formElement) {
    formElement.removeEventListener('blur', this.formElementValidate, this.passiveSupported ? { passive: true } : false);
    formElement.removeEventListener('change', this.formElementValidate, this.passiveSupported ? { passive: true } : false);
    formElement.removeEventListener('input', this.formElementValidate, this.passiveSupported ? { passive: true } : false);

    if (formElement.hasAttribute('required')) {
      formElement.addEventListener('blur', this.formElementValidate, this.passiveSupported ? { passive: true } : false);

      if (this.options.attachChange || this.form.dataset.attachChange) {
        formElement.addEventListener('change', this.formElementValidate, this.passiveSupported ? { passive: true } : false);
      }

      if (this.options.attachInput || this.form.dataset.attachInput) {
        formElement.addEventListener('input', this.formElementValidate, this.passiveSupported ? { passive: true } : false);
      }
    }
  }
}

export default FormValidator;
