export var CtrlStates;
(function (CtrlStates) {
    CtrlStates[CtrlStates["ERROR"] = -1] = "ERROR";
    CtrlStates[CtrlStates["NORMAL"] = 0] = "NORMAL";
    CtrlStates[CtrlStates["VALID"] = 1] = "VALID";
})(CtrlStates || (CtrlStates = {}));
export var CtrlType;
(function (CtrlType) {
    CtrlType[CtrlType["DEFAULT"] = 0] = "DEFAULT";
    CtrlType[CtrlType["SINGLE_OPTION"] = 1] = "SINGLE_OPTION";
    CtrlType[CtrlType["MULTIPLE_OPTION"] = 2] = "MULTIPLE_OPTION";
    CtrlType[CtrlType["DROPDOWN"] = 3] = "DROPDOWN";
    CtrlType[CtrlType["TEXTAREA"] = 4] = "TEXTAREA";
    CtrlType[CtrlType["BOOLEAN"] = 5] = "BOOLEAN";
    CtrlType[CtrlType["PASSWORD"] = 6] = "PASSWORD";
    CtrlType[CtrlType["DATE"] = 7] = "DATE";
    CtrlType[CtrlType["NUMBER"] = 8] = "NUMBER";
    CtrlType[CtrlType["CHECKBOX_GROUP"] = 11] = "CHECKBOX_GROUP";
    CtrlType[CtrlType["RADIO_GROUP"] = 12] = "RADIO_GROUP";
    CtrlType[CtrlType["CNPJ"] = 21] = "CNPJ";
    CtrlType[CtrlType["CPF"] = 22] = "CPF";
    CtrlType[CtrlType["PIS"] = 23] = "PIS";
    CtrlType[CtrlType["CREDIT_CARD"] = 31] = "CREDIT_CARD";
    CtrlType[CtrlType["EMAIL"] = 32] = "EMAIL";
    CtrlType[CtrlType["PHONE"] = 33] = "PHONE";
    CtrlType[CtrlType["URL"] = 34] = "URL";
    CtrlType[CtrlType["CEP"] = 35] = "CEP";
})(CtrlType || (CtrlType = {}));