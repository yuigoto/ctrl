// Dependencies
import React from "react";
import PropTypes from "prop-types";

// Project import
import {
  Email as EmailRegex
} from "../utils/Expressions";
import Cpf from "../validators/Cpf";
import Cnpj from "../validators/Cnpj";
import Pis from "../validators/Pis";

/**
 * Ctrl\Ctrl
 * ----------------------------------------------------------------------
 * Multi-purpose control class, mostly useful for HTML inputs.
 *
 * @author    Fabio Y. Goto <lab@yuiti.com.br>
 * @since     0.0.1
 * @copyright (c) 2018 Fabio Y. Goto
 * @license   MIT
 */
class Ctrl {
  // Properties
  // --------------------------------------------------------------------

  /**
   * Control name.
   *
   * @type {String}
   */
  name;

  /**
   * Control label.
   *
   * @type {String}
   */
  label;

  /**
   * Control value.
   *
   * @type {*}
   */
  value;

  /**
   * Control options.
   *
   * @type {Array}
   */
  options;

  /**
   * Control state.
   *
   * @type {String}
   */
  state;

  /**
   * Placeholder text.
   *
   * @type {String}
   */
  placeholder;

  /**
   * Control type.
   *
   * @type {String}
   */
  type;

  /**
   * Used with the boolean type control, defines if the formatting should
   * follow a custom style (in the renderer component).
   *
   * @type {Boolean}
   */
  custom;

  /**
   * Custom CSS class to be applied to an input.
   *
   * @type {String}
   */
  custom_class;

  /**
   * `onChange` event callable.
   *
   * @type {Function}
   */
  onChange;

  /**
   * A callable or array of callables that are applied onto the control's
   * value during validation/processing.
   *
   * Callables should accept the raw input and return the processed input.
   *
   * @type {Array|Function}
   */
  interceptor;

  /**
   * A callable or array of callables that are applied onto the control's
   * value during validation/processing.
   *
   * Callables should accept the raw input and return the processed input.
   *
   * @type {Array|Function}
   */
  interceptors;

  /**
   * Control message, usually displays status messages.
   *
   * @type {String}
   */
  message;

  /**
   * E-mail validation message.
   *
   * @type {String}
   */
  emailMessage;

  /**
   * Cpf validation message.
   *
   * @type {String}
   */
  cpfMessage;

  /**
   * Cnpj validation message.
   *
   * @type {String}
   */
  cnpjMessage;

  /**
   * Pis validation message.
   *
   * @type {String}
   */
  pisMessage;

  /**
   * Control required status.
   *
   * @type {Boolean}
   */
  required;

  /**
   * Control required message.
   *
   * @type {String}
   */
  requiredMessage;

  /**
   * Control max input length.
   *
   * @type {Number}
   */
  maxLength;

  /**
   * Control max input length validation message.
   *
   * @type {String}
   */
  maxLengthMessage;

  /**
   * Control min input length.
   *
   * @type {Number}
   */
  minLength;

  /**
   * Control min input length validation message.
   *
   * @type {String}
   */
  minLengthMessage;

  /**
   * Control max answers length (select/checkboxes).
   *
   * @type {Number}
   */
  maxAnswers;

  /**
   * Control max answers length validation message.
   *
   * @type {String}
   */
  maxAnswersMessage;

  /**
   * Control min answers length (select/checkboxes).
   *
   * @type {Number}
   */
  minAnswers;

  /**
   * Control min answers length validation message.
   *
   * @type {String}
   */
  minAnswersMessage;

  /**
   * Regular expression for validation.
   *
   * @type {RegExp}
   */
  regex;

  /**
   * Regular expression validation message.
   *
   * @type {String}
   */
  regexMessage;

  /**
   * Control textarea columns (use only if `textarea`).
   *
   * @type {Number}
   */
  cols;

  /**
   * Control textarea rows (use only if `textarea`).
   *
   * @type {Number}
   */
  rows;

  // Constructor
  // --------------------------------------------------------------------

  /**
   * @param {*} props
   */
  constructor(props) {
    // Merges props
    props = this._defaultProps(props);

    // Checks
    if (props.type === "checkbox_group" || props.type === "multiple_option") {
      props.value = [];
    }

    // Maps all prop key values to this object
    Object.keys(props).map((key) => {
      this[key] = props[key];
    });
  }

  // Private Methods
  // --------------------------------------------------------------------

