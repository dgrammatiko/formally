/* eslint no-undef: 0 */
import { FormValidatorBase } from './base/formvalidatorbase';
import { guid } from './base/utils';

class Formally extends FormValidatorBase {
  constructor(form) {
    super(form);

    // We could override the default options here
    // this.options = {
    //   validClass: 'is-valid',
    //   invalidClass: 'is-invalid',
    //   indicator: true,
    //   indicatorElement: 'div',
    //   indicatorPosition: 'after',
    //   indicatorClass: 'invalid-feedback',
    //   attachChange: false,
    //   attachInput: false
    // };
  }

  // This method creates the required element for the notification
  elementInit(formElement) {
    let span = formElement.closest('span');
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
}

export { Formally };
