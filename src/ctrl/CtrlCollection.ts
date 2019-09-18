import { Ctrl } from "./Ctrl";
import { CtrlPropsObject } from "./CtrlDataType";

/**
 * Ctrl/CtrlCollection
 * ----------------------------------------------------------------------
 * Provides an easy way to manage groups of `Ctrl` instances for forms or
 * other uses.
 *
 * @since 0.5.0
 */
export class CtrlCollection extends Array {
  // Public Properties
  // --------------------------------------------------------------------

  /**
   * Optional name for the collection, you can use this property to add
   * sub-collections to a collection, to group inputs.
   */
  public name: String;

  // Lifecycle
  // --------------------------------------------------------------------

  /**
   * CtrlCollection constructor.
   * 
   * @param name 
   *     Optional name for the collection
   */
  constructor (name:String = null) {
    super();
    this.name = name || null;
  }

  // Public Methods
  // --------------------------------------------------------------------

  /**
   * Adds a `Ctrl` instance to the collection or creates one if an object with
   * the proper arguments is provided.
   * 
   * @param controlArgs 
   *     `Ctrl` instance or object with props for creating one
   */
  public add (controlArgs: any): CtrlCollection|null {
    try {
      if (!controlArgs) {
        throw new TypeError(
          "Please provide a valid `Ctrl` instance or parameters to create one."
        );
      }

      if (controlArgs instanceof Ctrl || controlArgs instanceof CtrlCollection) {
        this.push(controlArgs);
      } else if (Array.isArray(controlArgs)) {
        let tempCollection: CtrlCollection = new CtrlCollection();

        for (let i: number = 0; i < controlArgs.length; i++) {
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
        throw new TypeError(
          "You must provide at least a `name` attribute to a `Ctrl` instance."
        );
      } else {
        this.push(
          new Ctrl(controlArgs)
        );
      }

      return this;
    } catch (e) {
      console.error(e);

      return null;
    }
  }

  /**
   * Retrieves a control from the collection or a sub-collection.
   *
   * Returns `false` if no control is found.
   *
   * @param name
   *     Control `name` attribute
   * @param subCollection
   *     Sub-collection name, where the control with `name` was declared
   */
  public get (name: String, subCollection: String = null): Ctrl|Boolean {
    for (let i: number = 0; i < this.length; i++) {
      let current: any = this[i];

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
   * @param name
   *     Control `name` attribute
   * @param subCollection
   *     Sub-collection name, where the control with `name` was declared
   */
  public getValue (name: String, subCollection: String = null): any|Boolean {
    let ctrl: Ctrl|Boolean = this.get(name, subCollection);
    if (ctrl instanceof CtrlCollection) return undefined;
    if (ctrl instanceof Ctrl) return ctrl.value;
    return undefined;
  }

  /**
   * Defines/updates/changes a control in the collection, just provide a valid
   * `Ctrl` instance and the method does the merging/overriding or setting.
   *
   * @param control
   *     Control instance to add/update
   * @param subCollection
   *     Subcollection name, where `control` was/should be declared
   */
  public set (control: Ctrl, subCollection: String = null): CtrlCollection {
    for (let i: number = 0; i < this.length; i++) {
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

    this.push(control);
    return this;
  }

  /**
   * Sets the value only for a single control.
   *
   * @param name
   *     Name of the control
   * @param value
   *     Value to be set
   * @param subCollection
   *     Sub-collection name, where control was declared
   */
  public setValue (
    name: String, 
    value: any, 
    subCollection: String = null
  ): CtrlCollection {
    let ctrl: Ctrl|Boolean = this.get(name, subCollection);

    if (ctrl instanceof Ctrl) {
      ctrl.value = value;
      this.set(ctrl, subCollection);
    } else {
      console.error(
        `Control with the name '${name}' not found on this collection or any sub-collection.`
      );
    }

    return this;
  }

  /**
   * Removes a control from the collection.
   *
   * @param name
   *     Control name
   * @param subCollection
   *     Sub-collection name, where control was declared
   */
  public remove (name: String, subCollection: String = null): CtrlCollection {
    for (let i: number = 0; i < this.length; i++) {
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
   */
  public validate (): Boolean {
    let _valid: Boolean = true;

    for (let i: number = 0; i < this.length; i++) {
      _valid = this[i].validate() && _valid;
    }

    return _valid;
  }

  /**
   * Forces invalidation for a single control.
   *
   * @param name
   *     Control name to invalidate
   * @param message
   *     Message to be set as error message
   * @param subCollection
   *     Sub-collection name, where control was declared
   */
  public invalidate (
    name: String, 
    message: String, 
    subCollection: String = null
  ): CtrlCollection {
    let ctrl: Ctrl|Boolean = this.get(name, subCollection);
    if (ctrl instanceof Ctrl) ctrl.invalidate(message);
    return this;
  }

  /**
   * Invalidates ALL controls in this collection.
   *
   * USE WITH CARE!
   */
  public invalidateAll (): CtrlCollection {
    for (let i: number = 0; i < this.length; i++) {
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
   */
  public toString (): string {
    return "[object CtrlCollection]";
  }

  /**
   * `toJSON()` alias, for compatibility.
   *
   * @param useAltName
   *     If `altName` should be used to set the control's name, instead of `name`
   */
  public toObject (useAltName: Boolean = false): Object {
    return this.toJSON(useAltName);
  }

  /**
   * Overrides the default `toJSON()` method, returns a single object with
   * key/value pairs of the collection's names and values.
   *
   * @param useAltName
   *     If `altName` should be used to set the control's name, instead of `name`
   */
  public toJSON (useAltName: Boolean = false): Object {
    let _object: Object = {};

    for (let c: number = 0; c < this.length; c++) {
      if (
        this[c] instanceof CtrlCollection
      ) {
        if (this[c].name) {
          _object[this[c].name] = this[c].toJSON(useAltName);
        } else {
          let tempObject: Object = this[c].toJSON();

          for (let k in tempObject) {
            _object[k] = tempObject[k];
          }
        }
      } else {
        if (useAltName && this[c].altName !== null && this[c].altName !== "") {
          _object[this[c].altName] = this[c].value;
        } else {
          _object[this[c].name] = this[c].value;
        }
      }
    }

    return _object;
  }
}
