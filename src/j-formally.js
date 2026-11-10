import { Formally } from "./formally.js";
import punycode from "punycode";

export class JFormally extends Formally {
  constructor(form) {
    super(form);
    this.customValidators = {};
    this.handlers = {};
    this.removeMarking = this.removeMarking.bind(this);
    this.handleBlur = this.handleBlur.bind(this);
    this.handleFocus = this.handleFocus.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.inputEmail = () => {
      const input = document.createElement("input");
      input.setAttribute("type", "email");
      return input.type !== "text";
    };
    this.setHandler("username", (value) => {
      const regex = /[<|>|"|'|%|;|(|)|&]/i;
      return !regex.test(value);
    });
    this.setHandler("password", (value) => {
      const regex = /^\S[\S ]{2,98}\S$/;
      return regex.test(value);
    });
    this.setHandler("numeric", (value) => {
      const regex = /^(\d|-)?(\d|,)*\.?\d*$/;
      return regex.test(value);
    });
    this.setHandler("email", (value) => {
      const newValue = punycode.toASCII(value);
      const regex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
      return regex.test(newValue);
    });
    this.attachToForm(form);
  }

  handleBlur({ target }) {
    this.validate(target);
  }

  handleFocus({ target }) {
    this.removeMarking(target);
  }

  handleClick() {
    this.isValid(this.form);
  }

  get custom() {
    return this.customValidators;
  }

  set custom(value) {
    this.customValidators = value;
  }

  setHandler(name, func, en) {
    const isEnabled = en === undefined ? true : en === "" ? true : en;
    this.handlers[name] = { enabled: isEnabled, exec: func };
  }

  markValid(element) {
    const label =
      element.form.querySelector(`label[for="${element.id}"]`) ||
      document.getElementById(`${element.id}-lbl`);
    let message;
    if (element.classList.contains("required") || element.getAttribute("required")) {
      if (label) {
        message = label.querySelector("span.form-control-feedback");
      }
    }
    element.classList.remove("form-control-danger", "invalid");
    element.classList.add("form-control-success");
    element.parentNode.classList.remove("has-danger");
    element.parentNode.classList.add("has-success");
    element.setAttribute("aria-invalid", "false");
    if (message) {
      message.parentNode.removeChild(message);
    }
    if (label) {
      label.classList.remove("invalid");
    }
  }

  markInvalid(element, empty) {
    const label =
      element.form.querySelector(`label[for="${element.id}"]`) ||
      document.getElementById(`${element.id}-lbl`);
    element.classList.remove("form-control-success", "valid");
    element.classList.add("form-control-danger", "invalid");
    element.parentNode.classList.remove("has-success");
    element.parentNode.classList.add("has-danger");
    element.setAttribute("aria-invalid", "true");
    let mesgCont;
    const message = element.getAttribute("data-validation-text");
    if (label) {
      mesgCont = label.querySelector("span.form-control-feedback");
    }
    if (!mesgCont) {
      const elMsg = document.createElement("span");
      elMsg.classList.add("form-control-feedback");
      if (empty && empty === "checkbox") {
        elMsg.innerHTML =
          message !== null
            ? Joomla.sanitizeHtml(message)
            : Joomla.sanitizeHtml(Joomla.Text._("JLIB_FORM_FIELD_REQUIRED_CHECK"));
      } else if (empty && empty === "value") {
        elMsg.innerHTML =
          message !== null
            ? Joomla.sanitizeHtml(message)
            : Joomla.sanitizeHtml(Joomla.Text._("JLIB_FORM_FIELD_REQUIRED_VALUE"));
      } else {
        elMsg.innerHTML =
          message !== null
            ? Joomla.sanitizeHtml(message)
            : Joomla.sanitizeHtml(Joomla.Text._("JLIB_FORM_FIELD_INVALID_VALUE"));
      }
      if (label) {
        label.appendChild(elMsg);
      }
    }
    if (label) {
      label.classList.add("invalid");
    }
  }

  removeMarking(element) {
    let message;
    const label =
      element.form.querySelector(`label[for="${element.id}"]`) ||
      document.getElementById(`${element.id}-lbl`);
    if (label) {
      message = label.querySelector("span.form-control-feedback");
    }
    element.classList.remove("form-control-danger", "form-control-success", "remove");
    element.classList.add("valid");
    element.parentNode.classList.remove("has-danger", "has-success");
    if (message && label) {
      label.removeChild(message);
    }
    if (label) {
      label.classList.remove("invalid");
    }
  }

  handleResponse(state, element, empty) {
    const tagName = element.tagName.toLowerCase();
    if ((tagName !== "button" && element.value !== undefined) || tagName === "fieldset") {
      if (state === false) {
        this.markInvalid(element, empty);
      } else {
        this.markValid(element);
      }
    }
  }

  validate(element) {
    let tagName;
    if (element.disabled || element.getAttribute("display") === "none") {
      this.handleResponse(true, element);
      return true;
    }
    if (element.getAttribute("required") || element.classList.contains("required")) {
      tagName = element.tagName.toLowerCase();
      if (
        tagName === "fieldset" &&
        (element.classList.contains("radio") || element.classList.contains("checkboxes"))
      ) {
        if (element.querySelector("input:checked") === null) {
          this.handleResponse(false, element, "checkbox");
          return false;
        }
      } else if (
        (element.getAttribute("type") === "checkbox" && element.checked !== true) ||
        (tagName === "select" && !element.value.length)
      ) {
        this.handleResponse(false, element, "checkbox");
        return false;
      } else if (!element.value || element.classList.contains("placeholder")) {
        this.handleResponse(false, element, "value");
        return false;
      }
    }
    const handler =
      element.getAttribute("class") &&
      element.getAttribute("class").match(/validate-([a-zA-Z0-9_-]+)/)
        ? element.getAttribute("class").match(/validate-([a-zA-Z0-9_-]+)/)[1]
        : "";
    if (element.getAttribute("pattern") && element.getAttribute("pattern") !== "") {
      if (element.value.length) {
        const isValid = new RegExp(`^${element.getAttribute("pattern")}$`).test(element.value);
        this.handleResponse(isValid, element, "empty");
        return isValid;
      }
      if (element.hasAttribute("required") || element.classList.contains("required")) {
        this.handleResponse(false, element, "empty");
        return false;
      }
      this.handleResponse(true, element);
      return true;
    }
    if (handler === "") {
      this.handleResponse(true, element);
      return true;
    }
    if (handler && handler !== "none" && this.handlers[handler] && element.value) {
      if (this.handlers[handler].exec(element.value, element) !== true) {
        this.handleResponse(false, element, "invalid_value");
        return false;
      }
    }
    this.handleResponse(true, element);
    return true;
  }

  isValid(form) {
    let valid = true;
    let message;
    let error;
    let fields;
    const invalid = [];
    if (form.nodeName === "FORM") {
      fields = [].slice.call(form.elements);
    } else {
      fields = form.querySelectorAll("input, textarea, select, button, fieldset");
    }
    fields.forEach((field) => {
      if (this.validate(field) === false) {
        valid = false;
        invalid.push(field);
      }
    });
    if (Object.keys(this.customValidators).length) {
      Object.keys(this.customValidators).forEach((key) => {
        if (this.customValidators[key].exec() !== true) {
          valid = false;
        }
      });
    }
    if (!valid && invalid.length > 0) {
      if (form.getAttribute("data-validation-text")) {
        message = form.getAttribute("data-validation-text");
      } else {
        message = Joomla.Text._("JLIB_FORM_CONTAINS_INVALID_FIELDS");
      }
      error = { error: [message] };
      Joomla.renderMessages(error);
    }
    return valid;
  }

  attachToForm(form) {
    const inputFields = [];
    let elements;
    if (form.nodeName === "FORM") {
      elements = [].slice.call(form.elements);
    } else {
      elements = form.querySelectorAll("input, textarea, select, button, fieldset");
    }
    elements.forEach((element) => {
      const tagName = element.tagName.toLowerCase();
      if (
        ["input", "textarea", "select", "fieldset"].indexOf(tagName) > -1 &&
        element.classList.contains("required")
      ) {
        element.setAttribute("required", "");
      }
      if (
        (tagName === "input" || tagName === "button") &&
        (element.getAttribute("type") === "submit" || element.getAttribute("type") === "image")
      ) {
        if (element.classList.contains("validate")) {
          element.addEventListener("click", this.handleClick);
        }
      } else if (
        tagName !== "button" &&
        !(tagName === "input" && element.getAttribute("type") === "button")
      ) {
        if (tagName !== "fieldset") {
          element.addEventListener("blur", this.handleBlur);
          element.addEventListener("focus", this.handleFocus);
          if (element.classList.contains("validate-email") && this.inputEmail) {
            element.setAttribute("type", "email");
          }
        }
        inputFields.push(element);
      }
    });
  }

  dispose() {
    const form = this.form;
    const elements = [].slice.call(form.elements);
    elements.forEach((element) => {
      const tagName = element.tagName.toLowerCase();
      if (
        (tagName === "input" || tagName === "button") &&
        (element.getAttribute("type") === "submit" || element.getAttribute("type") === "image")
      ) {
        if (element.classList.contains("validate")) {
          element.removeEventListener("click", this.handleClick);
        }
      } else if (
        tagName !== "button" &&
        !(tagName === "input" && element.getAttribute("type") === "button")
      ) {
        if (tagName !== "fieldset") {
          element.removeEventListener("blur", this.handleBlur);
          element.removeEventListener("focus", this.handleFocus);
        }
      }
    });
    super.dispose();
  }

  notify(formElement, isValid) {
    if (formElement.hasAttribute("disabled")) return;
    this.handleResponse(isValid, formElement);
    formElement.reportValidity();
  }

  switchClasses(formElement, isValid) {
    if (isValid) {
      this.markValid(formElement);
    } else {
      this.markInvalid(formElement);
    }
  }
}
