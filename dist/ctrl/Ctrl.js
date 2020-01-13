import { Cep, Phone, Email, Cpf, Cnpj, Pis, DateString, Url, CreditCard } from "@yuigoto/validators";
import { MapDefaultCtrlProps, ToNumericString } from "../core/Utils";
import { CtrlType, CtrlStates } from "../core/Enum";
export class Ctrl {
    constructor(props) {
        try {
            props = MapDefaultCtrlProps(props);
            if (!props.name) {
                throw new TypeError("You must provide at least a `name` atribute to a `Ctrl` instance.");
            }
            else {
                Object.keys(props).map((key) => {
                    this[key] = props[key];
                });
                this.value = this.applyInterceptors(this.value);
            }
        }
        catch (e) {
            console.error(e);
        }
    }
    get interceptor() {
        return this.interceptors;
    }
    set interceptor(value) {
        this.interceptors = value;
    }
    get value() {
        return this._value;
    }
    set value(value) {
        switch (this.type) {
            case CtrlType.CEP:
                value = Cep.filter(value);
                break;
            case CtrlType.PHONE:
                value = Phone.filter(value);
                break;
            case CtrlType.CPF:
                value = Cpf.filter(value);
                break;
            case CtrlType.CNPJ:
                value = Cnpj.filter(value);
                break;
            case CtrlType.PIS:
                value = Pis.filter(value);
                break;
            case CtrlType.DATE:
                value = DateString.filter(value);
                break;
        }
        this._value = value;
    }
    applyInterceptors(value) {
        const { interceptors } = this;
        if (interceptors && interceptors !== null && interceptors !== undefined) {
            try {
                if (Array.isArray(interceptors)) {
                    for (let currentInterceptor of interceptors) {
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
    }
    getType() {
        switch (this.type) {
            case CtrlType.SINGLE_OPTION:
            case CtrlType.RADIO_GROUP:
                return "radio";
            case CtrlType.MULTIPLE_OPTION:
            case CtrlType.CHECKBOX_GROUP:
            case CtrlType.BOOLEAN:
                return "checkbox";
            case CtrlType.DROPDOWN:
                return "select";
            case CtrlType.TEXTAREA:
                return "textarea";
            case CtrlType.CNPJ:
            case CtrlType.CPF:
            case CtrlType.PIS:
            case CtrlType.CREDIT_CARD:
            case CtrlType.PHONE:
            case CtrlType.CEP:
                return "tel";
            case CtrlType.PASSWORD:
                return "password";
            case CtrlType.EMAIL:
                return "email";
            case CtrlType.DATE:
            default:
                return "text";
        }
    }
    invalidate(message = "") {
        this.state = CtrlStates.ERROR;
        this.message = message || "Invalid input value provided";
        return this;
    }
    isValueSelected(option) {
        const { value } = this;
        return (value
            && Array.isArray(value)
            && value.indexOf(option) >= 0);
    }
    onBooleanChange(value) {
        this.value = !value;
        this.resetState();
        if (this.onChange)
            this.onChange(null, value);
    }
    onValueChange(value) {
        this.value = this.applyInterceptors(value);
        this.resetState();
        if (this.onChange)
            this.onChange(null, value);
    }
    onValueToggle(value) {
        value = this.applyInterceptors(value);
        let valuesArray = this.value;
        if (!valuesArray || !(valuesArray instanceof Array)) {
            valuesArray = [];
            valuesArray.push(value);
        }
        else {
            let _idx = valuesArray.indexOf(value);
        }
    }
    toJSON() {
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
    }
    toString() {
        return `[object Ctrl]`;
    }
    validate() {
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
    }
    resetState(clean = false) {
        this.message = "";
        this.state = CtrlStates.NORMAL;
        if (clean === true)
            this.dirty = false;
    }
    validateRequired() {
        const { value, required, requiredMessage } = this;
        if (required
            && (!value
                || value === ""
                || value && Array.isArray(value) && !value.length)) {
            this.message = requiredMessage;
            this.state = CtrlStates.ERROR;
            return false;
        }
        return true;
    }
    validateMinLength() {
        let { value, minLength, minLengthMessage } = this;
        if (this.type === CtrlType.CNPJ
            || this.type === CtrlType.CPF
            || this.type === CtrlType.PIS
            || this.type === CtrlType.CREDIT_CARD
            || this.type === CtrlType.PHONE
            || this.type === CtrlType.DATE) {
            value = ToNumericString(value);
        }
        if (minLength
            && minLength > 1
            && value
            && value.length < minLength) {
            this.message = minLengthMessage;
            this.state = CtrlStates.ERROR;
            return false;
        }
        return true;
    }
    validateMaxLength() {
        let { value, maxLength, maxLengthMessage } = this;
        if (this.type === CtrlType.CNPJ
            || this.type === CtrlType.CPF
            || this.type === CtrlType.PIS
            || this.type === CtrlType.CREDIT_CARD
            || this.type === CtrlType.PHONE
            || this.type === CtrlType.DATE) {
            value = ToNumericString(value);
        }
        if (maxLength
            && maxLength > 1
            && value
            && value.length > maxLength) {
            this.message = maxLengthMessage;
            this.state = CtrlStates.ERROR;
            return false;
        }
        return true;
    }
    validateMinAnswers() {
        const { value, minAnswers, minAnswersMessage } = this;
        if (minAnswers
            && minAnswers > 1
            && Array.isArray(value)
            && value.length < minAnswers) {
            this.message = minAnswersMessage;
            this.state = CtrlStates.ERROR;
            return false;
        }
        return true;
    }
    validateMaxAnswers() {
        const { value, maxAnswers, maxAnswersMessage } = this;
        if (maxAnswers
            && maxAnswers > 1
            && Array.isArray(value)
            && value.length > maxAnswers) {
            this.message = maxAnswersMessage;
            this.state = CtrlStates.ERROR;
            return false;
        }
        return true;
    }
    validateRegex() {
        const { value, regex, regexMessage } = this;
        if (regex
            && value
            && !regex.test(value)) {
            this.message = regexMessage;
            this.state = CtrlStates.ERROR;
            return false;
        }
        return true;
    }
    validateDate() {
        const { type, value, dateMessage } = this;
        if (type === CtrlType.DATE
            && value
            && !DateString.validate(value)) {
            this.message = dateMessage;
            this.state = CtrlStates.ERROR;
            return false;
        }
        return true;
    }
    validateEmail() {
        const { type, value, emailMessage } = this;
        if (type === CtrlType.EMAIL
            && value
            && !Email.validate(value)) {
            this.message = emailMessage;
            this.state = CtrlStates.ERROR;
            return false;
        }
        return true;
    }
    validateUrl() {
        const { type, value, urlMessage } = this;
        if (type === CtrlType.URL
            && value
            && !Url.validate(value)) {
            this.message = urlMessage;
            this.state = CtrlStates.ERROR;
            return false;
        }
        return true;
    }
    validateCnpj() {
        const { type, value, cnpjMessage } = this;
        if (type === CtrlType.CNPJ
            && value
            && !Cnpj.validate(value)) {
            this.message = cnpjMessage;
            this.state = CtrlStates.ERROR;
            return false;
        }
        return true;
    }
    validateCpf() {
        const { type, value, cpfMessage } = this;
        if (type === CtrlType.CPF
            && value
            && !Cpf.validate(value)) {
            this.message = cpfMessage;
            this.state = CtrlStates.ERROR;
            return false;
        }
        return true;
    }
    validatePis() {
        const { type, value, pisMessage } = this;
        if (type === CtrlType.PIS
            && value
            && !Pis.validate(value)) {
            this.message = pisMessage;
            this.state = CtrlStates.ERROR;
            return false;
        }
        return true;
    }
    validateCreditCard() {
        const { type, value, creditCardMessage } = this;
        if (type === CtrlType.CREDIT_CARD
            && value
            && (!CreditCard.validateDigit(value)
                || !CreditCard.validateModulo(value))) {
            this.message = creditCardMessage;
            this.state = CtrlStates.ERROR;
            return false;
        }
        return true;
    }
}
