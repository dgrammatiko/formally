/* eslint no-undef: 0 */
import { Formally } from '../formally';
import { guid } from '../utils';

/**
 * Method to switch Classes on a form element per state
 */
Object.defineProperty(Formally.prototype, 'switchClasses', {
  writable: true,
  configurable: true,
  value(formElement, isValid) {
    if (isValid) {
      formElement.classList.remove(this.options.invalidClass);
      formElement.classList.add(this.options.validClass);
    } else {
      formElement.classList.remove(this.options.validClass);
      formElement.classList.add(this.options.invalidClass);
    }
  }
});

/**
 * Method to attach element to the formally logic
 */
Object.defineProperty(Formally.prototype, 'elementInit', {
  writable: true,
  configurable: true,
  value(formElement) {
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
});

/**
 * Method to control the notification (invalid state messages)
 */
Object.defineProperty(Formally.prototype, 'notify', {
  writable: true,
  configurable: true,
  value(formElement, isValid) {
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

    if (!((this.form.dataset && Object.keys(this.form.dataset).length !== 0) && this.form.dataset.indicator === 'true')) {
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
});

/**
 * Method to handle a global notification (eg alert, toast, etc)
 */
Object.defineProperty(Formally.prototype, 'invalidFormNotification', {
  writable: true,
  configurable: true,
  value() {
    // Example of an alert
    // if (this.form.dataset.invalidFormAlert) {
    // alert('Please correct the invalid iputs');
    // }
    return;
  }
});

export { Formally };
