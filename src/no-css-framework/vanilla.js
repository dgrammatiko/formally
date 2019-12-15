/* eslint no-undef: 0 */
import { Formally } from '../formvalidatorbase';
import { guid } from '../utils';

class FormallyVanilla extends Formally {
  constructor(form) {
    super(form);

    // We could override the default options here
    // this.options = {
    //   validClass: 'is-valid',
    //   invalidClass: 'is-invalid',
    //   indicator: true,
    //   invalidForm: 'Text for invalid form',
    //   invalidFormAlert: true,
    //   indicatorElement: 'div',
    //   indicatorPosition: 'after',
    //   indicatorClass: 'invalid-feedback',
    // };
  }

  // This method switches the classes per element
  switchClasses(formElement, isValid) {
    if (isValid) {
      formElement.classList.remove(this.options.invalidClass);
      formElement.classList.add(this.options.validClass);
    } else {
      formElement.classList.remove(this.options.validClass);
      formElement.classList.add(this.options.invalidClass);
    }
  }

  // This method creates the required element for the notification
  elementInit(formElement) {
    if (formElement.hasAttribute('disabled')) {
      return;
    }

    let span = formElement.closest(`${this.options.indicatorElement}[aria-live]`);
    if (!span) {
      span = document.createElement(this.options.indicatorElement);
    }

    span.setAttribute('aria-live', 'polite');
    const id = guid();
    span.id = id;
    formElement.setAttribute('aria-controls', id);
    span.classList.add(this.options.indicatorClass);

    if (this.options.indicatorPosition === 'after') {
      formElement.insertAdjacentElement('afterend', span);
      formElement.parentNode.appendChild(span);
    } else if (this.options.indicatorPosition === 'before') {
      formElement.insertAdjacentElement('beforebegin', span);
    }
  }

  // This method updates the notification element text
  notify(formElement) {
    if (formElement.hasAttribute('disabled')) {
      return;
    }

    const isValid = formElement.validity.valid;
    const type = formElement.getAttribute('type');
    const message = isValid ? null : this.getCustomMessage(formElement, formElement.type, formElement.validity);

    this.switchClasses(formElement, isValid);

    // Radios need a bit more
    if (type && type === 'radio') {
      const name = formElement.name;

      this.elementsForValidation.forEach((el) => {
        if (el.name && el.name === name || el === formElement) {
          this.switchClasses(el, isValid);
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

  // Throws an alert if the form is invalid
  formInvalidNotification() {
    // Example of an alert
    // if (this.form.dataset.invalidFormAlert && window.Joomla && typeof window.Joomla.renderMessages === 'function') {
    //   window.Joomla.renderMessages({ 'Error': [this.form.dataset.invalidForm ? this.form.dataset.invalidForm : 'Please correct the invalid iputs'] });
    // }
    // return;
  }
}

export { FormallyVanilla };
