import Ctrl from "./Ctrl";
import { CtrlProps } from "../core/Types";
import { ValidateCtrlProps } from "../core/Utils";
import { CtrlType } from "core/Enum";

/**
 * ctrl/CtrlCollection
 * ----------------------------------------------------------------------
 * Provides an easy way to manage groups of `Ctrl` instances for forms or
 * other uses.
 * 
 * Also supports nested collections, both named and anonymous.
 *
 * @author    Fabio Y. Goto <lab@yuiti.dev>
 * @since     0.5.0
 */
export default class CtrlCollection {
  // PRIVATE PROPERTIES
  // --------------------------------------------------------------------

  /**
   * Stores all controls and subcollections.
   */
  private __collection: any[];

  // PUBLIC PROPERTIES
  // --------------------------------------------------------------------
  
  /**
   * Optional name for the collection, you can use this property to add
   * sub-collections to a collection, to group inputs.
   */
  public name: string;
  
  /**
   * Optional string for a validation message.
   */
  public message: String;
  
  /**
   * Optional array to store required field names.
   */
  public required: String[];
  
  // LIFECYCLE
  // --------------------------------------------------------------------
  
  /**
   * Constructor.
   * 
   * @param name 
   *     Optional name for this collection
   */
  constructor (name: string = null) {
    this.name = name || null;
    this.message = null;
    this.required = [];
    this.__collection = [];
  }

  // GETTERS + SETTERS
  // --------------------------------------------------------------------

  /**
   * Optional name for the collection, you can use this property to add
   * sub-collections to a collection, to group inputs.
   */
  get collection (): any[] {
    return this.__collection;
  }

  set collection (value: any[]) {
    this.__collection = value;
  }
  
  // PUBLIC METHODS
  // --------------------------------------------------------------------
  
  /**
   * Use it to add a `Ctrl` or `CtrlCollection` instance to this collection.
   * 
   * You can also serve `CtrlProps` or an array of it, to create new controls.
   *  
   * @param controlArgs 
   *     `Ctrl`, `CtrlCollection`, a `CtrlProps` object or array to add
   */
  public add (
    controlArgs: Ctrl|CtrlCollection|CtrlProps|CtrlProps[]
  ): CtrlCollection|null {
    try {
      if (!controlArgs) {
        throw new TypeError(
          "Please provide a valid `Ctrl`, `CtrlCollection` or parameters to create a control."
        );  
      }
      
      if (controlArgs instanceof Ctrl || controlArgs instanceof CtrlCollection) {
        this.__collection.push(controlArgs);
      } else if (Array.isArray(controlArgs)) {
        let tempCollection: CtrlCollection = new CtrlCollection();
        
        for (let i: number = 0; i < controlArgs.length; i++) {
          tempCollection.add(controlArgs[i]);
        }
        
        this.__collection.push(tempCollection);
      } else if (!ValidateCtrlProps(controlArgs)) {
        throw new TypeError(
          "You must provide at least a `name` attribute to a `Ctrl`."
        );
      } else {
        this.__collection.push(new Ctrl(controlArgs));
      }
      
      return this;
    } catch (e) {
      console.error(e);
      
      return null;
    }
  }
  
  /**
   * Retrieves a `Ctrl` from this collection or any `CtrlCollection` stored.
   * 
   * If using named collections, it's advised to use the `subCollection` name 
   * to refine your search.
   * 
   * Returns `false` if no control is found.
   * 
   * @param name 
   *     Control name to search for 
   * @param subCollection 
   *     Sub-collection name, in case we're dealing with named `CtrlCollection` 
   *     stores in this collection
   */
  public get (
    name: string, 
    subCollection: string = null
  ): Ctrl|boolean {
    for (let i: number = 0; i < this.__collection.length; i++) {
      let current: Ctrl|CtrlCollection = this.__collection[i];
      
      if (subCollection !== null && subCollection !== "") {
        if (
          subCollection === current.name 
            && current instanceof CtrlCollection
        ) {
          return current.get(name);
        }
      } else {
        if (current instanceof CtrlCollection) {
          let item: Ctrl|CtrlCollection|boolean = current.get(name);
          if (item !== false) return item;
        }
        
        if (name === current.name) {
          return (current as Ctrl);
        }
      }
    }
    
    return false;
  }
  
