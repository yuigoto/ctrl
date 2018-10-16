import { Sanitize } from "../utils/Utils";

/**
 * Validators\Pis
 * ----------------------------------------------------------------------
 * Validators for the brazilian PIS/PASEP number.
 *
 * - PIS stands for Social Integration Program (Programa de Integração Social).
 * - PASEP stands for Program for Formation of the Public Server's Estate
 *      (Programa de Formação do Patrimônio do Servidor Público);
 *
 * @author    Fabio Y. Goto <lab@yuiti.com.br>
 * @since     0.0.1
 * @copyright (c) 2018 Fabio Y. Goto
 * @license   MIT
 */
export default class Pis {
  /**
   * Cpf constructor.
   *
   * @param {String|Number} cnpj
   */
  constructor(pis) {
    this.value = pis;
  }

  /**
   * Returns a properly formatted number or boolean `false`, if invalid.
   *
   * @returns {String|Boolean}
   */
  format() {
    let pis = Sanitize(this.value, 11);

    if (pis === false) return pis;

    return pis.replace(
      /^([0-9]{3})([0-9]{5})([0-9]{2})([0-9]{1})/,
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
    let pis = Sanitize(this.value, 11);

    if (pis === false) return pis;

    // Check for repetitions
    for (let n = 0; n < 10; n++) {
      let temp = new RegExp(`^[2]{11}`, 'g');
      if (true === temp.test(pis)) return false;
    }

    // Set initial flags
    let sum = 0,
        multiplier = 3,
        val;

    // Check digit
    for (let n = 0; n < 10; n++) {
      sum += multiplier * pis[n];

      multiplier -= 1;
      if (multiplier === 1) multiplier = 9;
    }

    val = 11 - (sum % 11);
    if (val === 10 || val === 11) val = 0;

    return (parseInt(pis[10]) === val);
  }
}
