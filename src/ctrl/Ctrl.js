import { Cpf, Cnpj, Pis, Email, CreditCard } from "@yuigoto/validators";

import { CtrlType } from "./CtrlType";
import { CtrlStates } from "./CtrlStates";

/**
 * Ctrl/Ctrl
 * ----------------------------------------------------------------------
 * Multi-purpose control class, mostly useful for HTML inputs.
 * 
 * @since 0.0.1
 */
export class Ctrl {
  // Properties
  // --------------------------------------------------------------------

  /**
   * Control name.
   * 
   * @type {String}
   */
  name;

  /**
   * Control label, must be a human-readable string.
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
   * If the current control is disabled or not.
   *
   * @type {Boolean}
   */
  disabled;

  /**
   * Control options, when using these types:
   * - `CtrlType.SINGLE_OPTION`
   * - `CtrlType.MULTIPLE_OPTION`
   * - `CtrlType.DROPDOWN`
   * 
   * @type {Array}
   */
  options;

  /**
   * Control state, based on `CtrlStates`.
   * 
   * @type {Number}
   */
  state;

  /**
   * Human-readable placeholder text for fields.
   * 
   * @type {String}
   */
  placeholder;

  /**
   * Control type, determines how the control behaves and works.
   * 
   * Based on `CtrlType`.
   * 
   * @type {Number}
   */
  type;

  /**
   * Custom flag, to add compatibility with the `CtrlBS4Renderer` custom 
   * radio and checkbox inputs.
   * 
   * @type {Boolean}
   */
  custom;

  /**
   * Custom CSS class to be applied on the input (or anything the renderer uses).
   * 
   * @type {String}
   */
  customClass;

  /**
   * `onChange` callable function, must accept the control value as input.
   * 
   * @type {Function}
   */
  onChange;

  /**
   * Callable function or array of callable functions that are applied to the 
   * control's value during validation/processing.
   * 
   * Callables should accept the control value and return the modified input.
   * 
   * @type {Array|Function} 
   */
  _interceptor;

  /**
   * Control message, usually display the status messages.
   * 
   * @type {String}
   */
  message;

  /**
   * Control required status.
   * 
   * @type {Boolean}
   */
  required;

  /**
   * Control required status message.
   * 
   * @type {String}
   */
  requiredMessage;

  /**
   * Max input length.
   * 
   * @type {Number}
   */
  maxLength;

  /**
   * Max input length validation message.
   * 
   * @type {String}
   */
  maxLengthMessage;
  
  /**
   * Min input length.
   * 
   * @type {Number}
   */
  minLength;
  
  /**
   * Min input length validation message.
   * 
   * @type {String}
   */
  minLengthMessage;

  /**
   * Max answers accepted, when using the `CtrlType.MULTIPLE_OPTION` input.
   * 
   * @type {Number}
   */
  maxAnswers;

  /**
   * Max answers validation message.
   * 
   * @type {String}
   */
  maxAnswersMessage;

  /**
   * Min answers accepted, when using the `CtrlType.MULTIPLE_OPTION` input.
   * 
   * @type {Number}
   */
  minAnswers;

  /**
   * Min answers validation message.
   * 
   * @type {String}
   */
  minAnswersMessage;

  /**
   * RegExp object used to validate the input.
   * 
   * @type {RegExp}
   */
  regex;

  /**
   * RegExp validation message.
   * 
   * @type {String}
   */
  regexMessage;

  /**
   * Brazilian Legal Entity Document (CNPJ) number validation message.
   * 
   * Exclusive for the `CtrlTypes.CNPJ` input type.
   * 
   * @type {String}
   */
  cnpjMessage;

  /**
   * Brazilian Natural Person Registry (CPF) number validation message.
   * 
   * Exclusive for the `CtrlTypes.CPF` input type.
   * 
   * @type {String}
   */
  cpfMessage;