  /**
   * Retrieves a control's `value` attribute from this collection or any 
   * sub-collection.
   * 
   * Returns `undefined` if no control is found or if `name` ends up returning 
   * a `CtrlCollection` object.
   * 
   * If using named collections, it's advised to use the `subCollection` name 
   * to refine your search.
   * 
   * @param name 
   *     Control name to search for 
   * @param subCollection 
   *     Sub-collection name, in case we're dealing with named `CtrlCollection` 
   *     stores in this collection
   */
  public getValue (name: string, subCollection: string = null): any|undefined {
    let ctrl: Ctrl|boolean = this.get(name, subCollection);
    if (ctrl instanceof CtrlCollection) return undefined;
    if (ctrl instanceof Ctrl) return ctrl.value;
    return undefined;
  }
  
  /**
   * Sets/updates/changes a control in this collection or any sub-collection.
   * 
   * If using named collections, it's advised to use the `subCollection` name 
   * to refine your search.
   * 
   * @param control 
   *     Control to be added/updated 
   * @param subCollection 
   *     Sub-collection name, in case we're dealing with named `CtrlCollection` 
   *     stores in this collection
   */
  public set (control: Ctrl, subCollection: string = null): CtrlCollection {
    for (let i: number = 0; i < this.__collection.length; i++) {
      let current: Ctrl|CtrlCollection = this.__collection[i];
      
      if (
        (typeof subCollection !== "boolean") 
          && subCollection !== null 
          && subCollection !== undefined 
          && subCollection !== ""
      ) {
        if (
          subCollection === current.name 
            && current instanceof CtrlCollection
        ) {
          // ADD TO NAMED COLLECTION
          this.__collection[i].set(control);
          return this;
        }
      } else {
        if (control.name === current.name) {
          // REPLACE
          this.__collection[i] = control;
          return this;
        } else if (current instanceof CtrlCollection) {
          // ADD TO UNNAMED COLLECTION
          this.__collection[i].set(control);
          return this;
        }
      }
    }
    
    this.__collection.push(control);
    return this;
  }
  
  /**
   * Sets the value for a single control on this collection or a sub-colleciton.
   * 
   * If using named collections, it's advised to use the `subCollection` name 
   * to refine your search.
   * 
   * @param name 
   *     Control name to update 
   * @param value 
   *     Value to be set
   * @param subCollection 
   *     Sub-collection name, in case we're dealing with named `CtrlCollection` 
   *     stores in this collection
   */
  public setValue (
    name: string,
    value: any,
    subCollection: string = null
  ): CtrlCollection {
    for (let i: number = 0; i < this.__collection.length; i++) {
      let current: Ctrl|CtrlCollection = this.__collection[i];
      
      if (
        (typeof subCollection !== "boolean") 
          && subCollection !== null 
          && subCollection !== undefined 
          && subCollection !== ""
      ) {
        if (
          subCollection === current.name 
            && current instanceof CtrlCollection
        ) {
          this.__collection[i].setValue(name, value);
          return this;
        }
      } else {
        if (name === current.name) {
          this.__collection[i].value = value;
        } else if (current instanceof CtrlCollection) {
          this.__collection[i].setValue(name, value);
        }
      }
    }
    
    return this;
  }
  
  /**
   * Removes a single control from this or any sub-collection.
   * 
   * If using named collections, it's advised to use the `subCollection` name 
   * to refine your search.
   * 
   * @param name 
   *     Control name 
   * @param subCollection 
   *     Sub-collection name, in case we're dealing with named `CtrlCollection` 
   *     stores in this collection
   */
  public remove (name: string, subCollection: string = null): CtrlCollection {
    for (let i: number = 0; i < this.__collection.length; i++) {
      let current: Ctrl|CtrlCollection = this.__collection[i];
      
      if (
        (typeof subCollection !== "boolean") 
          && subCollection !== null 
          && subCollection !== undefined 
          && subCollection !== ""
      ) {
        if (
          subCollection === current.name 
            && current instanceof CtrlCollection
        ) {
          this.__collection[i].remove(name);
        }
      } else {
        if (name === current.name) {
          this.__collection.splice(i, 1);
        } else if (current instanceof CtrlCollection) {
          this.__collection[i].remove(name);
        }
      }
    }
    
    return this;
  }
  
