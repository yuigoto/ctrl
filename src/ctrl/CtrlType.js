/**
 * Ctrl/CtrlType
 * ----------------------------------------------------------------------
 * Enum-like object with key/value pairs standing for the input types 
 * possible with a instance of `Ctrl`.
 * 
 * @since   0.2.0
 */
export const CtrlType = {
  DEFAULT: 0,
  SINGLE_OPTION: 1,
  MULTIPLE_OPTION: 2,
  DROPDOWN: 3,
  TEXTAREA: 4,
  BOOLEAN: 5,
  PASSWORD: 6,

  CHECKBOX_GROUP: 11,
  RADIO_GROUP: 12,
  
  // Brazilian Document Number Types
  CNPJ: 21,
  CPF: 22,
  PIS: 23,
  
  // Generic Strings
  CREDIT_CARD: 31,
  EMAIL: 32,
  PHONE: 33,
  URL: 34
};
