import {
  Cep,
  Phone,
  Email,
  Cpf,
  Cnpj,
  Pis,
  DateString,
  Url,
  CreditCard
} from "@yuigoto/validators";
import { 
  CtrlChangeCallback, 
  CtrlCallback, 
  CtrlProps, 
  CtrlOptionItem 
} from "../core/Types";
import { 
  MapDefaultCtrlProps, 
  ToNumericString 
} from "../core/Utils";
import { 
  CtrlType, 
  CtrlStates
} from "../core/Enum";

/**
 * ctrl/Ctrl
 * ----------------------------------------------------------------------
 * Multi-purpose control class, mostly useful for HTML inputs.
 *
 * @author    Fabio Y. Goto <lab@yuiti.dev>
 * @since     0.5.0
 */
export default class Ctrl {
  /**
   * Class index signature, so we won't have any implicitAny errors.
   */
  [key: string]: any;
  
  // PRIVATE PROPERTIES
  // --------------------------------------------------------------------
  
  /**
   * Control value.
   */
  private _value: any;
  
  // PUBLIC PROPERTIES
  // --------------------------------------------------------------------
  
  /**
   * Control name.
   */
  public name: string;
  
  /**
   * Control alias, to use when needed (e.g.: same controller has two names).
   */
  public alias: string;
  
  /**
   * Additional information for the control, either for the label or description.
   */
  public infoText: string;

  /**
   * Control description, used for special information.
   */
  public description: string;

  /**
   * Control label, must be a human-readable string.
   */
  public label: string;

  /**
   * Autocomplete toggle.
   */
  public autocomplete: boolean;
  
  /**
   * If the current control is disabled or not.
   */
  public disabled: boolean;

  /**
   * Control options, when using these types:
   * - DROPDOWN;
   * - SINGLE_OPTION;
   * - MULTIPLE_OPTION;
   * - CHECKBOX_GROUP;
   * - RADIO_GROUP;
   */
  public options: CtrlOptionItem[];

  /**
   * Control state, based on `CtrlStates`.
   */
  public state: number;

  /**
   * If the control was, somehow, modified by the user.
   */
  public dirty: boolean;

  /**
   * Human-readable placeholder text for fields.
   */
  public placeholder: string;

  /**
   * Control type, determines how the control behaves and works.
   *
   * Based on `CtrlType`.
   */
  public type: number;

  /**
   * Custom flag, to add compatibility with the `Bootstrap4` renderer's custom
   * radio and checkbox inputs.
   */
  public custom: boolean;

  /**
   * Custom CSS class to be applied on the input (or anything the renderer uses).
   */
  public customClass: string;

  /**
   * Custom CSS class to be applied on the control's wrapper, if necessary.
   */
  public wrapClass: string;

  /**
   * `onChange` callable function, must accept the control value as input.
   */
  public onChange: CtrlChangeCallback|null;

  /**
   * Callable function or array of callable functions that are applied to the
   * control's value during validation/processing.
   *
   * Callables should accept the control value and return the modified input.
   */
  public interceptors: CtrlCallback|CtrlCallback[];
  
  /**
   * Control message, usually display the status messages.
   */
  public message: string;

  /**
   * Control required status.
   */
  public required: boolean;

  /**
   * Control required status message.
   */
  public requiredMessage: string;

  /**
   * Max input length.
   */
  public maxLength: number;

  /**
   * Max input length validation message.
   */
  public maxLengthMessage: string;

  /**
   * Min input length.
   */
  public minLength: number;

  /**
   * Min input length validation message.
   */
  public minLengthMessage: string;

  /**
   * Max answers accepted, when using the `MULTIPLE_OPTION` input.
   */
  public maxAnswers: number;

  /**
   * Max answers validation message.
   */
  public maxAnswersMessage: string;

  /**
   * Min answers accepted, when using the `MULTIPLE_OPTION` input.
   */
  public minAnswers: number;

  /**
   * Min answers validation message.
   */
  public minAnswersMessage: string;

  /**
   * RegExp object used to validate the input.
   */
  public regex: RegExp;

  /**
   * RegExp validation message.
   */
  public regexMessage: string;

  /**
   * Date validation message.
   */
  public dateMessage: string;

  /**
   * Brazilian Legal Entity Document (CNPJ) number validation message.
   *
   * Exclusive for the `CNPJ` input type.
   */
  public cnpjMessage: string;

  /**
   * Brazilian Natural Person Registry (CPF) number validation message.
   *
   * Exclusive for the `CPF` input type.
   */
  public cpfMessage: string;