  /**
   * Validates this collection.
   */
  public validate (): boolean {
    let status: boolean = true,
        messages: String|String[] = [],
        required: String[] = [];
    
    for (let i: number = 0; i < this.__collection.length; i++) {
      let current = this.__collection[i],
          currentValidation = current.validate();
      
      if (!currentValidation) {
        if (current instanceof Ctrl) {
          if (current.type === CtrlType.HIDDEN) {
            messages.push(current.message);
          } else if (current.required) {
            required.push(`'${current.name}`);
          }
        } else if (current instanceof CtrlCollection) {
          if (current.message) {
            messages.push(current.message);
          }
          
          if (current.required.length > 0) {
            required = required.concat(current.required);
          }
        }
      }
      
      status = currentValidation && status;
    }
    
    this.message = (messages.length > 0) ? messages.join("\r\n") : null;
    this.required = required;
    
    return status;
  }
  
  /**
   * Force invalidation of a single control.
   * 
   * If using named collections, it's advised to use the `subCollection` name 
   * to refine your search.
   * 
   * @param name 
   *     Control to invalidate 
   * @param message 
   *     Invalidation message
   * @param subCollection 
   *     Sub-collection name, in case we're dealing with named `CtrlCollection` 
   *     stores in this collection
   */
  public invalidate (
    name: string, 
    message: string,
    subCollection: string = null
  ): CtrlCollection {
    let ctrl: Ctrl|Boolean = this.get(name, subCollection);
    if (ctrl instanceof Ctrl) ctrl.invalidate(message);
    return this;
  }
  
  /**
   * Forces invalidation for all controls in this collection.
   * 
   * IMPORTANT:
   * USE WITH CARE!
   */
  public invalidateAll (): CtrlCollection {
    for (let i: number = 0; i < this.__collection.length; i++) {
      if (this.__collection[i] instanceof CtrlCollection) {
        this.__collection[i].invalidateAll();
      } else {
        this.__collection[i].invalidate();
      }
    }
    return this;
  }
  
  /**
   * Alias for `toJSON()`.
   * 
   * @param useAlias 
   *     If you need to return the alias in place of the name for controls that 
   *     have it declared, set to `true`
   */
  public toObject (useAlias: boolean = false): object {
    return this.toJSON(useAlias);
  }
  
  /**
   * Returns a POJO representation of this class' object, this is called when
   * `JSON.stringify` is used on an instance of this class.
   * 
   * @param useAlias 
   *     If you need to return the alias in place of the name for controls that 
   *     have it declared, set to `true`
   */
  public toJSON (useAlias: boolean = false): object {
    let returnable: {[key: string]: any} = {};
    
    for (let c: number = 0; c < this.__collection.length; c++) {
      let current: Ctrl|CtrlCollection = this.__collection[c];
      
      if (current instanceof CtrlCollection) {
        if (current.name) {
          returnable[current.name] = current.toJSON(useAlias);
        } else {
          let tempObject: object = current.toJSON(useAlias);
          for (let key in tempObject) {
            returnable[key] = (tempObject as any)[key];
          }
        }
      } else {
        if (useAlias && current.alias !== null && current.alias !== "") {
          returnable[current.alias] = (current.toJSON() as any)["value"];
        } else {
          returnable[current.name] = (current.toJSON() as any)["value"];
        }
      }
    }
    
    return returnable;
  }

  /**
   * Returns a string representation of an object, overrides default method.
   */
  public toString (): string {
    return `[object CtrlCollection]`;
  }
  
  // PRIVATE METHODS
  // --------------------------------------------------------------------
}
