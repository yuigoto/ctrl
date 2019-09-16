import { 
  Cpf, 
  Cnpj, 
  Pis, 
  Email, 
  CreditCard, 
  Url,
  Phone,
  Cep
} from "@yuigoto/validators";

import { CtrlPropsObject, CtrlCallback, CtrlOptionItem, CtrlChangeCallback } from "./CtrlDataType";
import { CtrlStates } from "./CtrlStates";
import { CtrlType } from "./CtrlType";

/**
 * Ctrl/Ctrl
 * ----------------------------------------------------------------------
 * Multi-purpose control class, mostly useful for HTML inputs.
 *
 * @since 0.5.0
 */
export class Ctrl {
  /**
   * Control name.
   */
  name: String;

  /**
   * Control alternate name, used in some renderers.
   */
  altName: String;

  /**
   * Additional information for the control, either for the label or description.
   */
  info: String;

  /**
   * Control description, used for special information.
   */
  description: String;

  /**
   * Control label, must be a human-readable string.
   */
  label: String;

  /**
   * Autocomplete attribute name.
   */
  autocomplete: String;

  /**
   * Control value.
   */
  _value: any;

  /**
   * If the current control is disabled or not.
   */
  disabled: Boolean;

  /**
   * Control options, when using these types:
   * - `CtrlType.SINGLE_OPTION`
   * - `CtrlType.MULTIPLE_OPTION`
   * - `CtrlType.DROPDOWN`
   */
  options: CtrlOptionItem[];

  /**
   * Control state, based on `CtrlStates`.
   */
  state: Number;

  /**
   * If the control was, somehow, modified by the user.
   */
  dirty: Boolean;

  /**
   * Human-readable placeholder text for fields.
   */
  placeholder: String;

  /**
   * Control type, determines how the control behaves and works.
   *
   * Based on `CtrlType`.
   */
  type: Number;

  /**
   * Custom flag, to add compatibility with the `CtrlBS4Renderer` custom
   * radio and checkbox inputs.
   */
  custom: Boolean;

  /**
   * Custom CSS class to be applied on the input (or anything the renderer uses).
   */
  customClass: String;

  /**
   * Custom CSS class to be applied on the control's wrapper, if necessary.
   */
  wrapClass: String;

  /**
   * `onChange` callable function, must accept the control value as input.
   */
  onChange: CtrlChangeCallback|null;

  /**
   * Callable function or array of callable functions that are applied to the
   * control's value during validation/processing.
   *
   * Callables should accept the control value and return the modified input.
   */
  interceptors: CtrlCallback|CtrlCallback[];

  /**
   * Control message, usually display the status messages.
   */
  message: String;

  /**
   * Control required status.
   */
  required: Boolean;

  /**
   * Control required status message.
   */
  requiredMessage: String;

  /**
   * Max input length.
   */
  maxLength: Number;

  /**
   * Max input length validation message.
   */
  maxLengthMessage: String;

  /**
   * Min input length.
   */
  minLength: Number;

  /**
   * Min input length validation message.
   */
  minLengthMessage: String;

  /**
   * Max answers accepted, when using the `CtrlType.MULTIPLE_OPTION` input.
   */
  maxAnswers: Number;

  /**
   * Max answers validation message.
   */
  maxAnswersMessage: String;

  /**
   * Min answers accepted, when using the `CtrlType.MULTIPLE_OPTION` input.
   */
  minAnswers: Number;

  /**
   * Min answers validation message.
   */
  minAnswersMessage: String;

  /**
   * RegExp object used to validate the input.
   */
  regex: RegExp;

  /**
   * RegExp validation message.
   */
  regexMessage: String;

  /**
   * Brazilian Legal Entity Document (CNPJ) number validation message.
   *
   * Exclusive for the `CtrlTypes.CNPJ` input type.
   */
  cnpjMessage: String;

  /**
   * Brazilian Natural Person Registry (CPF) number validation message.
   *
   * Exclusive for the `CtrlTypes.CPF` input type.
   */
  cpfMessage: String;

  /**
   * Brazilian Social Integration Program (PIS) number validation message.
   *
   * Exclusive for the `CtrlTypes.PIS` input type.
   */
  pisMessage: String;

  /**
   * Credit card number validation message.
   *
   * Exclusive for the `CtrlTypes.CREDIT_CARD` input type.
   */
  creditCardMessage: String;

  /**
   * E-mail address validation message.
   *
   * Exclusive for the `CtrlTypes.EMAIL` input type.
   */
  emailMessage: String;

  /**
   * URL type validation message.
   *
   * Exclusive for the `CtrlTypes.URL` input type.
   */
  urlMessage: String;

