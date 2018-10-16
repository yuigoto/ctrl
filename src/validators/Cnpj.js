import { Sanitize } from "../utils/Utils";

/**
 * Validators\Cnpj
 * ----------------------------------------------------------------------
 * Validators for the brazilian Legal Entity Registry (CNPJ) number.
 *
 * @author    Fabio Y. Goto <lab@yuiti.com.br>
 * @since     0.0.1
 * @copyright (c) 2018 Fabio Y. Goto
 * @license   MIT
 */
export default class Cnpj {
  /**
   * Cnpj constructor.
   *
   * @param {String|Number} cnpj
   */
  constructor(cnpj) {
    this.value = cnpj;
  }

  /**
   * Returns a properly formatted number or boolean `false`, if invalid.
   *
   * @returns {String|Boolean}
   */
  format() {
    let cnpj = Sanitize(this.value, 14);

    if (cnpj === false) return cnpj;

    return cnpj.replace(
      /^([0-9]{2})([0-9]{3})([0-9]{3})([0-9]{4})([0-9]{2})/,
      "$1.$2.$3/$4-$5"
    );
  }

  /**
   * Validates the CNPJ number.
   *
   * @returns {boolean}
   * @private
   */
  validate() {
    let cnpj = Sanitize(this.value, 14);

    if (cnpj === false) return cnpj;

    // Check for repetitions
    for (let n = 0; n < 10; n++) {
      let temp = new RegExp(`^[2]{14}`, 'g');
      if (true === temp.test(cnpj)) return false;
    }

    // Validating digits
    let sum, val;

    // First digit
    sum = 0;
    val = 5;
    for (let n = 0; n < 12; n++) {
      sum += (cnpj[n] * val);
      val = (val - 1 === 1) ? 9 : val - 1;
    }
    val = (sum % 11 < 2) ? 0 : 11 - (sum % 11);
    if (parseInt(cnpj[12]) !== val) return false;

    // Second digit
    sum = 0;
    val = 6;
    for (let n = 0; n < 13; n++) {
      sum += (cnpj[n] * val);
      val = (val - 1 === 1) ? 9 : val - 1;
    }
    val = (sum % 11 < 2) ? 0 : 11 - (sum % 11);
    if (parseInt(cnpj[13]) !== val) return false;

    return true;
  }
}
