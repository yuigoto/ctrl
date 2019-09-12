/**
 * Ctrl/CtrlDataType/CtrlCallback
 * ----------------------------------------------------------------------
 * Describes the blueprint for an interceptor callback for a `Ctrl` instance.
 * 
 * It receives data and returns it modified.
 * 
 * @since 0.5.0
 */
export type CtrlCallback = (value: any) => any;

/**
 * Ctrl/CtrlDataType/CtrlChangeCallback
 * ----------------------------------------------------------------------
 * Describes the blueprint for an `onChange` event callback for a `Ctrl` 
 * instance.
 * 
 * @since 0.5.0
 */
export type CtrlChangeCallback = (event: Event, value: any) => void;

/**
 * Ctrl/CtrlDataType/CtrlOptionItem
 * ----------------------------------------------------------------------
 * Describes how you should declare an option for a `CtrlPropsObject` when 
 * using it to create any of these types of controls:
 * - `CtrlType.DROPDOWN`;
 * - `CtrlType.SINGLE_OPTION`;
 * - `CtrlType.MULTIPLE_OPTION`;
 * - `CtrlType.CHECKBOX_GROUP`;
 * - `CtrlType.RADIO_GROUP`;
 * 
 * @since 0.5.0
 */
export type CtrlOptionItem = {
  name: string,
  value: any
};

/**
 * Ctrl/CtrlDataType/CtrlPropsObject
 * ----------------------------------------------------------------------
 * Describes a blueprint for the props/default props object to generate a 
 * `Ctrl` instance.
 * 
 * @since 0.5.0
 */
export type CtrlPropsObject = {
  name: string,
  altName: string,
  info: string,
  description: string,
  label: string,
  value: any,
  disabled: boolean,
  options: CtrlOptionItem[],
  state: number,
  dirty: boolean,
  placeholder: string,
  type: number,
  custom: boolean,
  customClass: string,
  wrapClass: string,
  onChange: CtrlChangeCallback|null,
  interceptors: CtrlCallback|CtrlCallback[],
  message: string,
  required: boolean,
  requiredMessage: string,
  maxLength: number,
  maxLengthMessage: string,
  minLength: number,
  minLengthMessage: string,
  maxAnswers: number,
  maxAnswersMessage: string,
  minAnswers: number,
  minAnswersMessage: string,
  regex: RegExp,
  regexMessage: string,
  cnpjMessage: string,
  cpfMessage: string,
  pisMessage: string,
  creditCardMessage: string,
  emailMessage: string,
  urlMessage: string,
  cols: number,
  rows: number
};