  /**
   * Brazilian Social Integration Program (PIS) number validation message.
   * 
   * Exclusive for the `CtrlTypes.PIS` input type.
   * 
   * @type {String}
   */
  pisMessage;

  /**
   * Credit card number validation message.
   * 
   * Exclusive for the `CtrlTypes.CREDIT_CARD` input type.
   */
  creditCardMessage;

  /**
   * E-mail address validation message.
   * 
   * Exclusive for the `CtrlTypes.EMAIL` input type.
   */
  emailMessage;

  /**
   * URL type validation message.
   *
   * Exclusive for the `CtrlTypes.URL` input type.
   */
  urlMessage;

  /**
   * `CtrlType.TEXTAREA` type input column limit.
   * 
   * @type {Number}
   */
  cols;

  /**
   * `CtrlType.TEXTAREA` type input row limit.
   * 
   * @type {Number}
   */
  rows;

  // Lifecycle
  // --------------------------------------------------------------------

  /**
   * Constructor.
   * 
   * @param {Object} props 
   *     Object containing key/value pairs mirroring the control properties
   */
  constructor (props) {
    props = this._defaultProps(props);

    if (
      props.type === CtrlType.MULTIPLE_OPTION
    ) {
      // Checkbox/multiple options must have an array-based value
      props.value = [];
    }
    
    // Map props to properties
    Object.keys(props).map((key) => {
      this[key] = props[key];
    });
  }

  /**
   * Returns the controller type (for input tags).
   *
   * @returns {String}
   */
  getType () {
    switch (this.type) {
      case CtrlType.SINGLE_OPTION:
      case CtrlType.RADIO_GROUP:
        return "radio";
      case CtrlType.MULTIPLE_OPTION:
      case CtrlType.CHECKBOX_GROUP:
      case CtrlType.BOOLEAN:
        return "checkbox";
      case CtrlType.DROPDOWN:
        return "select";
      case CtrlType.TEXTAREA:
        return "textarea";
      case CtrlType.CNPJ:
      case CtrlType.CPF:
      case CtrlType.PIS:
      case CtrlType.CREDIT_CARD:
      case CtrlType.PHONE:
        return "tel";
      case CtrlType.PASSWORD:
        return "password";
      case CtrlType.EMAIL:
        return "email";
      default:
        return "text";
    }
  }

  /**
   * Checks if the desired option is currently selected/present on the 
   * value array.
   * 
   * Works only for multi-option type inputs.
   * 
   * Must be fired on the renderer.
   * 
   * @param {*} option 
  *      Single option to test for 
  * @returns {Boolean}
   */
  isValueSelected (option) {
    const { value } = this;

    return (
      value 
      && value instanceof Array 
      && value.indexOf(option) >= 0
    );
  }

  /**
   * Fires when a boolean type input suffers change/toggle.
   * 
   * Must be fired on the renderer.
   * 
   * @param {Boolean} value 
   *      Value to toggle 
   */
  onBooleanChange (value) {
    this.value = !value;
    this.resetState();
    if (this.onChange) this.onChange(value);
  }

  /**
   * Fires when the value is modified.
   * 
   * Must be fired on the renderer.
   * 
   * @param {*} value 
   *     Value to update
   */
  onValueChange (value) {
    this.value = this.applyInterceptors(value);
    this.resetState();
    if (this.onChange) this.onChange(value);
  }

  /**
   * Fires when a single option is checked/unchecked on a multi-option
   * input type.
   * 
   * Must be executed individually on each check.
   * 
   * Must be fired on the renderer.
   * 
   * @param {*} value 
   *     Value to toggle 
   */
  onValueToggle (value) {
    value = this.applyInterceptors(value);

    let valuesArray = this.value;
    if (!valuesArray || !(valuesArray instanceof Array)) {
      valuesArray = [];
      valuesArray.push(value);
    } else {
      let _idx = valuesArray.indexOf(value);

      if (_idx >= 0) {
        valuesArray.splice(_idx, 1);
      } else {
        valuesArray.push(value);
      }
    }

    this.value = valuesArray;
    this.resetState();
    if (this.onChange) this.onChange(value);
  }