  /**
   * Merges the user defined props with default values.
   *
   * @param props
   * @returns {*}
   * @private
   */
  _defaultProps(props) {
    let default_props =  {
      name: null,
      label: null,
      value: null,
      options: [],
      state: "normal",
      placeholder: "",
      type: "default",
      custom: false,
      custom_class: null,
      onChange: null,
      interceptor: null,
      interceptors: null,
      message: "",
      emailMessage: "Invalid e-mail address provided.",
      cpfMessage: "Invalid CPF number provided.",
      cnpjMessage: "Invalid CNPJ number provided.",
      pisMessage: "Invalid PIS number provided",
      required: false,
      requiredMessage: "This field is required",
      maxLength: null,
      minLength: null,
      maxAnswers: null,
      minAnswers: null,
      regex: null,
      cols: null,
      rows: null
    };

    // Set messages that rely on values
    default_props.maxLengthMessage = `Max length accepted is "${default_props.maxLength}" characters.`;
    default_props.minLengthMessage = `Min length accepted is "${default_props.minLength}" characters.`;
    default_props.maxAnswersMessage = `You can't choose more than "${default_props.maxAnswers}" options.`;
    default_props.minAnswersMessage = `Please choose at least "${default_props.minAnswers}" options.`;
    default_props.regexMessage = `The current value doesn't match the Regexp.`;

    return Object.assign(
      default_props,
      props
    );
  }

  // Utilities
  // --------------------------------------------------------------------

  /**
   * Removes non-digit characters from a string.
   *
   * Not used for now.
   *
   * @param {*} value
   */
  sanitizeNumbers(value) {
    value = (typeof value  !== "number")
      ? value.trim().replace(/\D/g, "")
      : value.toString();
    return value;
  }

  // Validation
  // --------------------------------------------------------------------

  /**
   * Used when this control is marked as required.
   *
   * @returns {boolean}
   */
  validateRequired() {
    const { value } = this;

    if (
      this.required
      && (
        !value
        || value === null
        || value === undefined
        || value === ""
        || value && value instanceof Array && !value.length
      )
    ) {
      this.message = this.requiredMessage;
      this.state = "error";

      return false;
    }
    return true;
  }

  /**
   * Validates input value max length.
   *
   * @returns {boolean}
   */
  validateMaxLength() {
    if (
      this.maxLength
      && this.maxLength > 1
      && this.value
      && this.value.length > this.maxLength
    ) {
      this.message = this.maxLengthMessage;
      this.state = "error";
      return false;
    }
    return true;
  }

  /**
   * Validates input value min length.
   *
   * @returns {boolean}
   */
  validateMinLength() {
    if (
      this.minLength
      && this.minLength > 1
      && this.value
      && this.value.length < this.minLength
    ) {
      this.message = this.minLengthMessage;
      this.state = "error";
      return false;
    }
    return true;
  }

  /**
   * Validates the max answers required for this control.
   *
   * Only apply this if the value is an array of answers.
   *
   * @returns {boolean}
   */
  validateMaxAnswers() {
    if (
      this.maxAnswers
      && this.maxAnswers > 1
      && this.value
      && this.value.length > this.maxAnswers
    ) {
      this.message = this.maxAnswersMessage;
      this.state = "error";
      return false;
    }
    return true;
  }

  /**
   * Validates the min answers required for this control.
   *
   * Only apply this if the value is an array of answers.
   *
   * @returns {boolean}
   */
  validateMinAnswers() {
    if (
      this.minAnswers
      && this.minAnswers > 1
      && this.value
      && this.value.length < this.minAnswers
    ) {
      this.message = this.minAnswersMessage;
      this.state = "error";
      return false;
    }
    return true;
  }

  /**
   * If the input is of type "email", validate the address.
   *
   * @returns {boolean}
   */
  validateEmail() {
    if (
      this.type === "email"
      && this.value
      && this.value !== null
      && !EmailRegex.test(this.value)
    ) {
      this.message = this.emailMessage;
      this.state = "error";
      return false;
    }
    return true;
  }

  validateRegex() {
    if (
      this.regex
      && this.regex !== null
      && this.value
      && this.value !== null
      && !this.regex.test(this.value)
    ) {
      this.message = this.regexMessage;
      this.state = "error";
      return false;
    }
    return true;
  }

  /**
   * Validates the control if it's declared as a CPF number.
   *
   * @returns {boolean}
   */
  validateCpf() {
    if (this.type === "cpf") {
      // Instance Cpf
      let cpf = new Cpf(this.value.trim());

      if (
        this.value
        && this.value !== null
        && !cpf.validate()
      ) {
        this.message = this.cpfMessage;
        this.state = "error";
        return false;
      }
    }

    return true;
  }

  /**
   * Validates the control if it's declared as a CNPJ number.
   *
   * @returns {boolean}
   */
  validateCnpj() {
    if (this.type === "cnpj") {
      // Instance Cnpj
      let cnpj = new Cnpj(this.value.trim());

      if (
        this.value
        && this.value !== null
        && !cnpj.validate()
      ) {
        this.message = this.cnpjMessage;
        this.state = "error";
        return false;
      }
    }
    return true;
  }

