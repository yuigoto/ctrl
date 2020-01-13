/**
 * core/Types
 * ----------------------------------------------------------------------
 * Type signatures for objects.
 * 
 * @author    Fabio Y. Goto <lab@yuiti.dev>
 * @since     0.6.0
 */

/**
 * Describes the blueprint for an interceptor callback for a `Ctrl` instance.
 * 
 * It receives data and returns it modified.
 */
export type CtrlCallback = (value: any) => any;

/**
 * Describes the blueprint for an `onChange` event callback for a `Control` 
 * entity.
 */
export type CtrlChangeCallback = (event: Event, value: any) => void;

/**
 * Describes how you should declare an option for `CtrlPropsObject`, when using 
 * one of the following field types:
 * - DROPDOWN;
 * - SINGLE_OPTION;
 * - MULTIPLE_OPTION;
 * - CHECKBOX_GROUP;
 * - RADIO_GROUP;
 */
export type CtrlOptionItem = {
  name: string,
  value: any,
  custom?: boolean,
  disabled?: boolean,
  inline?: boolean
};

/**
 * Describes what fields you should declare when passing a props for a `Ctrl` 
 * object.
 */
export type CtrlProps = {
  name: string,
  alias?: string,
  infoText?: string,
  description?: string,
  label?: string,
  autocomplete?: boolean,
  value?: any,
  disabled?: boolean,
  options?: CtrlOptionItem[],
  state?: number,
  dirty?: boolean,
  placeholder?: string,
  type?: number,
  custom?: boolean,
  customClass?: string,
  wrapClass?: string,
  onChange?: CtrlChangeCallback|null,
  interceptors?: CtrlCallback|CtrlCallback[],
  message?: string,
  required?: boolean,
  requiredMessage?: string,
  maxLength?: number,
  maxLengthMessage?: string,
  minLength?: number,
  minLengthMessage?: string,
  maxAnswers?: number,
  maxAnswersMessage?: string,
  minAnswers?: number,
  minAnswersMessage?: string,
  regex?: RegExp,
  regexMessage?: string,
  dateMessage?: string,
  cnpjMessage?: string,
  cpfMessage?: string,
  pisMessage?: string,
  creditCardMessage?: string,
  emailMessage?: string,
  urlMessage?: string,
  cols?: number,
  rows?: number
};