  /**
   * Resets control state to default.
   */
  resetState () {
    this.message = "";
    this.state = CtrlStates.NORMAL;
  }

  // Getters + Setters
  // --------------------------------------------------------------------

  /**
   * Callable function or array of callable functions that are applied to the 
   * control's value during validation/processing.
   * 
   * Callables should accept the control value and return the modified input.
   * 
   * @type {Array|Function}
   */
  get interceptor () {
    return this._interceptor;
  }

  set interceptor (value) {
    this._interceptor = value;
  }

  /**
   * Alias for `interceptor`.
   * 
   * @type {Array|Function}
   */
  get interceptors () {
    return this._interceptor;
  }

  set interceptors (value) {
    this._interceptor = value;
  }

  // Public Methods
  // --------------------------------------------------------------------

  /**
   * Applies any interceptor declared for the current control on its value.
   * 
   * @param {*} value 
   *     Value to be intercepted
   * @returns {*}
   */
  applyInterceptors (value) {
    const { interceptor } = this;

    if (interceptor && interceptor !== null && interceptor !== undefined) {
      try {
        if (interceptor instanceof Array) {
          for (let func of interceptor) {
            value = func(value);
          }
        } else {
          value = interceptor(value);
        }
      } catch (err) {
        console.exception(err, interceptor);
      }
    }

    return value;
  }

  /**
   * Invalidates this control with an error message, may be used to override 
   * the current message set.
   * 
   * @param {String} message 
   *     Message to set for invalidation 
   * @returns {Ctrl} 
   */
  invalidate (message) {
    this.state = CtrlStates.ERROR;
    this.message = message || "Invalid input value provided.";
    return this;
  }

  /**
   * Removes non-digit characters from a string.
   * 
   * IMPORTANT:
   * Might break float values!
   * 
   * @param {String|Number} value 
   *     Value to be sanitized 
   * @returns {String} 
   */
  sanitizeToNumbersOnly (value) {
    if (typeof value !== "number" || typeof value !== "string") return "";
    value = (typeof value !== "number") 
      ? value.trim().replace(/\D/g, "")
      : value.toString();

    return value;
  }

  /**
   * Validates the control using all validatio methods.
   */
  validate () {
    this.resetState();

    return (
      this._validateRequired() 
      && this._validateMaxLength() 
      && this._validateMinLength() 
      && this._validateMaxAnswers() 
      && this._validateMinAnswers() 
      && this._validateEmail() 
      && this._validateRegex() 
      && this._validateCpf() 
      && this._validateCnpj() 
      && this._validatePis()
      && this._validateUrl()
      && this._validateCreditCard()
    );
  }

  /**
   * Overrides the default `toString()` method.
   * 
   * @returns {String}
   */
  toString () {
    return "[object Ctrl]";
  }

  /**
   * Overrides the default `toJSON()` method, returns a single object with 
   * key/value pairs of the control's names and values.
   * 
   * Not all values are returned, only the presentation-related ones.
   * 
   * @returns {Object}
   */
  toJSON () {
    return {
      name: this.name, 
      label: this.label, 
      value: this.value, 
      options: this.options, 
      state: this.state, 
      placeholder: this.placeholder, 
      type: this.type, 
      custom: this.custom, 
      customClass: this.customClass, 
      required: this.required, 
      regex: this.regex.toString(), 
      cols: this.cols, 
      rows: this.rows, 
    };
  }

  // Private Methods
  // --------------------------------------------------------------------

