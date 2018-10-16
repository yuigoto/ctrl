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
export default [
  // Single Line
  {
    required: true,
    name: "name",
    label: "Single Line Field",
    type: "text",
    placeholder: "Type your name..."
  },
  // Single Line (E-Mail)
  {
    required: true,
    name: "email",
    label: "E-Mail",
    type: "email",
    placeholder: "mail@mail.com"
  },
  // Single Line (Cpf)
  {
    required: true,
    name: "cpf",
    label: "CPF",
    type: "cpf",
    placeholder: "XXX.XXX.XXX-XX"
  },
  // Single Line (Cnpj)
  {
    required: true,
    name: "cnpj",
    label: "CNPJ",
    type: "cnpj",
    placeholder: "XX.XXX.XXX/XXXX-XX"
  },
  // Single Line (Pis)
  {
    required: true,
    name: "pis",
    label: "PIS/PASEP",
    type: "pis",
    placeholder: "XX.XXXXX.XXX-X"
  },
  // Textarea
  {
    required: true,
    name: "message",
    label: "Textarea",
    type: "textarea",
    placeholder: "Write your story...",
    cols: 30,
    rows: 8
  },
  // Radio Buttons
  {
    required: true,
    name: "radio_default",
    label: "Options",
    type: "radio_group",
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
    type: "radio_group",
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
    type: "checkbox_group",
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
    type: "checkbox_group",
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
    type: "boolean"
  },
  // Custom Boolean
  {
    name: "boolean_custom",
    label: "Boolean Input (Custom)",
    type: "boolean",
    custom: true
  },
  // Dropdown
  {
    name: "dropdown",
    label: "Dropdown Selector",
    type: "dropdown",
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
    type: "dropdown",
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
