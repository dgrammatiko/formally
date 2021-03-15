import { Formally as Base } from '../formally';
import { guid } from '../utils';

export class Formally extends Base {
  constructor(form) {
    super(form);

    this.switchClasses = this.switchClasses.bind(this);
    this.elementInit = this.elementInit.bind(this);
    this.notify = this.notify.bind(this);
    this.invalidFormNotification = this.invalidFormNotification.bind(this);
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
   * Method to attach element to the formally logic
   */
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

  /**
   * Method to control the notification (invalid state messages)
   */
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

  /**
   * Shortcut to get the validity of the form.
   */
  isValid() {
    let firstInvalid;
    this.elementsForValidation.forEach((formElement) => {
      const valid = formElement.checkValidity();
      if (this.notify && typeof this.notify === 'function') {
        this.notify(formElement, valid);
      }
      if (!(firstInvalid instanceof HTMLElement) && !valid) {
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
   * Method to handle a global notification (eg alert, toast, etc)
   */
  invalidFormNotification() {
    // Example of an alert
    // if (this.form.dataset.invalidFormAlert) {
    // alert('Please correct the invalid iputs');
    // }
    return;
  }
}

window.Formally = new WeakMap();

const forms = [].slice.call(document.querySelectorAll('form:not([novalidate]'));
const submitters = [].slice.call(document.querySelectorAll('[type="submit"]'));

forms.forEach(form => {
  window.Formally.set(form, new Formally(form));
});

submitters.forEach(submit => {
  submit.addEventListener('click', (e) => {
    const form = window.Formally.get(e.target);
    if (form && !form.isValid()) {
      e.preventDefault();
      e.preventPropagation();
    }
  });
});
