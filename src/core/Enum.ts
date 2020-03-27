/**
 * core/Enum
 * ----------------------------------------------------------------------
 * This file stores all enumerators used for `Ctrl` instances.
 * 
 * @author    Fabio Y. Goto <lab@yuiti.dev>
 * @since     0.6.0
 */

/**
 * Stores IDs for each state for a `Ctrl`.
 */
export enum CtrlStates {
  ERROR             = -1,
  NORMAL            = 0,
  VALID             = 1
};

/**
 * Stores IDs for all input types available for a `Ctrl` instance.
 */
export enum CtrlType {
  // 0 => 10 : BASIC INPUT TYPES
  // --------------------------------------------------------------------
  DEFAULT           = 0,
  SINGLE_OPTION     = 1,
  MULTIPLE_OPTION   = 2,
  DROPDOWN          = 3,
  TEXTAREA          = 4,
  BOOLEAN           = 5,
  PASSWORD          = 6,
  DATE              = 7,
  NUMBER            = 8,

  // 11 => 20 : ALTERNATE NAMES FOR BASIC TYPES
  // --------------------------------------------------------------------
  CHECKBOX_GROUP    = 11,
  RADIO_GROUP       = 12,

  // 21 => 30 : DOCUMENT INPUT TYPES
  // --------------------------------------------------------------------
  CNPJ              = 21,
  CPF               = 22,
  PIS               = 23,

  // 31 => 40 : GENERIC TYPES
  // --------------------------------------------------------------------
  CREDIT_CARD       = 31,
  EMAIL             = 32,
  PHONE             = 33,
  URL               = 34,
  CEP               = 35,
  
  // 999 : HIDDEN
  // --------------------------------------------------------------------
  HIDDEN            = 999
};