  /**
   * Brazilian Social Integration Program (PIS) number validation message.
   *
   * Exclusive for the `PIS` input type.
   */
  public pisMessage: string;

  /**
   * Credit card number validation message.
   *
   * Exclusive for the `CREDIT_CARD` input type.
   */
  public creditCardMessage: string;

  /**
   * E-mail address validation message.
   *
   * Exclusive for the `EMAIL` input type.
   */
  public emailMessage: string;

  /**
   * URL type validation message.
   *
   * Exclusive for the `URL` input type.
   */
  public urlMessage: string;

  /**
   * `TEXTAREA` type input column limit.
   */
  public cols: number;

  /**
   * `TEXTAREA` type input row limit.
   */
  public rows: number;
  
  // LIFECYCLE
  // --------------------------------------------------------------------
  
  /**
   * Constructor.
   * 
   * @param props 
   *    Properties object containing parameters for this instance, all params 
   *    are optional, save for the `name` value 
   */
  constructor (props: CtrlProps) {
    try {
      props = MapDefaultCtrlProps(props);
      
      if (!props.name) {
        throw new TypeError(
          "You must provide at least a `name` atribute to a `Ctrl` instance."
        );
      } else {
        Object.keys(props).map((key) => {
          this[key] = (props as any)[key];
        });
        
        // Intercept values on load to avoid problems
        this.value = this.applyInterceptors(this.value);
      }
    } catch (e) {
      console.error(e);
    }
  }
  
  // GETTERS + SETTERS
  // --------------------------------------------------------------------
  