  /**
   * Sets and/or merges default props with the provided ones for the control.
   * 
   * @param {Object} props 
   *     Props to merge or override with default values
   * @returns {Object}
   * @private
   */
  _defaultProps (props) {
    let defaultProps = {
      name: null,
      label: null,
      value: null,
      disabled: null,
      options: [],
      state: CtrlStates.NORMAL,
      placeholder: "",
      type: CtrlType.DEFAULT,
      custom: false,
      customClass: null,
      onChange: null,
      interceptor: null,
      interceptors: null,
      message: "",
      required: false,
      requiredMessage: "This field is required",
      maxLength: null,
      maxLengthMessage: "", 
      minLength: null,
      minLengthMessage: "", 
      maxAnswers: null,
      maxAnswersMessage: "", 
      minAnswers: null,
      minAnswersMessage: "", 
      regex: null,
      regexMessage: "", 
      cnpjMessage: "",
      cpfMessage: "",
      pisMessage: "",
      creditCardMessage: "", 
      emailMessage: "",
      urlMessage: "",
      cols: null, 
      rows: null
    };

    let returnable = Object.assign(
      {},
      defaultProps, 
      props
    );

    if (returnable.maxLength && returnable.maxLengthMessage === "") {
      returnable.maxLengthMessage = `Max length accepted is "${returnable.maxLength}" characters.`;
    }

    if (returnable.minLength && returnable.minLengthMessage === "") {
      returnable.minLengthMessage = `Min length accepted is "${returnable.minLength}" characters.`;
    }

    if (returnable.maxAnswers && returnable.maxAnswersMessage === "") {
      returnable.maxAnswersMessage = `You can't choose more than "${returnable.maxAnswers}" options.`;
    }

    if (returnable.minAnswers && returnable.minAnswersMessage === "") {
      returnable.minAnswersMessage = `Please choose at least "${returnable.minAnswers}" options.`;
    }

    if (returnable.regex && returnable.regexMessage === "") {
      returnable.regexMessage = `The current value doesn't match the Regexp.`;
    }

    if (returnable.cnpjMessage === "") {
      returnable.cnpjMessage = "Invalid CNPJ number.";
    }

    if (returnable.cpfMessage === "") {
      returnable.cpfMessage = "Invalid CPF number.";
    }

    if (returnable.pisMessage === "") {
      returnable.pisMessage = "Invalid PIS number.";
    }

    if (returnable.creditCardMessage === "") {
      returnable.creditCardMessage = "Invalid credit card number.";
    }

    if (returnable.emailMessage === "") {
      returnable.emailMessage = "Invalid email address provided.";
    }

    if (returnable.urlMessage === "") {
      returnable.urlMessage = "Invalid URL provided.";
    }

    return returnable;
  };

  /**
   * Used only if the control is marked as `required`.
   * 
   * @returns {Boolean}
   * @private 
   */
  _validateRequired () {
    const { value, required, requiredMessage } = this;

    if (
      required 
      && (
        !value
        || value === ""
        || value && value instanceof Array && !value.length
      )
    ) {
      this.message = requiredMessage;
      this.state = CtrlStates.ERROR;
      return false;
    }
    return true;
  }

  /**
   * Validates the max length of the input value.
   * 
   * @returns {Boolean}
   * @private 
   */
  _validateMaxLength () {
    const { value, maxLength, maxLengthMessage } = this;
    if (
      maxLength 
      && maxLength > 1 
      && value 
      && value.length > maxLength
    ) {
      this.message = maxLengthMessage;
      this.state = CtrlStates.ERROR;
      return false;
    }
    return true;
  }

  /**
   * Validates the min length of the input value.
   * 
   * @returns {Boolean}
   * @private 
   */
  _validateMinLength () {
    const { value, minLength, minLengthMessage } = this;
    if (
      minLength 
      && minLength > 1 
      && value 
      && value.length < minLength
    ) {
      this.message = minLengthMessage;
      this.state = CtrlStates.ERROR;
      return false;
    }
    return true;
  }

  /**
   * Validates the max answers allowed for this control.
   * 
   * Only apply this if the value is an array of answers.
   * 
   * @returns {Boolean}
   * @private 
   */
  _validateMaxAnswers () {
    const { value, maxAnswers, maxAnswersMessage } = this;

    if (!Array.isArray(value)) return false;

    if (
      maxAnswers 
      && maxAnswers > 1 
      && Array.isArray(value)
      && value.length > maxAnswers
    ) {
      this.message = maxAnswersMessage;
      this.state = CtrlStates.ERROR;
      return false;
    }
    return true;
  }

