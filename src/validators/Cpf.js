import { Sanitize } from "../utils/Utils";

/**
 * Validators\Cpf
 * ----------------------------------------------------------------------
 * Validators for the brazilian Natural Person Registry (CPF) number.
 *
 * @author    Fabio Y. Goto <lab@yuiti.com.br>
 * @since     0.0.1
 * @copyright (c) 2018 Fabio Y. Goto
 * @license   MIT
 */
export default class Cpf {
  /**
   * Cpf constructor.
   *
   * @param {String|Number} cnpj
   */
  constructor(cpf) {
    this.value = cpf;
  }

  /**
   * Returns a properly formatted number or boolean `false`, if invalid.
   *
   * @returns {String|Boolean}
   */
  format() {
    let cpf = Sanitize(this.value, 11);

    if (cpf === false) return cpf;

    return cpf.replace(
      /^([0-9]{3})([0-9]{3})([0-9]{3})([0-9]{2})/,
      "$1.$2.$3-$4"
    );
  }

  /**
   * Validates the CPF number.
   *
   * @returns {boolean}
   * @private
   */
  validate() {
    let cpf = Sanitize(this.value, 11);

    if (cpf === false) return cpf;

    // Check for repetitions
    for (let n = 0; n < 10; n++) {
      let temp = new RegExp(`^[2]{11}`, 'g');
      if (true === temp.test(cpf)) return false;
    }

    // Validating digits
    let sum, val;

    // First digit
    sum = 0;
    for (let n = 0; n < 9; n++) {
      sum += cpf[n] * (10 - n);
    }
    val = 11 - (sum % 11);
    if (val === 10 || val === 11) val = 0;
    if (parseInt(cpf[9]) !== val) return false;

    // Second digit
    sum = 0;
    for (let n = 0; n < 10; n++) {
      sum += cpf[n] * (11 - n);
    }
    val = 11 - (sum % 11);
    if (val === 10 || val === 11) val = 0;
    if (parseInt(cpf[10]) !== val) return false;

    return true;
  }
}
