import { Ctrl } from "./Ctrl";

/**
 * Ctrl/CtrlCollection
 * ----------------------------------------------------------------------
 * Provides an easy way to manage groups of `Ctrl` instances for forms or 
 * other uses.
 * 
 * @since 0.0.1
 */
export class CtrlCollection {
  // Public Properties
  // --------------------------------------------------------------------

  /**
   * Stores all control objects for the current collection.
   * 
   * @type {Array<Ctrl>}
   */
  controls;
  
  // Lifecycle
  // --------------------------------------------------------------------

  /**
   * Class constructor.
   */
  constructor() {
    this.controls = [];
  }

  // Public Methods
  // --------------------------------------------------------------------

  /**
   * Adds a `Ctrl` instance to the collection or creates one if an object with 
   * the proper arguments is provided.
   * 
   * @param {Ctrl|Object} controlArgs 
   *     `Ctrl` instance or object with props for creating one 
   * @return {CtrlCollection}
   */
  add (controlArgs) {
    if (!controlArgs || controlArgs === null || controlArgs === undefined) {
      console.error(
        "Please provide a valid `Ctrl` instance or arguments to create one."
      );
    }

    if (controlArgs instanceof Ctrl) {
      this.controls.push(controlArgs);
    }

    if (
      typeof controlArgs === "object"
      && (
        !controlArgs.hasOwnProperty("name") 
        || controlArgs.name === null 
        || controlArgs.name === undefined 
        || controlArgs.name === ""
      )
    ) {
      console.error(
        "The `name` property is required for every `Ctrl` instance."
      );
    } else {
      this.controls.push(
        new Ctrl(controlArgs) 
      );
    }

    return this;
  }

  /**
   * Retrieves a control from the collection.
   * 
   * Returns `false` if no control is found.
   * 
   * @param {String} name 
   *     Control `name` attribute 
   * @returns {Ctrl|Boolean}
   */
  get (name) {
    for (let control of this.controls) {
      if (name === control.name) return control;
    }
    return false;
  }

  /**
   * Retrieves a control's value from the collection.
   * 
   * Returns `undefined` if no control is found.
   * 
   * @param {String} name 
   *     Control `name` attribute 
   * @returns {*|Boolean}
   */
  getValue (name) {
    let ctrl = this.get(name);
    return (ctrl && ctrl !== false) ? ctrl.value : undefined;
  }

  /**
   * Defines/updates/changes a control in the collection, just provide a valid 
   * `Ctrl` instance and the method does the merging/overriding or setting.
   * 
   * @param {Ctrl} control 
   *     Control instance to add/update 
   * @returns {CtrlCollection}
   */
  set (control) {
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
   * Sets the value only for a single control.
   * 
   * @param {String} name 
   *     Name of the control 
   * @param {*} value 
   *     Value to be set 
   * @returns {CtrlCollection}
   */
  setValue (name, value) {
    let ctrl = this.get(name);

    if (ctrl && ctrl !== false) {
      ctrl.value = value;
      this.set(ctrl);
    } else {
      console.exception(
        `Control with the name '${name}' not found on this collection.`
      );
    }

    return this;
  }

  /**
   * Removes a control from the collection.
   * 
   * @param {String} name 
   *     Control name 
   * @return {CtrlCollection}
   */
  remove (name) {
    for (let i in this.controls) {
      if (name === this.controls[i].name) {
        this.controls.splice(i, 1);
      }
    }

    return this;
  }

  /**
   * Validates this control collection.
   * 
   * @returns {Boolean}
   */
  validate () {
    let _valid = true;

    for (let i in this.controls) {
      _valid = this.controls[i].validate() && _valid;
    }

    return _valid;
  }

  /**
   * 
   * @param {String} name 
   *     Control name to invalidate  
   * @param {String} message 
   *     Message to be set as error message 
   * @returns {CtrlCollection}
   */
  invalidate (name, message) {
    let ctrl = this.get(name);
    if (ctrl && ctrl !== false) ctrl.invalidate(message);
    return this;
  }

  /**
   * Invalidates ALL controls in this collection.
   * 
   * USE WITH CARE!
   * 
   * @returns {CtrlCollection}
   */
  invalidateAll () {
    for (let i in this.controls) {
      this.controls[i].invalidate();
    }

    return this;
  }

  /**
   * Overrides the default `toString()` method.
   * 
   * @returns {String}
   */
  toString () {
    return "[object CtrlCollection]";
  }

  /**
   * `toJSON()` alias, for compatibility.
   * 
   * @returns {Object}
   */
  toObject () {
    return this.toJSON();
  }

  /**
   * Overrides the default `toJSON()` method, returns a single object with 
   * key/value pairs of the collection's names and values.
   * 
   * @returns {Object}
   */
  toJSON () {
    let _object = {};

    for (let ctrl of this.controls) {
      _object[ctrl.name] = ctrl.value;
    }

    return _object;
  }
}
