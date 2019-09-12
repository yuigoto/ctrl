/**
 * Ctrl/CtrlType
 * ----------------------------------------------------------------------
 * Enum defining all input types supported in the library.
 *
 * @since 0.5.0
 */
export enum CtrlType {
  // 0 ~ 10 : Basic Input Types
  DEFAULT = 0,
  SINGLE_OPTION = 1,
  MULTIPLE_OPTION = 2,
  DROPDOWN = 3,
  TEXTAREA = 4,
  BOOLEAN = 5,
  PASSWORD = 6,
  DATE = 7,
  NUMBER = 8,

  // 11 ~ 20 : Alternate Names for Basic Types
  CHECKBOX_GROUP = 11,
  RADIO_GROUP = 12,

  // 21 ~ 30 : Document Input Types
  CNPJ = 21,
  CPF = 22,
  PIS = 23,

  // 31 ~ 40 : Generic Types
  CREDIT_CARD = 31,
  EMAIL = 32,
  PHONE = 33,
  URL = 34
}
