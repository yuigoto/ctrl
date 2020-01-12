"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var Ctrl_1 = require("./Ctrl");
var Utils_1 = require("../core/Utils");
var CtrlCollection = (function (_super) {
    __extends(CtrlCollection, _super);
    function CtrlCollection(name) {
        if (name === void 0) { name = null; }
        var _this = _super.call(this) || this;
        _this.name = name || null;
        return _this;
    }
    CtrlCollection.prototype.add = function (controlArgs) {
        try {
            if (!controlArgs) {
                throw new TypeError("Please provide a valid `Ctrl`, `CtrlCollection` or parameters to create a control.");
            }
            if (controlArgs instanceof Ctrl_1.Ctrl || controlArgs instanceof CtrlCollection) {
                this.push(controlArgs);
            }
            else if (Array.isArray(controlArgs)) {
                var tempCollection = new CtrlCollection();
                for (var i = 0; i < controlArgs.length; i++) {
                    tempCollection.add(controlArgs[i]);
                }
                this.push(tempCollection);
            }
            else if (!Utils_1.ValidateCtrlProps(controlArgs)) {
                throw new TypeError("You must provide at least a `name` attribute to a `Ctrl`.");
            }
            else {
                this.push(new Ctrl_1.Ctrl(controlArgs));
            }
            return this;
        }
        catch (e) {
            console.error(e);
            return null;
        }
    };
    CtrlCollection.prototype.get = function (name, subCollection) {
        if (subCollection === void 0) { subCollection = null; }
        for (var i = 0; i < this.length; i++) {
            var current = this[i];
            if (subCollection !== null && subCollection !== "") {
                if (subCollection === current.name
                    && current instanceof CtrlCollection) {
                    return current.get(name);
                }
            }
            else {
                if (current instanceof CtrlCollection) {
                    var item = current.get(name);
                    if (item !== false)
                        return item;
                }
                if (name === current.name) {
                    return current;
                }
            }
        }
        return false;
    };
    CtrlCollection.prototype.getValue = function (name, subCollection) {
        if (subCollection === void 0) { subCollection = null; }
        var ctrl = this.get(name, subCollection);
        if (ctrl instanceof CtrlCollection)
            return undefined;
        if (ctrl instanceof Ctrl_1.Ctrl)
            return ctrl.value;
        return undefined;
    };
    CtrlCollection.prototype.set = function (control, subCollection) {
        if (subCollection === void 0) { subCollection = null; }
        for (var i = 0; i < this.length; i++) {
            var current = this[i];
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
    };
    CtrlCollection.prototype.setValue = function (name, value, subCollection) {
        if (subCollection === void 0) { subCollection = null; }
        var ctrl = this.get(name, subCollection);
        try {
            if (ctrl instanceof Ctrl_1.Ctrl) {
                ctrl.value = value;
                this.set(ctrl, subCollection);
            }
            else {
                throw new TypeError("Control with the name '" + name + "' not found.");
            }
        }
        catch (e) {
            console.error(e);
        }
        return this;
    };
    CtrlCollection.prototype.remove = function (name, subCollection) {
        if (subCollection === void 0) { subCollection = null; }
        for (var i = 0; i < this.length; i++) {
            var current = this[i];
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
    };
    CtrlCollection.prototype.validate = function () {
        var status = true;
        for (var i = 0; i < this.length; i++) {
            status = this[i].validate() && status;
        }
        return status;
    };
    CtrlCollection.prototype.invalidate = function (name, message, subCollection) {
        if (subCollection === void 0) { subCollection = null; }
        var ctrl = this.get(name, subCollection);
        if (ctrl instanceof Ctrl_1.Ctrl)
            ctrl.invalidate(message);
        return this;
    };
    CtrlCollection.prototype.invalidateAll = function () {
        for (var i = 0; i < this.length; i++) {
            if (this[i] instanceof CtrlCollection) {
                this[i].invalidateAll();
            }
            else {
                this[i].invalidate();
            }
        }
        return this;
    };
    CtrlCollection.prototype.toObject = function (useAlias) {
        if (useAlias === void 0) { useAlias = false; }
        return this.toJSON(useAlias);
    };
    CtrlCollection.prototype.toJSON = function (useAlias) {
        if (useAlias === void 0) { useAlias = false; }
        var returnable = {};
        for (var c = 0; c < this.length; c++) {
            var current = this[c];
            if (current instanceof CtrlCollection) {
                if (current.name) {
                    returnable[current.name] = current.toJSON(useAlias);
                }
                else {
                    var tempObject = current.toJSON(useAlias);
                    for (var key in tempObject) {
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
    };
    CtrlCollection.prototype.toString = function () {
        return "[object CtrlCollection]";
    };
    return CtrlCollection;
}(Array));
exports.CtrlCollection = CtrlCollection;
