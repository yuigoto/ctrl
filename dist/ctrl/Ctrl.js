"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var validators_1 = require("@yuigoto/validators");
var Utils_1 = require("../core/Utils");
var Enum_1 = require("../core/Enum");
var Ctrl = (function () {
    function Ctrl(props) {
        var _this = this;
        try {
            props = Utils_1.MapDefaultCtrlProps(props);
            if (!props.name) {
                throw new TypeError("You must provide at least a `name` atribute to a `Ctrl` instance.");
            }
            else {
                Object.keys(props).map(function (key) {
                    _this[key] = props[key];
                });
                this.value = this.applyInterceptors(this.value);
            }
        }
        catch (e) {
            console.error(e);
        }
    }
    Object.defineProperty(Ctrl.prototype, "interceptor", {
        get: function () {
            return this.interceptors;
        },
        set: function (value) {
            this.interceptors = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Ctrl.prototype, "value", {
        get: function () {
            return this._value;
        },
        set: function (value) {
            switch (this.type) {
                case Enum_1.CtrlType.CEP:
                    value = validators_1.Cep.filter(value);
                    break;
                case Enum_1.CtrlType.PHONE:
                    value = validators_1.Phone.filter(value);
                    break;
                case Enum_1.CtrlType.CPF:
                    value = validators_1.Cpf.filter(value);
                    break;
                case Enum_1.CtrlType.CNPJ:
                    value = validators_1.Cnpj.filter(value);
                    break;
                case Enum_1.CtrlType.PIS:
                    value = validators_1.Pis.filter(value);
                    break;
                case Enum_1.CtrlType.DATE:
                    value = validators_1.DateString.filter(value);
                    break;
            }
            this._value = value;
        },
        enumerable: true,
        configurable: true
    });
    Ctrl.prototype.applyInterceptors = function (value) {
        var interceptors = this.interceptors;
        if (interceptors && interceptors !== null && interceptors !== undefined) {
            try {
                if (Array.isArray(interceptors)) {
                    for (var _i = 0, interceptors_1 = interceptors; _i < interceptors_1.length; _i++) {
                        var currentInterceptor = interceptors_1[_i];
                        value = currentInterceptor(value);
                    }
                }
                else {
                    value = interceptors(value);
                }
            }
            catch (e) {
                console.error(e, interceptors);
            }
        }
        return value;
    };
    Ctrl.prototype.getType = function () {
        switch (this.type) {
            case Enum_1.CtrlType.SINGLE_OPTION:
            case Enum_1.CtrlType.RADIO_GROUP:
                return "radio";
            case Enum_1.CtrlType.MULTIPLE_OPTION:
            case Enum_1.CtrlType.CHECKBOX_GROUP:
            case Enum_1.CtrlType.BOOLEAN:
                return "checkbox";
            case Enum_1.CtrlType.DROPDOWN:
                return "select";
            case Enum_1.CtrlType.TEXTAREA:
                return "textarea";
            case Enum_1.CtrlType.CNPJ:
            case Enum_1.CtrlType.CPF:
            case Enum_1.CtrlType.PIS:
            case Enum_1.CtrlType.CREDIT_CARD:
            case Enum_1.CtrlType.PHONE:
            case Enum_1.CtrlType.CEP:
                return "tel";
            case Enum_1.CtrlType.PASSWORD:
                return "password";
            case Enum_1.CtrlType.EMAIL:
                return "email";
            case Enum_1.CtrlType.DATE:
            default:
                return "text";
        }
    };
    Ctrl.prototype.invalidate = function (message) {
        if (message === void 0) { message = ""; }
        this.state = Enum_1.CtrlStates.ERROR;
        this.message = message || "Invalid input value provided";
        return this;
    };
    Ctrl.prototype.isValueSelected = function (option) {
        var value = this.value;
        return (value
            && Array.isArray(value)
            && value.indexOf(option) >= 0);
    };
    Ctrl.prototype.onBooleanChange = function (value) {
        this.value = !value;
        this.resetState();
        if (this.onChange)
            this.onChange(null, value);
    };
    Ctrl.prototype.onValueChange = function (value) {
        this.value = this.applyInterceptors(value);
        this.resetState();
        if (this.onChange)
            this.onChange(null, value);
    };
    Ctrl.prototype.onValueToggle = function (value) {
        value = this.applyInterceptors(value);
        var valuesArray = this.value;
        if (!valuesArray || !(valuesArray instanceof Array)) {
            valuesArray = [];
            valuesArray.push(value);
        }
        else {
            var _idx = valuesArray.indexOf(value);
        }
    };
    Ctrl.prototype.toJSON = function () {
        return {
            name: this.name,
            alias: this.alias,
            info: this.info,
            description: this.description,
            label: this.label,
            autocomplete: this.autocomplete,
            value: this.value,
            disabled: this.disabled,
            options: this.options,
            state: this.state,
            placeholder: this.placeholder,
            type: this.type,
            custom: this.custom,
            customClass: this.customClass,
            wrapClass: this.wrapClass,
            required: this.required,
            maxLength: this.maxLength,
            minLength: this.minLength,
            maxAnswers: this.maxAnswers,
            minAnswers: this.minAnswers,
            regex: (this.regex instanceof RegExp) ? this.regex.toString() : null,
            cols: this.cols,
            rows: this.rows
        };
    };
    Ctrl.prototype.toString = function () {
        return "[object Ctrl]";
    };
    Ctrl.prototype.validate = function () {
        this.resetState();
        return (this.validateRequired()
            && this.validateMinLength()
            && this.validateMaxLength()
            && this.validateMinAnswers()
            && this.validateMaxAnswers()
            && this.validateRegex()
            && this.validateDate()
            && this.validateEmail()
            && this.validateUrl()
            && this.validateCnpj()
            && this.validateCpf()
            && this.validatePis()
            && this.validateCreditCard());
    };
    Ctrl.prototype.resetState = function (clean) {
        if (clean === void 0) { clean = false; }
        this.message = "";
        this.state = Enum_1.CtrlStates.NORMAL;
        if (clean === true)
            this.dirty = false;
    };
    Ctrl.prototype.validateRequired = function () {
        var _a = this, value = _a.value, required = _a.required, requiredMessage = _a.requiredMessage;
        if (required
            && (!value
                || value === ""
                || value && Array.isArray(value) && !value.length)) {
            this.message = requiredMessage;
            this.state = Enum_1.CtrlStates.ERROR;
            return false;
        }
        return true;
    };
    Ctrl.prototype.validateMinLength = function () {
        var _a = this, value = _a.value, minLength = _a.minLength, minLengthMessage = _a.minLengthMessage;
        if (this.type === Enum_1.CtrlType.CNPJ
            || this.type === Enum_1.CtrlType.CPF
            || this.type === Enum_1.CtrlType.PIS
            || this.type === Enum_1.CtrlType.CREDIT_CARD
            || this.type === Enum_1.CtrlType.PHONE
            || this.type === Enum_1.CtrlType.DATE) {
            value = Utils_1.ToNumericString(value);
        }
        if (minLength
            && minLength > 1
            && value
            && value.length < minLength) {
            this.message = minLengthMessage;
            this.state = Enum_1.CtrlStates.ERROR;
            return false;
        }
        return true;
    };
    Ctrl.prototype.validateMaxLength = function () {
        var _a = this, value = _a.value, maxLength = _a.maxLength, maxLengthMessage = _a.maxLengthMessage;
        if (this.type === Enum_1.CtrlType.CNPJ
            || this.type === Enum_1.CtrlType.CPF
            || this.type === Enum_1.CtrlType.PIS
            || this.type === Enum_1.CtrlType.CREDIT_CARD
            || this.type === Enum_1.CtrlType.PHONE
            || this.type === Enum_1.CtrlType.DATE) {
            value = Utils_1.ToNumericString(value);
        }
        if (maxLength
            && maxLength > 1
            && value
            && value.length > maxLength) {
            this.message = maxLengthMessage;
            this.state = Enum_1.CtrlStates.ERROR;
            return false;
        }
        return true;
    };
    Ctrl.prototype.validateMinAnswers = function () {
        var _a = this, value = _a.value, minAnswers = _a.minAnswers, minAnswersMessage = _a.minAnswersMessage;
        if (minAnswers
            && minAnswers > 1
            && Array.isArray(value)
            && value.length < minAnswers) {
            this.message = minAnswersMessage;
            this.state = Enum_1.CtrlStates.ERROR;
            return false;
        }
        return true;
    };
    Ctrl.prototype.validateMaxAnswers = function () {
        var _a = this, value = _a.value, maxAnswers = _a.maxAnswers, maxAnswersMessage = _a.maxAnswersMessage;
        if (maxAnswers
            && maxAnswers > 1
            && Array.isArray(value)
            && value.length > maxAnswers) {
            this.message = maxAnswersMessage;
            this.state = Enum_1.CtrlStates.ERROR;
            return false;
        }
        return true;
    };
    Ctrl.prototype.validateRegex = function () {
        var _a = this, value = _a.value, regex = _a.regex, regexMessage = _a.regexMessage;
        if (regex
            && value
            && !regex.test(value)) {
            this.message = regexMessage;
            this.state = Enum_1.CtrlStates.ERROR;
            return false;
        }
        return true;
    };
    Ctrl.prototype.validateDate = function () {
        var _a = this, type = _a.type, value = _a.value, dateMessage = _a.dateMessage;
        if (type === Enum_1.CtrlType.DATE
            && value
            && !validators_1.DateString.validate(value)) {
            this.message = dateMessage;
            this.state = Enum_1.CtrlStates.ERROR;
            return false;
        }
        return true;
    };
    Ctrl.prototype.validateEmail = function () {
        var _a = this, type = _a.type, value = _a.value, emailMessage = _a.emailMessage;
        if (type === Enum_1.CtrlType.EMAIL
            && value
            && !validators_1.Email.validate(value)) {
            this.message = emailMessage;
            this.state = Enum_1.CtrlStates.ERROR;
            return false;
        }
        return true;
    };
    Ctrl.prototype.validateUrl = function () {
        var _a = this, type = _a.type, value = _a.value, urlMessage = _a.urlMessage;
        if (type === Enum_1.CtrlType.URL
            && value
            && !validators_1.Url.validate(value)) {
            this.message = urlMessage;
            this.state = Enum_1.CtrlStates.ERROR;
            return false;
        }
        return true;
    };
    Ctrl.prototype.validateCnpj = function () {
        var _a = this, type = _a.type, value = _a.value, cnpjMessage = _a.cnpjMessage;
        if (type === Enum_1.CtrlType.CNPJ
            && value
            && !validators_1.Cnpj.validate(value)) {
            this.message = cnpjMessage;
            this.state = Enum_1.CtrlStates.ERROR;
            return false;
        }
        return true;
    };
    Ctrl.prototype.validateCpf = function () {
        var _a = this, type = _a.type, value = _a.value, cpfMessage = _a.cpfMessage;
        if (type === Enum_1.CtrlType.CPF
            && value
            && !validators_1.Cpf.validate(value)) {
            this.message = cpfMessage;
            this.state = Enum_1.CtrlStates.ERROR;
            return false;
        }
        return true;
    };
    Ctrl.prototype.validatePis = function () {
        var _a = this, type = _a.type, value = _a.value, pisMessage = _a.pisMessage;
        if (type === Enum_1.CtrlType.PIS
            && value
            && !validators_1.Pis.validate(value)) {
            this.message = pisMessage;
            this.state = Enum_1.CtrlStates.ERROR;
            return false;
        }
        return true;
    };
    Ctrl.prototype.validateCreditCard = function () {
        var _a = this, type = _a.type, value = _a.value, creditCardMessage = _a.creditCardMessage;
        if (type === Enum_1.CtrlType.CREDIT_CARD
            && value
            && (!validators_1.CreditCard.validateDigit(value)
                || !validators_1.CreditCard.validateModulo(value))) {
            this.message = creditCardMessage;
            this.state = Enum_1.CtrlStates.ERROR;
            return false;
        }
        return true;
    };
    return Ctrl;
}());
exports.Ctrl = Ctrl;
