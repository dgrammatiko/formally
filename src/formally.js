import { debounce, uaSupportsPassive } from './utils';
import { defaultSettings } from './defaults';

class Formally {
  /**
  * Constructor
  *
  * @param {HTMLFormElement} form Expects a form element to act upon
  */
  constructor(form) {
    if (!form || form.constructor.name !== 'HTMLFormElement') {
      throw new Error('Validator needs a form element');
    }
    this.form = form;
    if (this.form.hasAttribute('novalidate')) {
      return;
    }

    // Options through data-*
    // Eg: for validClass the attribute will be data-valid-class
    this.options = defaultSettings;

    // The class instance is accesible at: form.Formally
    this.form.Formally = this;

    this.passiveSupported = uaSupportsPassive();
    this.elementsForValidation = [];
    this.validateFormElement = this.validateFormElement.bind(this);
    this.attachElement = this.attachElement.bind(this);
    this.elementInit = this.elementInit.bind(this);
    this.notify = this.notify.bind(this);
    this.invalidFormNotification = this.invalidFormNotification.bind(this);
    this.debounced = debounce(99, this.validateFormElement);

    this.init();
  }

  /**
   * These methods were intentionally not implemented here so the class could be customized
   * to match the developer's particular needs
   */
  invalidFormNotification() { /** Throws an alert if the form is invalid */ }
  notify() { /** This method updates the notification element text */ }
  elementInit() { /** This method creates the required element for the notification */ }

  /**
   * This method will check the validity of the element
   * Expects the element to be at event.target
   *
   * @param {{} || HTMLElement} event The event that initiated this action
   *                                   or the element to be validated
   */
  validateFormElement(event) {
    let formElement = null;
    if (event && event.target) {
      formElement = event.target;
    } else {
      formElement = event;
    }

    if (!formElement) {
      throw new Error('Method formElementValidate needs a valid event.target or a form element');
    }

    // Custom validators are set through formElement.FormallyCustomValidator
    if (Object.prototype.hasOwnProperty.call(formElement, 'FormallyCustomValidator')
      && typeof formElement.FormallyCustomValidator === 'function') {
      formElement.FormallyCustomValidator();
      if (this.notify && typeof this.notify === 'function') {
        this.notify(formElement, formElement.validity.valid);
      }
    } else {
      formElement.checkValidity();
      if (this.notify && typeof this.notify === 'function') {
        this.notify(formElement, formElement.validity.valid);
      }
    }
  }

  /**
   * Method to get the elements custom error messages
   *   Requires this.indicator to be true
   * @param {formElement} input the element
   * @param {string} type the element type
   * @param {{}} validity the validity object
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
   * Shortcut to get the validity of the form.
   */
  isValid() {
    let firstInvalid = 'i';
    this.elementsForValidation.forEach((formElement) => {
      const valid = formElement.checkValidity();
      if (this.notify && typeof this.notify === 'function') {
        this.notify(formElement, valid);
      }
      if (typeof firstInvalid === 'string' && !valid) {
        firstInvalid = formElement;
      }
    });

    if (this.form.checkValidity()) {
      return true;
    } else {
      if (this.invalidFormNotification && typeof this.invalidFormNotification === 'function') {
        this.invalidFormNotification();
      }

      if (typeof firstInvalid !== 'string') {
        firstInvalid.focus();
      }
      return false;
    }
  }

  /**
   * Method that initiates the behaviours
   */
  init() {
    /**
     * Use any of the options provided through data-*
     */
    if (this.form.dataset) {
      for (const data in this.form.dataset) {
        if (Object.prototype.hasOwnProperty.call(this.form.Formally.options, data)) {
          if (data === 'indicator' || data === 'invalidFormAlert') {
            this.form.Formally.options[data] = this.form.dataset[data] === 'true' ? true : false;
          } else {
            this.form.Formally.options[data] = this.form.dataset[data];
          }
        }
      }
    }

    [].slice.call(this.form.elements).forEach((formElement) => {
      // Valid elements: INPUT, SELECT, TEXTAREA, BUTTON, OUTPUT, FIELDSET
      if (
        formElement.hasAttribute('disabled')
        || (
          typeof formElement.dataset.allowValidation !== 'undefined'
          && formElement.dataset.allowValidation === 'true'
        )
        || formElement.tagName === 'FIELDSET'
      ) {
        return;
      }

      this.elementsForValidation.push(formElement);
      formElement.addEventListener('blur', this.debounced, this.passiveSupported ? { passive: true } : true);
      formElement.addEventListener('change', this.debounced, this.passiveSupported ? { passive: true } : true);
      formElement.addEventListener('input', this.debounced, this.passiveSupported ? { passive: true } : true);

      if (this.options.indicator && this.elementInit && typeof this.elementInit === 'function') {
        this.elementInit(formElement);
      }
    });
  }

  /**
   * Method that will reset the functionality of the passed element
   * Use this to set a custom validator
   *
   * @param {nodeElement} formElement the element
   */
  attachElement(formElement) {
    // Early ruturn for not qualifying elements
    if (formElement.hasAttribute('disabled') ||
      (
        typeof formElement.dataset.allowValidation !== 'undefined'
        && formElement.dataset.allowValidation === 'true'
      )
      || !formElement.willValidate
    ) {
      return;
    }

    // Remove any existing listeners
    formElement.removeEventListener('blur', this.debounced, this.passiveSupported ? { passive: true } : true);
    formElement.removeEventListener('change', this.debounced, this.passiveSupported ? { passive: true } : true);
    formElement.removeEventListener('input', this.debounced, this.passiveSupported ? { passive: true } : true);

    // Add the needed listeners
    formElement.addEventListener('blur', this.debounced, this.passiveSupported ? { passive: true } : true);
    formElement.addEventListener('change', this.debounced, this.passiveSupported ? { passive: true } : true);
    formElement.addEventListener('input', this.debounced, this.passiveSupported ? { passive: true } : true);

    if (this.options.indicator && this.elementInit && typeof this.elementInit === 'function') {
      this.elementInit(formElement);
    }
  }
}

export { Formally };
