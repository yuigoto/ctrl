/**
 * Utils\Expressions
 * ----------------------------------------------------------------------
 * Regular expressions used in validation of multiple types of strings.
 *
 * @author    Fabio Y. Goto <lab@yuiti.com.br>
 * @since     0.0.1
 * @copyright (c) 2018 Fabio Y. Goto
 * @license   MIT
 */

/**
 * Brazilian natural person registry number (CPF).
 *
 * @type {RegExp}
 */
export const Cpf = /^(\.?[0-9]{3}){3}-?([0-9]{2})$/;

/**
 * Brazilian legal entity registry number (CNPJ).
 *
 * @type {RegExp}
 */
export const Cnpj = /^([0-9]{2})(\.?[0-9]{3}){2}\/?([0-9]{4})\-?([0-9]{2})$/;

/**
 * UUID/GUID.
 *
 * @type {RegExp}
 */
export const Uuid = /^\{?([a-f0-9]{8})(-?[a-f0-9]{4}){3}(-?[a-f0-9]{12})\}?$/;

/**
 * E-mail addresses.
 *
 * @type {RegExp}
 */
export const Email = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,9})/;

/**
 * ISO date string.
 *
 * @type {RegExp}
 */
export const IsoDate = /^([0-9]{4})(\-[0-9]{2}){2}T(:?[0-9]{2}){3}(\.[0-9]{3})Z$/;

/**
 * GMT date string.
 *
 * @type {RegExp}
 */
export const GmtDate = /^([A-z]{3}),\s([0-9]{2})\s([A-z]{3})\s([0-9]{4})\s(:?[0-9]{2}){3}\sGMT/;