  /**
   * `CtrlType.TEXTAREA` type input column limit.
   */
  cols: Number;

  /**
   * `CtrlType.TEXTAREA` type input row limit.
   */
  rows: Number;

  // Lifecycle
  // --------------------------------------------------------------------

  /**
   * Ctrl constructor.
   * 
   * @param props 
   *    Properties object containing parameters for this instance, all params 
   *    are optional, save for the `name` value
   */
  constructor (props: CtrlPropsObject) {
    try {
      props = Ctrl.mapPropsToDefault(props);
  
      if (!props.name) {
        throw new TypeError(
          "You must provide at least a `name` attribute to a `Ctrl` instance."
        );
      }

      Object.keys(props).map((key) => {
        this[key] = props[key];
      });

      // Intercept values on load to avoid some problemas
      this.value = this.applyInterceptors(this.value);
    } catch (e) {
      console.exception(e);
    }
  }

  // Getters + Setters
  // --------------------------------------------------------------------

  /**
   * Alias for `interceptors`.
   * 
   * @type {CtrlCallback|CtrlCallback[]}
   */
  get interceptor (): CtrlCallback|CtrlCallback[] {
    return this.interceptors;
  }

  set interceptor (value: CtrlCallback|CtrlCallback[]) {
    this.interceptors = value;
  }

  /**
   * Control value.
   */
  get value (): any {
    return this._value;
  }

  set value (value: any) {
    switch (this.type) {
      case CtrlType.CEP:
        value = Cep.filter(value);
        break;
      case CtrlType.PHONE:
        value = Phone.filter(value);
        break;
      case CtrlType.CPF:
        value = Cpf.filter(value);
        break;
      case CtrlType.CNPJ:
        value = Cnpj.filter(value);
        break;
      case CtrlType.PIS:
        value = Pis.filter(value);
        break;
    }
    
    this._value = value;
  }

  // Public Methods
  // --------------------------------------------------------------------

  /**
   * Applies any interceptors defined for the current control on the value 
   * provided, returning the modified value.
   * 
   * Interceptors are applied on a FIFO (First In First Out) basis.
   * 
   * @param value 
   *     Control input value to intercept 
   */
  public applyInterceptors (value: any): any {
    const { interceptors } = this;

    if (interceptors && interceptors !== null && interceptors !== undefined) {
      try {
        if (Array.isArray(interceptors)) {
          for (let func in interceptors) {
            let currentFunc: CtrlCallback = interceptors[func];
            value = currentFunc(value);
          }
        } else {
          value = interceptors(value);
        }
      } catch (err) {
        console.exception(err, interceptors);
      }
    }

    return value;
  }