  /**
   * Callable function or array of callable functions that are applied to the
   * control's value during validation/processing.
   *
   * Callables should accept the control value and return the modified input.
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
      case CtrlType.DATE:
        value = DateString.filter(value);
        break;
    }
    
    this._value = value;
  }
  
  // PUBLIC METHODS
  // --------------------------------------------------------------------
  
  /**
   * Applies any interceptors defined for the current control on the value 
   * provided, returning the modified value.
   * 
   * Interceptors are applied on a FIFO basis.
   * 
   * @param value 
   *     Control input value to intercept 
   */
  public applyInterceptors (value: any): any {
    const { interceptors } = this;
    
    if (interceptors && interceptors !== null && interceptors !== undefined) {
      try {
        if (Array.isArray(interceptors)) {
          for (let currentInterceptor of interceptors) {
            value = currentInterceptor(value);
          }
        } else {
          value = interceptors(value);
        }
      } catch (e) {
        console.error(e, interceptors);
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
  public invalidate (message: string = ""): Ctrl {
    this.state = CtrlStates.ERROR;
    this.message = message || "Invalid input value provided";
    return this;
  }
  
  /**
   * Checks if the desired option is currently selected/present on the
   * value array.
   *
   * Works only for `MULTIPLE_OPTION` and `CHECKBOX_GROUP` type inputs.
   *
   * IMPORTANT:
   * Must be fired by the renderer.
   *
   * @param option 
   *      Single option to test for
   */
  public isValueSelected (option: any): boolean {
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
   * IMPORTANT:
   * Must be fired by the renderer.
   *
   * @param value
   *      Value to toggle
   */
  public onBooleanChange (value: boolean): void {
    this.value = !value;
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
   * Fires when a value is toggled on any input. Use it for the `CHECKBOX_GROUP` 
   * and `MULTIPLE_OPTION` input types.
   *
   * Must be fired on the renderer.
   *
   * @param value
   *     Value to update
   */
  public onValueToggle (value: any): void {
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
   * Returns a POJO representation of this class' object, this is called when
   * `JSON.stringify` is used on an instance of this class.
   */
  public toJSON (): object {
    return {
      name: this.name,
      alias: this.alias,
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
      regex: (this.regex instanceof RegExp) ? this.regex.toString() : null,
      cols: this.cols,
      rows: this.rows
    };
  }

  /**
   * Returns a string representation of an object, overrides default method.
   */
  public toString (): string {
    return `[object Ctrl]`;
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
      && this.validateDate()
      && this.validateEmail() 
      && this.validateUrl() 
      && this.validateCnpj() 
      && this.validateCpf() 
      && this.validatePis() 
      && this.validateCreditCard()
    );
  }

  /**
   * Resets the control state to default.
   * 
   * @param clean 
   *     When set to `true`, cleans the control's `dirty` state 
   */
  public resetState (clean: boolean = false): void {
    this.message = "";
    this.state = CtrlStates.NORMAL;
    if (clean === true) this.dirty = false;
  }
  
  // PRIVATE METHODS
  // --------------------------------------------------------------------
  
  /**
   * Validates `required` status.
   */
  private validateRequired (): boolean {
    const {
      value,
      required,
      requiredMessage
    } = this;
    
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
   * Validates the min length of the input value.
   */
  private validateMinLength (): boolean {
    let { 
      value, 
      minLength, 
      minLengthMessage
    } = this;
    
    if (
      this.type === CtrlType.CNPJ
      || this.type === CtrlType.CPF 
      || this.type === CtrlType.PIS 
      || this.type === CtrlType.CREDIT_CARD 
      || this.type === CtrlType.PHONE
      || this.type === CtrlType.DATE
    ) {
      value = ToNumericString(value);
    }

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
   * Validates the max length of the input value.
   */
  private validateMaxLength (): boolean {
    let { 
      value, 
      maxLength, 
      maxLengthMessage
    } = this;
    
    if (
      this.type === CtrlType.CNPJ
      || this.type === CtrlType.CPF 
      || this.type === CtrlType.PIS 
      || this.type === CtrlType.CREDIT_CARD 
      || this.type === CtrlType.PHONE
      || this.type === CtrlType.DATE
    ) {
      value = ToNumericString(value);
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
   * Validates the min answers allowed for this control.
   *
   * Only apply this if the value is an array of answers.
   */
  private validateMinAnswers (): boolean {
    const { 
      value, 
      minAnswers, 
      minAnswersMessage
    } = this;

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
   * Validates the max answers allowed for this control.
   *
   * Only apply this if the value is an array of answers.
   */
  private validateMaxAnswers (): boolean {
    const { 
      value, 
      maxAnswers, 
      maxAnswersMessage
    } = this;

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
   * Validates the input value against the RegExp object, if declared.
   */
  private validateRegex (): boolean {
    const { 
      value, 
      regex, 
      regexMessage
    } = this;

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
   * Validates a date string with the format `DD/MM/YYYY`.
   */
  private validateDate (): boolean {
    const {
      type,
      value,
      dateMessage
    } = this;
    
    if (
      type === CtrlType.DATE 
      && value 
      && !DateString.validate(value)
    ) {
      this.message = dateMessage;
      this.state = CtrlStates.ERROR;
      return false;
    }
    
    return true;  
  }
  
  /**
   * Validates an e-mail input type using `@yuigoto/validators`.
   */
  private validateEmail (): boolean {
    const { 
      type, 
      value, 
      emailMessage 
    } = this;
    
    if (
      type === CtrlType.EMAIL
      && value
      && !Email.validate(value)
    ) {
      this.message = emailMessage;
      this.state = CtrlStates.ERROR;
      return false;
    }
    
    return true;
  }
  
  /**
   * Validates a URL type string using `@yuigoto/validators`.
   */
  private validateUrl (): boolean {
    const { 
      type, 
      value, 
      urlMessage 
    } = this;

    if (
      type === CtrlType.URL
      && value 
      && !Url.validate(value)
    ) {
      this.message = urlMessage;
      this.state = CtrlStates.ERROR;
      return false;
    }
    
    return true;
  }
  
  /**
   * Validates a CNPJ input type using `@yuigoto/validators`.
   */
  private validateCnpj (): boolean {
    const { 
      type, 
      value, 
      cnpjMessage 
    } = this;

    if (
      type === CtrlType.CNPJ
      && value 
      && !Cnpj.validate(value)
    ) {
      this.message = cnpjMessage;
      this.state = CtrlStates.ERROR;
      return false;
    }
    
    return true;
  }
  
  /**
   * Validates a CPF input type using `@yuigoto/validators`.
   */
  private validateCpf (): boolean {
    const { 
      type, 
      value, 
      cpfMessage 
    } = this;

    if (
      type === CtrlType.CPF
      && value 
      && !Cpf.validate(value)
    ) {
      this.message = cpfMessage;
      this.state = CtrlStates.ERROR;
      return false;
    }
    
    return true;
  }
  
  /**
   * Validates a PIS input type using `@yuigoto/validators`.
   */
  private validatePis (): boolean {
    const { 
      type, 
      value, 
      pisMessage 
    } = this;

    if (
      type === CtrlType.PIS
      && value 
      && !Pis.validate(value)
    ) {
      this.message = pisMessage;
      this.state = CtrlStates.ERROR;
      return false;
    }
    
    return true;
  }
  
  /**
   * Validates a credit card input type using `@yuigoto/validators`.
   */
  private validateCreditCard (): boolean {
    const { 
      type, 
      value, 
      creditCardMessage
    } = this;
    
    if (
      type === CtrlType.CREDIT_CARD
      && value 
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
