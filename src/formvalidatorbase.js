import { debounce, uaSupportsPassive } from './utils';
import { defaults } from './defaults';

// Micro optimizations
const hA = 'hasAttribute';
const hOP = 'hasOwnProperty';
const aEL = 'addEventListener';
const rEL = 'removeEventListener';

class FormValidatorBase {
  constructor(form) {
    this.form = form;
    if (!form || form.constructor.name !== 'HTMLFormElement') {
      throw new Error('Validator needs a form element');
    }

    if (this.form[hA]('novalidate')) {
      return;
    }

    // Options through data-*
    // Eg: for validClass the attribute will be data-valid-class
    this.options = defaults;

    if (this.form.dataset) {
      for (const data in this.form.dataset) {
        if (Object.prototype[hOP].call(this.options, data)) {
          if (data === 'indicator' || data === 'invalidFormAlert') {
            this.options[data] = (this.form.dataset[data] === 'true');
          } else {
            this.options[data] = this.form.dataset[data];
          }
        }
      }
    }

    this.passiveSupported = uaSupportsPassive();
    this.elementsForValidation = [];
    this.formElementValidate = this.formElementValidate.bind(this);
    this.reAttachElement = this.reAttachElement.bind(this);
    this.debounced = debounce(99, this.formElementValidate);

    this.init();

    // The class instance is accesible at: form.Formally
    this.form.Formally = this;
  }

  /**
   * These methods was intentionally left empty here so the class could be extended
   * to match the developer's particular needs
   */
  formInvalidNotification() { /** Throws an alert if the form is invalid */ }
  notify() { /** This method updates the notification element text */ }
  switchClasses() { /** This method switches the classes per element */ }
  elementInit() { /** This method creates the required element for the notification */ }

  /**
   * This method will check the validity of the element
   * Expects the element to be at event.target
   * 
   * @param {{}} event The event that initiated this action
   */
  formElementValidate(event) {
    const formElement = event.target;
    // Custom validators are set through formElement.FormallyCustomValidator
    if (formElement.FormallyCustomValidator && typeof formElement.FormallyCustomValidator === 'function') {
      formElement.customValidator();
    } else {
      formElement.checkValidity();
    }
    this.notify(formElement);
  }

  /**
   * 
   * @param {formElement} input the element
   * @param {string} type the element type
   * @param {{}} validity the validity object
   */
  getCustomMessage(input, type, validity) {
    const data = input.dataset;
    if (typeof data === 'object') {
      if (validity.typeMismatch && data[`${type}Mismatch`]) {
        return data[`${type}Mismatch`];
      } else {
        for (const invalidKey in data) {
          if (Object.prototype[hOP].call(data, invalidKey) && validity[invalidKey]) {
            return data[invalidKey];
          }
        }
      }
    }
    return '';
  }

  /**
   * Shortcut to get the validity of the form.
   */
  isValid() {
    this.elementsForValidation.forEach((formElement) => {
      this.switchClasses(formElement, formElement.validity.valid);
      this.notify(formElement);
    });

    if (this.form.checkValidity()) {
      return true;
    } else {
      this.formInvalidNotification();
      return false;
    }
  }

  /**
   * Method that initiates the behaviours
   */
  init() {
    [].slice.call(this.form.elements).forEach((formElement) => {
      const type = formElement.tagName;
      if (type && (type === 'INPUT' || type === 'SELECT' || type === 'TEXTAREA')) {
        if (formElement[hA]('disabled') || (typeof formElement.dataset.allowValidation !== 'undefined' && formElement.dataset.allowValidation === 'true')) {
          return;
        }
        this.elementsForValidation.push(formElement);
        formElement[aEL]('blur', this.debounced), this.passiveSupported ? { passive: true } : false;
        formElement[aEL]('change', this.debounced, this.passiveSupported ? { passive: true } : false);

        if (type !== 'SELECT') {

          formElement[aEL]('input', this.debounced, this.passiveSupported ? { passive: true } : false);
        }

        if (this.options.indicator && (this.form.dataset && Object.keys(this.form.dataset).length !== 0)) {
          this.elementInit(formElement);
        }
      }
    });
  }

  /**
   * Method that will reset the functionality of the passed element
   * Use this to set a custom validator
   *  
   * @param {nodeElement} formElement the element
   */
  reAttachElement(formElement) {
    const type = formElement.tagName;
    formElement[rEL]('blur', this.debounced, this.passiveSupported ? { passive: true } : false);
    formElement[rEL]('change', this.debounced, this.passiveSupported ? { passive: true } : false);
    formElement[rEL]('input', this.debounced, this.passiveSupported ? { passive: true } : false);

    if (type && (type === 'INPUT' || type === 'SELECT' || type === 'TEXTAREA')) {
      formElement[aEL]('blur', this.debounced, this.passiveSupported ? { passive: true } : false);

      if (type === 'SELECT') {
        formElement[aEL]('change', this.debounced, this.passiveSupported ? { passive: true } : false);
      } else {
        formElement[aEL]('input', this.debounced, this.passiveSupported ? { passive: true } : false);
      }

      if (this.options.indicator && (this.form.dataset && Object.keys(this.form.dataset).length !== 0)) {
        this.elementInit(formElement);
      }
    }
  }
}

export { FormValidatorBase };
