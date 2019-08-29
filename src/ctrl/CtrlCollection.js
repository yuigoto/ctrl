import { Ctrl } from "./Ctrl";

/**
 * Ctrl/CtrlCollection
 * ----------------------------------------------------------------------
 * Provides an easy way to manage groups of `Ctrl` instances for forms or
 * other uses.
 *
 * @since 0.0.1
 */
export class CtrlCollection extends Array {
  // Public Properties
  // --------------------------------------------------------------------

  /**
   * Optional name for the collection, you can use this property to add
   * sub-collections to a collection, to group inputs.
   *
   * @type {String}
   */
  name;

  // Lifecycle
  // --------------------------------------------------------------------

  /**
   * Class constructor.
   *
   * @param {String} name
   *     Optional name for the collection
   */
  constructor (name = null) {
    super();

    this.name = name || null;
  }

  // Public Methods
  // --------------------------------------------------------------------

  /**
   * Adds a `Ctrl` instance to the collection or creates one if an object with
   * the proper arguments is provided.
   *
   * @param {Ctrl|CtrlCollection|Array|Object} controlArgs
   *     `Ctrl` instance or object with props for creating one
   * @return {CtrlCollection}
   */
  add (controlArgs) {
    if (!controlArgs) {
      console.error(
        "Please provide a valid `Ctrl` instance or arguments to create one."
      );
    }

    if (controlArgs instanceof Ctrl || controlArgs instanceof CtrlCollection) {
      this.push(controlArgs);
    } else if (Array.isArray(controlArgs)) {
      let tempCollection = new CtrlCollection();

      for (let i = 0; i < controlArgs.length; i++) {
        tempCollection.add(controlArgs[i]);
      }

      this.push(tempCollection);
    } else if (
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
      this.push(
        new Ctrl(controlArgs)
      );
    }

    return this;
  }

  /**
   * Retrieves a control from the collection or a sub-collection.
   *
   * Returns `false` if no control is found.
   *
   * @param {String} name
   *     Control `name` attribute
   * @param {String} subCollection
   *     Sub-collection name, where the control with `name` was declared
   * @returns {Ctrl|Boolean}
   */
  get (name, subCollection = null) {
    for (let i = 0; i < this.length; i++) {
      let current = this[i];

      if (subCollection) {
        if (
          subCollection === current.name
          && subCollection instanceof CtrlCollection
        ) {
          return current.get(name);
        }
      } else {
        if (name === current.name) return current;
      }
    }

    return false;
  }

  /**
   * Retrieves a control's value from the collection or one a sub-collection.
   *
   * Returns `undefined` if no control is found or if the value with `name` is
   * a sub-collection.
   *
   * @param {String} name
   *     Control `name` attribute
   * @param {String} subCollection
   *     Sub-collection name, where the control with `name` was declared
   * @returns {*|Boolean}
   */
  getValue (name, subCollection = null) {
    let ctrl = this.get(name, subCollection);

    if (ctrl instanceof CtrlCollection) return undefined;

    return (ctrl && ctrl !== false) ? ctrl.value : undefined;
  }

  /**
   * Defines/updates/changes a control in the collection, just provide a valid
   * `Ctrl` instance and the method does the merging/overriding or setting.
   *
   * @param {Ctrl} control
   *     Control instance to add/update
   * @param {String} subCollection
   *     Subcollection name, where `control` was/should be declared
   * @returns {CtrlCollection}
   */
  set (control, subCollection = null) {
    for (let i = 0; i < this.length; i++) {
      if (subCollection) {
        if (
          subCollection === this[i].name
          && this[i] instanceof CtrlCollection
        ) {
          this[i].set(control);
          return this;
        }
      } else {
        if (control.name === this[i].name) {
          this[i] = control;
          return this;
        }
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
   * @param {String} subCollection
   *     Sub-collection name, where control was declared
   * @returns {CtrlCollection}
   */
  setValue (name, value, subCollection = null) {
    let ctrl = this.get(name, subCollection);

    if (ctrl && ctrl !== false) {
      ctrl.value = value;
      this.set(ctrl, subCollection);
    } else {
      console.exception(
        `Control with the name '${name}' not found on this collection or any sub-collection.`
      );
    }

    return this;
  }

  /**
   * Removes a control from the collection.
   *
   * @param {String} name
   *     Control name
   * @param {String} subCollection
   *     Sub-collection name, where control was declared
   * @return {CtrlCollection}
   */
  remove (name, subCollection = null) {
    for (let i = 0; i < this.length; i++) {
      if (subCollection) {
        if (
          subCollection === this[i].name
          && subCollection instanceof CtrlCollection
        ) {
          this[i].remove(name);
        }
      } else {
        if (name === this[i].name) {
          this.splice(i, 1);
        }
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

    for (let i = 0; i < this.length; i++) {
      _valid = this[i].validate() && _valid;
    }

    return _valid;
  }

  /**
   * Forces invalidation for a single control.
   *
   * @param {String} name
   *     Control name to invalidate
   * @param {String} message
   *     Message to be set as error message
   * @param {String} subCollection
   *     Sub-collection name, where control was declared
   * @returns {CtrlCollection}
   */
  invalidate (name, message, subCollection = null) {
    let ctrl = this.get(name, subCollection);
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
    for (let i = 0; i < this.length; i++) {
      if (
        this[i] instanceof CtrlCollection
      ) {
        this[i].invalidateAll();
      } else {
        this[i].invalidate();
      }
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
   * @param {Boolean} useAltName
   *     If `altName` should be used to set the control's name, instead of `name`
   * @returns {Object}
   */
  toObject (useAltName = false) {
    return this.toJSON(useAltName);
  }

  /**
   * Overrides the default `toJSON()` method, returns a single object with
   * key/value pairs of the collection's names and values.
   *
   * @param {Boolean} useAltName
   *     If `altName` should be used to set the control's name, instead of `name`
   * @returns {Object}
   */
  toJSON (useAltName = false) {
    let _object = {};

    for (let c = 0; c < this.length; c++) {
      if (
        this[c] instanceof CtrlCollection
      ) {
        if (this[c].name) {
          _object[this[c].name] = this[c].toJSON(useAltName);
        } else {
          let tempObject = this[c].toJSON();

          for (let k in tempObject) {
            _object[c] = tempObject[c];
          }
        }
      } else {
        if (useAltName && this[c].altName !== null) {
          _object[this[c].altName] = this[c].value;
        } else {
          _object[this[c].name] = this[c].value;
        }
      }
    }

    return _object;
  }
}
