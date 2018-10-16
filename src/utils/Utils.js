/**
 * Utils\Utils
 * ----------------------------------------------------------------------
 * General purpose utilities for the components.
 *
 * @author    Fabio Y. Goto <lab@yuiti.com.br>
 * @since     0.0.1
 * @copyright (c) 2018 Fabio Y. Goto
 * @license   MIT
 */

/**
 * Sanitizes a string to a digit-only.
 *
 * Returns either the sanitized value or boolean `false`.
 *
 * If a length larger than 0 is declared, it checks for the size:
 * - If smaller than the length, adds padded zeroes to the left;
 * - If larger, returns `false`;
 *
 * @param {String|Number} value
 * @param {Number} length
 * @returns {String|Boolean}
 */
export const Sanitize = function (value, length = 11) {
  if (typeof value === "number") value = value.toString();

  // Do not accept empty strings
  if (
    value === null
    || value === undefined
    || (typeof value === "string" && value.trim() === "")
  ) {
    return false;
  }

  // Sanitize to digits only
  value = value.replace(/\D/g, "");

  // Is it empty after sanitizing?
  if (value === "") return false;

  // Pads with zeroes
  if (typeof length === "number" && length !== 0 && length > 0) {
    if (value.length > length) return false;
    if (value.length < length) {
      while(value.length < length) {
        value = '0' + value;
      }
    }
  }

  return value;
};
