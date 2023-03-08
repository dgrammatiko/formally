import { debounce } from './utils.js';
import { defaultSettings, defaultStates } from './defaults.js'
/**
 * The Class defaults, can be overriden through data-*
 *
 * @example
 * <form
 *  data-valid-class="is-valid"      Any string that qualifies for a class (no spaces)
 *  data-invalid-class="is-invalid"  Any string that qualifies for a class (no spaces)
 *  data-live-check="false"          Any string that qualifies for a class (no spaces)
 *
 */
class Formally {
  /**
  * Constructor
  *
  * @param {HTMLFormElement} form
  */
  constructor(form) {
    if (!form || form.constructor.name !== 'HTMLFormElement') throw new Error('Validator needs a form element');
    if (form.hasAttribute('novalidate')) return;

    this.form = form;
    this.elementsForValidation = [];
    this.validateFormElement = this.validateFormElement.bind(this);
    this.modifyElement = this.modifyElement.bind(this);
    this.debounced = debounce(300, this.validateFormElement);
    this.switchClasses = this.switchClasses.bind(this);
    this.notify = this.notify.bind(this);

    const dataSet = this.form.dataset;

    // Use any of the options provided through data-*
    this.options = {
      validClass: dataSet.validClass ? dataSet.validClass : defaultSettings.validClass,
      invalidClass: dataSet.invalidClass ? dataSet.invalidClass : defaultSettings.invalidClass,
      liveCheck: dataSet.liveCheck && dataSet.liveCheck === 'true' ? true : defaultSettings.liveCheck,
    };

    // Valid elements: form.elements (+ Web Components implementing elementInternals)
    Array.from(this.form.elements).forEach((formElement) => this.modifyElement(formElement, 'add'));

    // Callback function to execute when mutations are observed
    const mutationCallback = (mutations, observer) => {
      mutations.forEach((mutation) => {
        if (mutation.addedNodes.length > 0) {
          Array.from(this.form.elements).filter((element) => !this.elementsForValidation.includes(element)).forEach((element) => this.modifyElement(element, 'add'));
        }
        if (mutation.removedNodes.length > 0) {
          this.elementsForValidation.filter((element) => !Array.from(this.form.elements).includes(element)).forEach((element) => this.modifyElement(element, 'remove'));
        }
      });
    };

    // Create an observer instance linked to the callback function
    this.observer = new MutationObserver(mutationCallback);

    // Start observing the target node for configured mutations
    this.observer.observe(this.form, {attributes: false, childList: true, subtree: true});
  }

  /**
   * This method will check the validity of the element
   * Expects the element to be at event.target
   *
   * @param {{} || HTMLElement} event
   */
  validateFormElement(event) {
    if (!event || !event.target || event.target.form !== this.form) {
      throw new Error('The element needs to be a children of a form element');
    }

    event.target.setCustomValidity('');
    event.target.checkValidity();
    this.notify(event.target, event.target.validity.valid);
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
   *        data-type-mismatch="The input type is number but the user inserted text"
   *        data-pattern-mismatch="The input value doesnt satisfy the pattern provided"
   *        data-too-long="The input value is bigger than maxlength"
   *        data-too-short="The input value is smaller than minlength"
   *        data-bad-input="The input value wasn't an actual date/time/etc"
   *        data-range-underflow="The input value is smaller than min"
   *        data-range-overflow="The input value is biggger than max"
   *        data-step-mismatch="The input step wasn't valid"
   *
   * Setting a data-custom-error will render the field ALWAYS invalid!!!!
   */
  getCustomMessage(input, type) {
    let customMessage = '';
    if (!input || !type) return customMessage;
    const data = input.dataset;
    if (!data) return customMessage;
    defaultStates.forEach((state) => {
      if (input.validity[state] === true && data[state]) {
        customMessage = data[state]
      }
    });

    return customMessage;
  }

  /**
   * Method that will reset the functionality of the passed element
   *
   * @param {nodeElement} formElement the element
   * Valid elements: form.elements (+ Web Components implementing elementInternals)
   */
  modifyElement(formElement, action = 'add') {
    if (formElement.hasAttribute('disabled') || !formElement.willValidate || formElement.tagName === 'FIELDSET' || formElement.tagName === 'OUTPUT') return;

    this.elementsForValidation.push(formElement);
    formElement[`${action}EventListener`]('blur', this.validateFormElement, { passive: true });
    formElement[`${action}EventListener`]('change', this.validateFormElement, { passive: true });
    if (this.options.liveCheck) {
      formElement[`${action}EventListener`]('input', this.debounced, { passive: true });
    }
  }

  /**
   * Method that will dispose the validator
   */
  dispose() {
    Array.from(this.form.elements).forEach((formElement) => this.modifyElement(formElement, 'remove'));

    this.observer.disconnect();
    this.observer = null;
  }

  /**
   * Method to switch Classes on a form element per state
   */
  switchClasses(formElement, isValid) {
    if (isValid) {
      formElement.classList.remove(this.options.invalidClass);
      formElement.classList.add(this.options.validClass);
    } else {
      formElement.classList.remove(this.options.validClass);
      formElement.classList.add(this.options.invalidClass);
    }
  }

  /**
   * Method to control the notification (invalid state messages)
   */
  notify(formElement, isValid) {
    if (formElement.hasAttribute('disabled')) return;

    const type = formElement.getAttribute('type');
    // Replace the UA default message
    formElement.setCustomValidity(this.getCustomMessage(formElement, formElement.type));
    this.switchClasses(formElement, isValid);

    // Radios need a bit more
    if (type && type === 'radio') {
      this.elementsForValidation.filter(el => el.name !== formElement.name).forEach((el) => this.switchClasses(el, isValid));
    }

    formElement.reportValidity();
  }

  /**
   * Shortcut to get the validity of the form.
   */
  isValid() {
    let firstInvalid;
    this.elementsForValidation.forEach((formElement) => {
      formElement.setCustomValidity('');
      const valid = formElement.checkValidity();
      this.notify(formElement, valid);
      if (!firstInvalid && !valid) {
        firstInvalid = formElement;
      }
    });

    if (this.form.checkValidity()) {
      return true;
    }

    if (firstInvalid) firstInvalid.focus();
    return false;
  }
}

export { Formally };
