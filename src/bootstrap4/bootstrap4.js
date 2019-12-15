/* eslint no-undef: 0 */
import { FormValidatorBase } from '../formvalidatorbase';
import { guid } from '../utils';

class Formally extends FormValidatorBase {
  constructor(form) {
    super(form);

    this.switchClasses = this.switchClasses.bind(this);
  }

  // This method switches the given element classes
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
  notify(formElement, isValid) {
    if (formElement.hasAttribute('disabled')) {
      return;
    }

    const type = formElement.getAttribute('type');
    const message = isValid ? null : this.getCustomMessage(formElement, formElement.type, formElement.validity);

    this.switchClasses(formElement, isValid);

    // Radios need a bit more
    if (type && type === 'radio') {
      const elms = this.elementsForValidation;
      elms
        .filter(el => el.name !== formElement.name)
        .forEach((el) => {
          this.switchClasses(el, isValid);
        });
    }

    if (!this.options.indicator) {
      if (document.activeElement === formElement) {
        formElement.reportValidity();
      }
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
  invalidFormNotification() {
    // Example of an alert
    // if (this.form.dataset.invalidFormAlert && window.Joomla && typeof window.Joomla.renderMessages === 'function') {
    //   window.Joomla.renderMessages({ 'Error': [this.form.dataset.invalidForm ? this.form.dataset.invalidForm : 'Please correct the invalid iputs'] });
    // }
    // return;
  }
}

export { Formally };
