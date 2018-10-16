// Dependencies
import React from "react";
import PropTypes from "prop-types";

// Project import
import Ctrl from "ctrl/Ctrl";

/**
 * Ctrl\CtrlCollection
 * ----------------------------------------------------------------------
 * Represents a `Ctrl` collection, useful for managing sets of controls for
 * forms or other uses.
 *
 * Requires `Ctrl`.
 *
 * Expanded fork of Rodrigo Portela's `XcontrolCollection`.
 *
 * @author    Fabio Y. Goto <lab@yuiti.com.br>
 * @since     0.0.1
 * @copyright (c) 2018 Fabio Y. Goto
 * @license   MIT
 */
class CtrlCollection {
  // Properties
  // --------------------------------------------------------------------

  /**
   * Holds all controls.
   *
   * @type {Array}
   */
  controls;

  // Constructor
  // --------------------------------------------------------------------

  /**
   * CtrlCollection constructor.
   */
  constructor() {
    // Set initial state
    this.controls = [];
  }

  // Methods
  // --------------------------------------------------------------------

  /**
   * Returns an object containing all values from the controls.
   *
   * @param {*} target
   */
  toObject(target) {
    if (!target || target === null || target === undefined) {
      target = {};
    }

    // Assign the values
    for (let ctrl of this.controls) {
      if (
        ctrl.value
        && ctrl.value !== null
        && ctrl.value !== undefined
      ) {
        target[ctrl.name] = ctrl.value;
      }
    }

    return target;
  }

  // Control Management
  // --------------------------------------------------------------------

  /**
   * Creates a new controller with the arguments provided and pushes it
   * into the collection.
   *
   * Accepted arguments include:
   * - TODO: List of arguments...
   *
   * @param {Object} control_args
   * @return {CtrlCollection}
   */
  add(control_args) {
    if (!control_args || control_args === null || control_args === undefined) {
      console.error(
        "Please provide valid control arguments."
      );
      return this;
    }

    // No unnamed controls
    if (
      !control_args.name
      || control_args.name === null
      || control_args.name === ""
      || control_args.name === undefined
    ) {
      console.error(
        "The 'name' property is required for every control."
      );
      return this;
    }

    // Adds the control to the array
    this.controls.push(new Ctrl(control_args));

    return this;
  }

  /**
   * Retrieves a control from the collection.
   *
   * @param {String} name
   * @returns {Ctrl|Boolean}
   */
  get(name) {
    for (let control of this.controls) {
      if (name === control.name) return control;
    }
    return false;
  }

  /**
   * Used to update/change/set a control in the collection with a new
   * instance.
   *
   * @param {Ctrl} control
   * @return {CtrlCollection}
   */
  set(control) {
    let name = control.name;

    for (let i in this.controls) {
      if (name === this.controls[i].name) {
        this.controls[i] = control;
        return this;
      }
    }

    this.controls.push(control);
    return this;
  }

  /**
   * Removes a control from the collection.
   *
   * @param {String} name
   * @return {CtrlCollection}
   */
  remove(name) {
    for (let i in this.controls) {
      if (name === this.controls[i].name) {
        this.controls.splice(i, 1);
        return this;
      }
    }

    return this;
  }

  /**
   * Validates this control set.
   *
   * @returns {boolean}
   */
  validate() {
    let isValid = true;

    for (let i in this.controls) {
      isValid = this.controls[i].validate() && isValid;
    }

    return isValid;
  }

  /**
   * Invalidates a single control in this collection.
   *
   * @param {String} name
   * @param {String} message
   * @returns {boolean}
   */
  invalidate(name, message) {
    let ctrl = this.get(name);
    return (ctrl && ctrl !== null && ctrl !== undefined)
      ? ctrl.invalidate(message) !== null
      : false;
  }

  /**
   * Invalidates all controls in this collection.
   *
   * USE WITH CARE!
   */
  invalidateAll() {
    for (let i in this.controls) {
      this.controls[i].invalidate();
    }
    console.log(this.controls);
  }

  // Value Getter/Setter
  // --------------------------------------------------------------------

  /**
   * Retrieves the value of a single control.
   *
   * @param {String} name
   * @returns {*}
   */
  getValue(name) {
    let ctrl = this.get(name);
    return (ctrl && ctrl !== null && ctrl !== undefined)
      ? ctrl.value : undefined;
  }

  /**
   * Sets the value of a single control.
   *
   * @param {String} name
   * @param {String} value
   */
  setValue(name, value) {
    let ctrl = this.get(name);

    if (ctrl && ctrl !== null && ctrl !== undefined) {
      ctrl.value = value;
      return true;
    }

    return false;
  }
}

// PropTypes
// ----------------------------------------------------------------------

CtrlCollection.defaultProps = {
  controls: []
};

CtrlCollection.propTypes = {
  controls: PropTypes.arrayOf(
    PropTypes.instanceOf(Ctrl)
  )
};

export default CtrlCollection;
