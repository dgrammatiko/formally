import { debounce, uaSupportsPassive } from './utils';
import { defaultSettings } from './defaults';

class Formally {
  /**
  * Constructor
  *
  * @param {HTMLFormElement} form
  */
  constructor(form) {
    if (!form || form.constructor.name !== 'HTMLFormElement') {
      throw new Error('Validator needs a form element');
    }
    this.form = form;
    if (this.form.hasAttribute('novalidate')) {
      return;
    }

    this.passiveSupported = uaSupportsPassive();
    this.elementsForValidation = [];
    this.validateFormElement = this.validateFormElement.bind(this);
    this.attachElement = this.attachElement.bind(this);
    this.debounced = debounce(2000, this.validateFormElement);

    // Load the default options
    this.options = defaultSettings;
    // Use any of the options provided through data-*
    if (this.form.dataset) {
      for (const data in this.form.dataset) {
        if (Object.prototype.hasOwnProperty.call(this.options, data)) {
          if (data === 'indicator' || data === 'invalidFormAlert') {
            this.options[data] = this.form.dataset[data] === 'true' ? true : false;
          } else {
            this.options[data] = this.form.dataset[data];
          }
        }
      }
    }

    [].slice.call(this.form.elements).forEach((formElement) => {
      // Valid elements: INPUT, SELECT, TEXTAREA, BUTTON, OUTPUT, FIELDSET
      // & Web Components implementing formInternals
      if (formElement.hasAttribute('disabled') || formElement.tagName === 'FIELDSET') {
        return;
      }

      this.elementsForValidation.push(formElement);
      formElement.addEventListener('blur', this.validateFormElement, this.passiveSupported ? { passive: true } : true);
      formElement.addEventListener('change', this.validateFormElement, this.passiveSupported ? { passive: true } : true);
      // Do not interrupt users as they type!!!
      formElement.addEventListener('input', this.debounced, this.passiveSupported ? { passive: true } : true);

      if (this.options.indicator && this.elementInit && typeof this.elementInit === 'function') {
        this.elementInit(formElement);
      }
    });
  }

  /**
   * This method will check the validity of the element
   * Expects the element to be at event.target
   *
   * @param {{} || HTMLElement} event
   */
  validateFormElement(event) {
    let formElement = null;
    if (event && event.target && event.target.form === this.form) {
      formElement = event.target;
    } else {
      throw new Error('The element needs to be a children of a form element');
    }

    formElement.checkValidity();
    if (this.notify && typeof this.notify === 'function') {
      this.notify(formElement, formElement.validity.valid);
    }
  }

  /**
   * Method to get the elements custom error messages
   *   Requires this.indicator to be true
   * @param {formElement} input
   * @param {string} type
   * @param {{}} validity
   *
   * @returns {string || null}
   *
   * @example
   * <input
   *        data-value-missing="Text for error triggered when the input cannot be empty"
   *        data-type-mismatch="The input was number but the user inserted text"
   *        data-pattern-mismatch="The input value doesnt satisfy the pattern provided"
   *        data-too-long="The input value is bigger than maxlength"
   *        data-too-short="The input value is samller than minlength"
   *        data-bad-input="The input value wasn't an actual date/time/etc"
   *        data-range-underflow="The input value is samller than min"
   *        data-range-overflow="The input value is biggger than max"
   *        data-step-mismatch="The input step wasn't valid"
   *
   * Setting a data-custom-error will render the field ALWAYS invalid!!!!
   */
  getCustomMessage(input, type, validity) {
    if (!input || !type || !validity) {
      return null;
    }

    const data = input.dataset;
    if (typeof data === 'object') {
      if (validity.typeMismatch && data[`${type}Mismatch`]) {
        return data[`${type}Mismatch`];
      } else {
        for (const invalidKey in data) {
          if (Object.prototype.hasOwnProperty.call(data, invalidKey) && validity[invalidKey] === true) {
            return data[invalidKey];
          }
        }
      }
    }
    return null;
  }

  /**
   * Method that will reset the functionality of the passed element
   * Use this to set a custom validator
   *
   * @param {nodeElement} formElement the element
   */
  attachElement(formElement) {
    // Early ruturn for not qualifying elements
    if (formElement.hasAttribute('disabled') || !formElement.willValidate) {
      return;
    }

    // Remove any existing listeners
    formElement.removeEventListener('blur', this.validateFormElement, this.passiveSupported ? { passive: true } : true);
    formElement.removeEventListener('change', this.validateFormElement, this.passiveSupported ? { passive: true } : true);
    // Do not interrupt users as they type!!!
    formElement.removeEventListener('input', this.debounced, this.passiveSupported ? { passive: true } : true);

    // Add the needed listeners
    formElement.addEventListener('blur', this.validateFormElement, this.passiveSupported ? { passive: true } : true);
    formElement.addEventListener('change', this.validateFormElement, this.passiveSupported ? { passive: true } : true);
    // Do not interrupt users as they type!!!
    formElement.addEventListener('input', this.debounced, this.passiveSupported ? { passive: true } : true);

    if (this.options.indicator && this.elementInit && typeof this.elementInit === 'function') {
      this.elementInit(formElement);
    }
  }
}

export { Formally };
