import { CtrlStates, CtrlType } from "./Enum";
export const CreateEmptyProps = () => {
    return {
        name: "",
        alias: "",
        infoText: "",
        description: "",
        label: "",
        autocomplete: false,
        value: "",
        disabled: false,
        options: [],
        state: CtrlStates.NORMAL,
        dirty: false,
        placeholder: "",
        type: CtrlType.DEFAULT,
        custom: false,
        customClass: null,
        wrapClass: null,
        onChange: null,
        interceptors: null,
        message: "",
        required: false,
        requiredMessage: "",
        maxLength: null,
        maxLengthMessage: "",
        minLength: null,
        minLengthMessage: "",
        maxAnswers: null,
        maxAnswersMessage: "",
        minAnswers: null,
        minAnswersMessage: "",
        regex: null,
        regexMessage: "",
        dateMessage: "",
        cnpjMessage: "",
        cpfMessage: "",
        pisMessage: "",
        creditCardMessage: "",
        emailMessage: "",
        urlMessage: "",
        cols: null,
        rows: null
    };
};
export const MapDefaultCtrlProps = (props) => {
    let propsToMap = Object.assign({}, CreateEmptyProps(), props);
    if (propsToMap.required === true && propsToMap.requiredMessage.trim() === "") {
        propsToMap.requiredMessage = `This field is required.`;
    }
    if (propsToMap.maxLength && propsToMap.maxLengthMessage.trim() === "") {
        propsToMap.maxLengthMessage = `Max length accepted is "${propsToMap.maxLength}" characters.`;
    }
    if (propsToMap.minLength && propsToMap.minLengthMessage.trim() === "") {
        propsToMap.minLengthMessage = `Min length accepted is "${propsToMap.minLength}" characters.`;
    }
    if (propsToMap.maxAnswers && propsToMap.maxAnswersMessage.trim() === "") {
        propsToMap.maxAnswersMessage = `You can't choose more than "${propsToMap.maxAnswers}" options.`;
    }
    if (propsToMap.minAnswers && propsToMap.minAnswersMessage.trim() === "") {
        propsToMap.minAnswersMessage = `Please choose at least "${propsToMap.minAnswers}" options.`;
    }
    if (propsToMap.regex && propsToMap.regexMessage.trim() === "") {
        propsToMap.regexMessage = `The current value doesn't match the regular expression.`;
    }
    if (propsToMap.dateMessage.trim() === "") {
        propsToMap.dateMessage = "Invalid date value.";
    }
    if (propsToMap.cnpjMessage.trim() === "") {
        propsToMap.cnpjMessage = "Invalid CNPJ number.";
    }
    if (propsToMap.cpfMessage.trim() === "") {
        propsToMap.cpfMessage = "Invalid CPF number.";
    }
    if (propsToMap.pisMessage.trim() === "") {
        propsToMap.pisMessage = "Invalid PIS number.";
    }
    if (propsToMap.creditCardMessage.trim() === "") {
        propsToMap.creditCardMessage = "Invalid credit card number.";
    }
    if (propsToMap.emailMessage.trim() === "") {
        propsToMap.emailMessage = "Invalid email address provided.";
    }
    if (propsToMap.urlMessage.trim() === "") {
        propsToMap.urlMessage = "Invalid URL provided.";
    }
    switch (propsToMap.type) {
        case CtrlType.BOOLEAN:
            propsToMap.value = (propsToMap.value === true);
            break;
        case CtrlType.NUMBER:
            propsToMap.value = (typeof propsToMap.value === "string")
                ? propsToMap.value.replace(/([^\d\-().,]+)/g, "")
                : propsToMap.value;
            break;
        case CtrlType.DROPDOWN:
        case CtrlType.RADIO_GROUP:
        case CtrlType.CHECKBOX_GROUP:
        case CtrlType.SINGLE_OPTION:
        case CtrlType.MULTIPLE_OPTION:
            propsToMap.value = (Array.isArray(propsToMap.value))
                ? propsToMap.value
                : [];
            break;
        default:
            propsToMap.value = propsToMap.value || "";
            break;
    }
    return propsToMap;
};
export const ValidateCtrlProps = (props) => {
    if (!(typeof props === "object")
        || (typeof props === "object"
            && (!props.hasOwnProperty("name")
                || props.name === null
                || props.name === undefined
                || props.name === ""))) {
        return false;
    }
    return true;
};
export const ToNumericString = (value) => {
    if (typeof value !== "number" && typeof value !== "string")
        return "";
    value = (typeof value !== "number") ? value.trim() : value.toString();
    return value.replace(/[^\d]/g, "");
};