  /**
   * Returns the controller type (for input tags).
   */
  public getType (): string {
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
      case CtrlType.CEP:
        return "tel";
      case CtrlType.PASSWORD:
        return "password";
      case CtrlType.EMAIL:
        return "email";
      case CtrlType.DATE:
      default:
        return "text";
    }
  }

  /**
   * Forces invalidation on this control with an error message, can be used 
   * to override any message set on the controller.
   * 
   * @param message 
   *     Message to be set 
   */
  public invalidate (message: String = ""): Ctrl {
    this.state = CtrlStates.ERROR;
    this.message = message || "Invalid input value provided.";
    return this;
  }

  /**
   * Checks if the desired option is currently selected/present on the
   * value array.
   *
   * Works only for multi-option type inputs.
   *
   * Must be fired on the renderer.
   *
   * @param option 
   *      Single option to test for
   */
  public isValueSelected (option: any): Boolean {
    const { value } = this;

    return (
      value 
      && Array.isArray(value) 
      && value.indexOf(option) >= 0
    );
  }

  /**
   * Fires when a boolean type input suffers change/toggle.
   *
   * Must be fired on the renderer.
   *
   * @param value
   *      Value to toggle
   */
  public onBooleanChange (value: Boolean) {
    this.value = value;
    this.resetState();
    if (this.onChange) this.onChange(null, value);
  }

  /**
   * Fires when the value is modified.
   *
   * Must be fired on the renderer.
   *
   * @param value
   *     Value to update
   */
  public onValueChange (value: any): void {
    this.value = this.applyInterceptors(value);
    this.resetState();
    if (this.onChange) this.onChange(null, value);
  }

  /**
   * Fires when a single option is checked/unchecked on a multi-option
   * input type.
   *
   * Must be executed individually on each check.
   *
   * Must be fired on the renderer.
   *
   * @param value
   *     Value to toggle
   */
  public onValueToggle(value: any): void {
    value = this.applyInterceptors(value);

    let valuesArray: any = this.value;
    if (!valuesArray || !(valuesArray instanceof Array)) {
      valuesArray = [];
      valuesArray.push(value);
    } else {
      let _idx: number = valuesArray.indexOf(value);

      if (_idx >= 0) {
        valuesArray.splice(_idx, 1);
      } else {
        valuesArray.push(value);
      }
    }

    this.value = valuesArray;
    this.resetState();
    if (this.onChange) this.onChange(null, value);
  }

  /**
   * Resets the control state to default.
   * 
   * @param clean 
   *     When set to `true`, cleans the control's `dirty` state 
   */
  public resetState (clean: Boolean = false): void {
    this.message = "";
    this.state = CtrlStates.NORMAL;
    if (clean === true) this.dirty = false;
  }

  /**
   * Overrides the default `toJSON()` method. returning a single object with all 
   * key/value pairs mirroring the properties of this control.
   * 
   * Not all values are returned, though.
   */
  public toJSON (): object {
    return {
      name: this.name,
      altName: this.altName,
      info: this.info,
      description: this.description,
      label: this.label,
      autocomplete: this.autocomplete,
      value: this.value,
      disabled: this.disabled,
      options: this.options,
      state: this.state,
      placeholder: this.placeholder,
      type: this.type,
      custom: this.custom,
      customClass: this.customClass,
      wrapClass: this.wrapClass,
      required: this.required,
      maxLength: this.maxLength,
      minLength: this.minLength,
      maxAnswers: this.maxAnswers,
      minAnswers: this.minAnswers,
      regex: this.regex.toString() || null,
      cols: this.cols,
      rows: this.rows
    };
  }

  /**
   * Overrides the default `toString()` method.
   */
  public toString (): string {
    return "[object Ctrl]";
  }

  /**
   * Validates the current control.
   */
  public validate (): boolean {
    this.resetState();

    return (
      this.validateRequired() 
      && this.validateMinLength() 
      && this.validateMaxLength() 
      && this.validateMinAnswers() 
      && this.validateMaxAnswers() 
      && this.validateRegex() 
      && this.validateEmail() 
      && this.validateUrl() 
      && this.validateCnpj() 
      && this.validateCpf() 
      && this.validatePis() 
      && this.validateCreditCard()
    );
  }

  // Private Methods
  // --------------------------------------------------------------------

  /**
   * Makes sure the input value is always a numeric-only string, returns an 
   * empty string if invalid.
   * 
   * @param value 
   *     Value to assert 
   */
  private assertIsNumericString (value: any): string {
    if (typeof value !== "number" && typeof value !== "string") return "";
    if (typeof value === "number") value = value.toString();
    value = value.replace(/[^\d]/g, "");
    return value;
  }

  /**
   * Validates the `required` status.
   */
  private validateRequired (): boolean {
    const { value, required, requiredMessage } = this;

    if (
      required 
      && (
        !value 
        || value === "" 
        || value && Array.isArray(value) && !value.length
      )
    ) {
      this.message = requiredMessage;
      this.state = CtrlStates.ERROR;
      return false;
    }

    return true;
  }

  /**
   * Validates an e-mail input type using `@yuigoto/validators`.
   * 
   * @private
   */
  private validateEmail (): boolean {
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
   * @private
   */
  private validateRegex (): boolean {
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
   * @private
   */
  private validateCpf (): boolean {
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
   * @private
   */
  private validateCnpj (): boolean {
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
   * @private
   */
  private validatePis (): boolean {
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
   * @private
   */
  private validateUrl (): boolean {
    const { type, value, urlMessage } = this;

    if (
      type === CtrlType.URL
      && value !== null
      && !Url.validate(value)
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
   * @private
   */
  private validateCreditCard (): boolean {
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

  /**
   * Validates the max length of the input value.
   * 
   * @private
   */
  private validateMaxLength (): boolean {
    let { value, maxLength, maxLengthMessage } = this;
    
    if (
      this.type === CtrlType.CNPJ
      || this.type === CtrlType.CPF 
      || this.type === CtrlType.PIS 
      || this.type === CtrlType.CREDIT_CARD 
      || this.type === CtrlType.PHONE   
    ) {
      value = this.assertIsNumericString(value);
    }

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
   * @private
   */
  private validateMinLength (): boolean {
    let { value, maxLength, minLengthMessage } = this;
    
    if (
      this.type === CtrlType.CNPJ
      || this.type === CtrlType.CPF 
      || this.type === CtrlType.PIS 
      || this.type === CtrlType.CREDIT_CARD 
      || this.type === CtrlType.PHONE   
    ) {
      value = this.assertIsNumericString(value);
    }

    if (
      this.minLength 
      && this.minLength > 1 
      && value 
      && value.length < this.minLength
    ) {
      this.message = this.minLengthMessage;
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
   * @private
   */
  private validateMaxAnswers (): boolean {
    const { value, maxAnswers, maxAnswersMessage } = this;

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
   * @private
   */
  private validateMinAnswers (): boolean {
    const { value, minAnswers, minAnswersMessage } = this;

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

  // Static Methods
  // --------------------------------------------------------------------

  /**
   * Generates a `defaultProps` object for a `Ctrl` instance.
   */
  static defaultProps (): CtrlPropsObject {
    let _default: CtrlPropsObject = {
      name: "",
      altName: "",
      info: "",
      description: "",
      label: "",
      autocomplete: "",
      value: "",
      disabled: false,
      options: [],
      state: CtrlStates.NORMAL,
      dirty: false,
      placeholder: "",
      type: CtrlType.DEFAULT,
      custom: null,
      customClass: null,
      wrapClass: null,
      onChange: null,
      interceptors: null,
      message: "",
      required: false,
      requiredMessage: "",
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

    return _default;
  }

  /**
   * Receives a `CtrlPropsObject` containing all the desired props to be set 
   * for a `Ctrl` instance.
   * 
   * These properties will be mapped and override the default properties where 
   * needed.
   * 
   * @param props 
   *     `CtrlPropsObject` object with all the desired props to map
   */
  static mapPropsToDefault (props: CtrlPropsObject): CtrlPropsObject {
    let propsToMap = Object.assign(
      {},
      Ctrl.defaultProps(),
      props
    );

    if (propsToMap.required === true && propsToMap.requiredMessage.trim() === "") {
      propsToMap.requiredMessage = `This field is required.`;
    }

    if (propsToMap.maxLength && propsToMap.maxLengthMessage.trim() === "") {
      propsToMap.maxLengthMessage = `Max length accepted is "${propsToMap.maxLength}" characters.`;
    }

    if (propsToMap.minLength && propsToMap.minLengthMessage.trim() === "") {
      propsToMap.minLengthMessage = `Min length accepted is "${propsToMap.minLength}" characters.`;
    }

    if (propsToMap.maxAnswers && propsToMap.maxAnswersMessage.trim() === "") {
      propsToMap.maxAnswersMessage = `You can't choose more than "${propsToMap.maxAnswers}" options.`;
    }

    if (propsToMap.minAnswers && propsToMap.minAnswersMessage.trim() === "") {
      propsToMap.minAnswersMessage = `Please choose at least "${propsToMap.minAnswers}" options.`;
    }

    if (propsToMap.regex && propsToMap.regexMessage.trim() === "") {
      propsToMap.regexMessage = `The current value doesn't match the regular expression.`;
    }

    if (propsToMap.cnpjMessage.trim() === "") {
      propsToMap.cnpjMessage = "Invalid CNPJ number.";
    }

    if (propsToMap.cpfMessage.trim() === "") {
      propsToMap.cpfMessage = "Invalid CPF number.";
    }

    if (propsToMap.pisMessage.trim() === "") {
      propsToMap.pisMessage = "Invalid PIS number.";
    }

    if (propsToMap.creditCardMessage.trim() === "") {
      propsToMap.creditCardMessage = "Invalid credit card number.";
    }

    if (propsToMap.emailMessage.trim() === "") {
      propsToMap.emailMessage = "Invalid email address provided.";
    }

    if (propsToMap.urlMessage.trim() === "") {
      propsToMap.urlMessage = "Invalid URL provided.";
    }

    switch (propsToMap.type) {
      case CtrlType.BOOLEAN:
        propsToMap.value = (propsToMap.value === true);
        break;
      case CtrlType.NUMBER:
        propsToMap.value = (typeof propsToMap.value === "string")
          ? propsToMap.value.replace(/([^\d\-().,]+)/g, "")
          : propsToMap.value;
        break;
      case CtrlType.RADIO_GROUP:
      case CtrlType.CHECKBOX_GROUP:
      case CtrlType.SINGLE_OPTION:
      case CtrlType.MULTIPLE_OPTION:
        propsToMap.value = (Array.isArray(propsToMap.value))
          ? propsToMap.value
          : [];
        break;
      case CtrlType.DROPDOWN:
      default:
        propsToMap.value = propsToMap.value || "";
        break;
    }

    return propsToMap;
  }

  /**
   * Removes all non-digit characters from a string/number.
   * 
   * USE WITH CARE!
   * 
   * @param value 
   *     Value to be sanitized
   */
  static toNumbers (value: string|number): string {
    value = (typeof value !== "number") 
      ? value.trim()
      : value.toString();
    return value.replace(/[^\d]/g, "");
  }
}
