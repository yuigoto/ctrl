import { Ctrl } from "./Ctrl";
import { ValidateCtrlProps } from "../core/Utils";
export class CtrlCollection extends Array {
    constructor(name = null) {
        super();
        this.name = name || null;
    }
    add(controlArgs) {
        try {
            if (!controlArgs) {
                throw new TypeError("Please provide a valid `Ctrl`, `CtrlCollection` or parameters to create a control.");
            }
            if (controlArgs instanceof Ctrl || controlArgs instanceof CtrlCollection) {
                this.push(controlArgs);
            }
            else if (Array.isArray(controlArgs)) {
                let tempCollection = new CtrlCollection();
                for (let i = 0; i < controlArgs.length; i++) {
                    tempCollection.add(controlArgs[i]);
                }
                this.push(tempCollection);
            }
            else if (!ValidateCtrlProps(controlArgs)) {
                throw new TypeError("You must provide at least a `name` attribute to a `Ctrl`.");
            }
            else {
                console.log(controlArgs);
                this.push(new Ctrl(controlArgs));
            }
            return this;
        }
        catch (e) {
            console.error(e);
            return null;
        }
    }
    get(name, subCollection = null) {
        for (let i = 0; i < this.length; i++) {
            let current = this[i];
            if (subCollection !== null && subCollection !== "") {
                if (subCollection === current.name
                    && current instanceof CtrlCollection) {
                    return current.get(name);
                }
            }
            else {
                if (current instanceof CtrlCollection) {
                    let item = current.get(name);
                    if (item !== false)
                        return item;
                }
                if (name === current.name) {
                    return current;
                }
            }
        }
        return false;
    }
    getValue(name, subCollection = null) {
        let ctrl = this.get(name, subCollection);
        if (ctrl instanceof CtrlCollection)
            return undefined;
        if (ctrl instanceof Ctrl)
            return ctrl.value;
        return undefined;
    }
    set(control, subCollection = null) {
        for (let i = 0; i < this.length; i++) {
            let current = this[i];
            if ((typeof subCollection !== "boolean")
                && subCollection !== null
                && subCollection !== undefined
                && subCollection !== "") {
                if (subCollection === current.name
                    && current instanceof CtrlCollection) {
                    this[i].set(control);
                    return this;
                }
            }
            else {
                if (control.name === current.name) {
                    this[i] = control;
                    return this;
                }
                else if (current instanceof CtrlCollection) {
                    this[i].set(control);
                    return this;
                }
            }
        }
        this.push(control);
        return this;
    }
    setValue(name, value, subCollection = null) {
        for (let i = 0; i < this.length; i++) {
            let current = this[i];
            if ((typeof subCollection !== "boolean")
                && subCollection !== null
                && subCollection !== undefined
                && subCollection !== "") {
                if (subCollection === current.name
                    && current instanceof CtrlCollection) {
                    this[i].setValue(name, value);
                    return this;
                }
            }
            else {
                if (name === current.name) {
                    this[i].value = value;
                }
                else if (current instanceof CtrlCollection) {
                    this[i].setValue(name, value);
                }
            }
        }
        return this;
    }
    remove(name, subCollection = null) {
        for (let i = 0; i < this.length; i++) {
            let current = this[i];
            if ((typeof subCollection !== "boolean")
                && subCollection !== null
                && subCollection !== undefined
                && subCollection !== "") {
                if (subCollection === current.name
                    && current instanceof CtrlCollection) {
                    this[i].remove(name);
                }
            }
            else {
                if (name === current.name) {
                    this.splice(i, 1);
                }
                else if (current instanceof CtrlCollection) {
                    this[i].remove(name);
                }
            }
        }
        return this;
    }
    validate() {
        let status = true;
        for (let i = 0; i < this.length; i++) {
            status = this[i].validate() && status;
        }
        return status;
    }
    invalidate(name, message, subCollection = null) {
        let ctrl = this.get(name, subCollection);
        if (ctrl instanceof Ctrl)
            ctrl.invalidate(message);
        return this;
    }
    invalidateAll() {
        for (let i = 0; i < this.length; i++) {
            if (this[i] instanceof CtrlCollection) {
                this[i].invalidateAll();
            }
            else {
                this[i].invalidate();
            }
        }
        return this;
    }
    toObject(useAlias = false) {
        return this.toJSON(useAlias);
    }
    toJSON(useAlias = false) {
        let returnable = {};
        for (let c = 0; c < this.length; c++) {
            let current = this[c];
            if (current instanceof CtrlCollection) {
                if (current.name) {
                    returnable[current.name] = current.toJSON(useAlias);
                }
                else {
                    let tempObject = current.toJSON(useAlias);
                    for (let key in tempObject) {
                        returnable[key] = tempObject[key];
                    }
                }
            }
            else {
                if (useAlias && current.alias !== null && current.alias !== "") {
                    returnable[current.alias] = current.toJSON()["value"];
                }
                else {
                    returnable[current.name] = current.toJSON()["value"];
                }
            }
        }
        return returnable;
    }
    toString() {
        return `[object CtrlCollection]`;
    }
}