  /**
   * Validates the control if it's declared as a PIS/PASEP number.
   *
   * @returns {boolean}
   */
  validatePis() {
    if (this.type === "pis") {
      // Instance Pis
      let pis = new Pis(this.value.trim());

      if (
        this.value
        && this.value !== null
        && !pis.validate()
      ) {
        this.message = this.pisMessage;
        this.state = "error";
        return false;
      }
    }
    return true;
  }

  /**
   * Validates this control.
   */
  validate() {
    // Set default state and message
    this.state = "normal";
    this.message = null;

    // Validate
    return (
      this.validateRequired()
      && this.validateMaxLength()
      && this.validateMinLength()
      && this.validateMaxAnswers()
      && this.validateMinAnswers()
      && this.validateEmail()
      && this.validateRegex()
      && this.validateCpf()
      && this.validateCnpj()
      && this.validatePis()
    );
  }

  /**
   * Invalidates this control with an error message.
   *
   * @param {String} message
   * @returns {Ctrl}
   */
  invalidate(message) {
    this.state = "error";
    this.message = message || "Invalid input value provided.";
    return this;
  }

  // Interceptors
  // --------------------------------------------------------------------

  /**
   * Applies any interceptor that was declared/passed on to this control.
   *
   * @param {*} value
   */
  applyInterceptors(value) {
    // Checks interceptor delaration
    let intercept = this.interceptor || this.interceptors;

    if (intercept && intercept !== null && intercept !== undefined) {
      try {
        if (intercept instanceof Array) {
          for (let func of intercept) {
            value = func(value);
          }
        } else {
          value = intercept(value);
        }
      } catch(err) {
        console.exception(err, intercept);
      }
    }
    return value;
  }

  // Control Lifecycle
  // --------------------------------------------------------------------

  /**
   * Fires when the value is modified.
   *
   * @param {*} value
   */
  onValueChange(value) {
    this.value = this.applyInterceptors(value);
    this.message = null;
    this.state = "normal";
    if (this.onChange) this.onChange(value);
  }

  /**
   * Fires when a boolean suffers a change.
   *
   * @param {Boolean} value
   */
  onBooleanChange(value) {
    this.value = !value;
    this.message = null;
    this.state = "normal";
    if (this.onChange) this.onChange(value);
  }

  /**
   * Fires whenever an option is selected on a multi-option control.
   *
   * @param {*} value
   */
  onValueToggle(value) {
    // Apply interceptors first
    value = this.applyInterceptors(value);

    // Execute check
    let valueArray = this.value;
    if (!valueArray || !(valueArray instanceof Array)) {
      valueArray = [];
      valueArray.push(value);
    } else {
      let _idx = valueArray.indexOf(value);

      // Select/deselect
      if (_idx >= 0) {
        // Deselect
        valueArray.splice(_idx, 1);
      } else {
        // Select
        valueArray.push(value);
      }
    }

    // Set value and reset state
    this.value = valueArray;
    this.message = null;
    this.state = "normal";
    if (this.onChange) this.onChange(value);
  }

  /**
   * Checks if the desired option is present/selected on the current value.
   *
   * @param {*} option
   * @returns {boolean}
   */
  isValueSelected(option) {
    let list = this.value();
    return (
      list
      && list instanceof Array
      && list.indexOf(option) >= 0
    );
  }
}

// PropTypes
// ----------------------------------------------------------------------

Ctrl.defaultProps = {
  name: null,
  value: null,
  options: [],
  message: null,
  state: "normal"
};

Ctrl.propTypes = {
  name: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  value: PropTypes.any,
  options: PropTypes.array,
  state: PropTypes.string,
  placeholder: PropTypes.string,
  type: PropTypes.string,
  custom: PropTypes.bool,
  custom_class: PropTypes.string,
  onChange: PropTypes.func,

  interceptor: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.arrayOf(PropTypes.func)
  ]),
  interceptors: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.arrayOf(PropTypes.func)
  ]),

  message: PropTypes.string,
  emailMessage: PropTypes.string,
  cpfMessage: PropTypes.string,
  cnpjMessage: PropTypes.string,
  pisMessage: PropTypes.string,

  required: PropTypes.bool,
  requiredMessage: PropTypes.string,

  maxLength: PropTypes.number,
  maxLengthMessage: PropTypes.string,

  minLength: PropTypes.number,
  minLengthMessage: PropTypes.string,

  maxAnswers: PropTypes.number,
  maxAnswersMessage: PropTypes.string,

  minAnswers: PropTypes.number,
  minAnswersMessage: PropTypes.string,

  regex: PropTypes.instanceOf(RegExp),
  regexMessage: PropTypes.string,

  cols: PropTypes.number,
  rows: PropTypes.number
};

export default Ctrl;
