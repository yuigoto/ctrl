import { CtrlType } from "../../src";

/**
 * ControlBlueprintObject
 * ----------------------------------------------------------------------
 * A POJO containing example data for the `Ctrl`/`CtrlCollection` components.
 *
 * Targeted towards the Bootstrap 4 renderer.
 *
 * @author    Fabio Y. Goto <lab@yuiti.com.br>
 * @since     0.0.1
 * @copyright (c) 2018 Fabio Y. Goto
 * @license   MIT
 */
export const CtrlBlueprints = [
  // Single Line
  {
    required: true,
    name: "name",
    altName: "nombre",
    label: "Single Line Field",
    type: CtrlType.DEFAULT,
    placeholder: "Type your name..."
  },
  // Single Line (Password)
  {
    required: true,
    name: "name",
    label: "Password",
    type: CtrlType.PASSWORD,
    placeholder: "********"
  },
  // Single Line (E-Mail)
  {
    required: true,
    name: "email",
    altName: "mailo",
    label: "E-Mail",
    type: CtrlType.EMAIL,
    placeholder: "mail@mail.com"
  },
  // Single Line (Cpf)
  {
    required: true,
    name: "cpf",
    label: "CPF",
    type: CtrlType.CPF,
    placeholder: "XXX.XXX.XXX-XX"
  },
  // Single Line (Cnpj)
  {
    required: true,
    name: "cnpj",
    label: "CNPJ",
    type: CtrlType.CNPJ,
    placeholder: "XX.XXX.XXX/XXXX-XX"
  },
  // Single Line (Pis)
  {
    required: true,
    name: "pis",
    label: "PIS/PASEP",
    type: CtrlType.PIS,
    placeholder: "XX.XXXXX.XXX-X"
  },
  // Single Line (URL)
  {
    required: true,
    name: "url",
    label: "URL",
    type: CtrlType.URL,
    placeholder: "http://..."
  },
  // Textarea
  {
    required: true,
    name: "message",
    label: "Textarea",
    type: CtrlType.TEXTAREA,
    placeholder: "Write your story...",
    cols: 30,
    rows: 8
  },
  // Radio Buttons
  {
    required: true,
    name: "radio_default",
    label: "Options",
    type: CtrlType.RADIO_GROUP,
    options: [
      {
        value: 1,
        name: "Default Radio"
      },
      {
        disabled: true,
        value: 2,
        name: "Default Radio (Disabled)"
      },
      {
        custom: true,
        value: 3,
        name: "Custom Default Radio"
      },
      {
        custom: true,
        disabled: true,
        value: 4,
        name: "Custom Default Radio (Disabled)"
      }
    ]
  },
  // Radio Buttons (Inline)
  {
    required: true,
    name: "radio_inline",
    label: "Options (Inline)",
    type: CtrlType.RADIO_GROUP,
    options: [
      {
        inline: true,
        value: 1,
        name: "Default Radio"
      },
      {
        inline: true,
        disabled: true,
        value: 2,
        name: "Default Radio (Disabled)"
      },
      {
        inline: true,
        custom: true,
        value: 3,
        name: "Custom Default Radio"
      },
      {
        inline: true,
        custom: true,
        disabled: true,
        value: 4,
        name: "Custom Default Radio (Disabled)"
      }
    ]
  },
  // Checkboxes
  {
    required: true,
    name: "checkbox_default",
    label: "Checkboxes",
    type: CtrlType.CHECKBOX_GROUP,
    options: [
      {
        value: 1,
        name: "Default Checkbox"
      },
      {
        disabled: true,
        value: 2,
        name: "Default Checkbox (Disabled)"
      },
      {
        custom: true,
        value: 3,
        name: "Custom Default Checkbox"
      },
      {
        custom: true,
        disabled: true,
        value: 4,
        name: "Custom Default Checkbox (Disabled)"
      }
    ]
  },
  // Checkboxes (Inline)
  {
    required: true,
    name: "checkbox_inline",
    label: "Checkboxes (Inline)",
    type: CtrlType.CHECKBOX_GROUP,
    options: [
      {
        inline: true,
        value: 1,
        name: "Default Checkbox"
      },
      {
        inline: true,
        disabled: true,
        value: 2,
        name: "Default Checkbox (Disabled)"
      },
      {
        inline: true,
        custom: true,
        value: 3,
        name: "Custom Default Checkbox"
      },
      {
        inline: true,
        custom: true,
        disabled: true,
        value: 4,
        name: "Custom Default Checkbox (Disabled)"
      }
    ]
  },
  // Boolean
  {
    name: "boolean",
    label: "Boolean Input",
    type: CtrlType.BOOLEAN
  },
  // Custom Boolean
  {
    name: "boolean_custom",
    label: "Boolean Input (Custom)",
    type: CtrlType.BOOLEAN,
    custom: true
  },
  // Dropdown
  {
    name: "dropdown",
    label: "Dropdown Selector",
    type: CtrlType.DROPDOWN,
    required: true,
    options: [
      {
        name: "Selecione",
        value: ""
      },
      {
        name: "Option 1",
        value: 1
      },
      {
        name: "Option 2",
        value: 2
      },
      {
        name: "Option 3",
        value: 3
      }
    ]
  },
  // Dropdown (Custom)
  {
    name: "dropdown_custom",
    label: "Dropdown Selector (Custom)",
    type: CtrlType.DROPDOWN,
    custom: true,
    required: true,
    options: [
      {
        name: "Selecione",
        value: ""
      },
      {
        name: "Option 1",
        value: 1
      },
      {
        name: "Option 2",
        value: 2
      },
      {
        name: "Option 3",
        value: 3
      }
    ]
  }
];