  /**
   * Validates the min answers allowed for this control.
   * 
   * Only apply this if the value is an array of answers.
   * 
   * @returns {Boolean}
   * @private 
   */
  _validateMinAnswers () {
    const { value, minAnswers, minAnswersMessage } = this;

    if (!Array.isArray(value)) return false;

    if (
      minAnswers 
      && minAnswers > 1 
      && Array.isArray(value)
      && value.length < minAnswers
    ) {
      this.message = minAnswersMessage;
      this.state = CtrlStates.ERROR;
      return false;
    }
    return true;
  }

  /**
   * Validates an e-mail input type using `@yuigoto/validators`.
   * 
   * @returns {Boolean}
   * @private 
   */
  _validateEmail () {
    const { type, value, emailMessage } = this;

    if (
      type === CtrlType.EMAIL
      && value
      && !Email.validateAddress(value)
    ) {
      this.message = emailMessage;
      this.state = CtrlStates.ERROR;
      return false;
    }
    return true;
  }

  /**
   * Validates the input value against the RegExp object, if declared.
   * 
   * @returns {Boolean}
   * @private 
   */
  _validateRegex () {
    const { value, regex, regexMessage } = this;

    if (
      regex
      && value
      && !regex.test(value)
    ) {
      this.message = regexMessage;
      this.state = CtrlStates.ERROR;
      return false;
    }
    return true;
  }

  /**
   * Validates a CPF input type using `@yuigoto/validators`.
   * 
   * @returns {Boolean}
   * @private 
   */
  _validateCpf () {
    const { type, value, cpfMessage } = this;

    if (
      type === CtrlType.CPF
      && value !== null
      && !Cpf.validate(value)
    ) {
      this.message = cpfMessage;
      this.state = CtrlStates.ERROR;
      return false;
    }
    return true;
  }

  /**
   * Validates a CNPJ input type using `@yuigoto/validators`.
   * 
   * @returns {Boolean}
   * @private 
   */
  _validateCnpj () {
    const { type, value, cnpjMessage } = this;

    if (
      type === CtrlType.CNPJ
      && value !== null 
      && !Cnpj.validate(value)
    ) {
      this.message = cnpjMessage;
      this.state = CtrlStates.ERROR;
      return false;
    }
    return true;
  }

  /**
   * Validates a PIS input type using `@yuigoto/validators`.
   * 
   * @returns {Boolean}
   * @private 
   */
  _validatePis () {
    const { type, value, pisMessage } = this;

    if (
      type === CtrlType.PIS
      && value !== null
      && !Pis.validate(value)
    ) {
      this.message = pisMessage;
      this.state = CtrlStates.ERROR;
      return false;
    }
    return true;
  }

  /**
   * Validates a URL type string using `@yuigoto/validators`.
   *
   * @returns {Boolean}
   * @private
   */
  _validateUrl () {
    const { type, value, urlMessage } = this;

    if (
      type === CtrlType.EMAIL
      && value !== null
      && !Email.validate(value)
    ) {
      this.message = urlMessage;
      this.state = CtrlStates.ERROR;
      return false;
    }
    return true;
  }

  /**
   * Validates a credit card input type using `@yuigoto/validators`.
   * 
   * @returns {Boolean}
   * @private 
   */
  _validateCreditCard () {
    const { type, value, creditCardMessage } = this;

    if (
      type === CtrlType.CREDIT_CARD
      && value !== null 
      && (
        !CreditCard.validateDigit(value)
        || !CreditCard.validateModulo(value)
      )
    ) {
      this.message = creditCardMessage;
      this.state = CtrlStates.ERROR;
      return false;
    }
    return true;
  }
}
