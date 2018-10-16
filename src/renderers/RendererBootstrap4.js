// Dependencies
import React, { Component } from "react";
import PropTypes from "prop-types";
import classnames from "classnames";

// Local dependencies
import Ctrl from "../ctrl/Ctrl";
import CtrlCollection from "../ctrl/CtrlCollection";

/**
 *
 */
class RendererBootstrap4 extends Component {
  // Renderer Methods
  // ----------------------------------------------------------------------

  /**
   * Renders the current control.
   *
   * @private
   */
  _renderInput()
  {
    switch (this.props.control.type) {
      case "multiple_option":
      case "checkbox_group":
        return this._renderCheckboxOrRadioGroup(true);
      case "single_option":
      case "radio_group":
        return this._renderCheckboxOrRadioGroup();
      case "multiline_text":
      case "multiple_lines":
      case "textarea":
        return this._renderTextArea();
      case "dropdown":
        return this._renderDropdown();
      case "boolean":
        return this._renderBoolean();
      default:
        return this._renderTextInput();
    }
  }

  /**
   * Renders a drop-down selector (select box).
   *
   * @returns {*}
   * @private
   */
  _renderDropdown() {
    // Extractors
    const { props }   = this;
    const { control } = props;
    let { value } = control;

    // Classnames
    let _cls_input = ["form-control"];

    // Validation
    if (control.state === "error") _cls_input.push("is-invalid");
    if (control.state === "success") _cls_input.push("is-valid");
    if (control.custom && control.custom === true) {
      _cls_input.push("custom-select");
    }

    return (
      <select
        className={classnames(_cls_input)}
        onChange={
          e => control.onValueChange(e.target.value) || this.forceUpdate()
        }
        value={control.value || ""}>
        {control.options.map((option, index) => {
          return (
            <option
              value={option.value}
              key={index}>
              {option.label || option.name}
            </option>
          );
        })}
      </select>
    );
  }

  /**
   * Renders a single boolean (checkbox) input.
   *
   * @returns{*}
   * @private
   */
  _renderBoolean() {
    // Extractors
    const { props }   = this;
    const { control } = props;
    let { value } = control;

    let __id = control.name + "-" + (new Date()).toISOString();
    let _checked = (value === true);

    // Classnames
    let _cls_input, _cls_check, _cls_label;
    if (control.custom) {
      _cls_input = ["custom-control", "custom-checkbox"];
      _cls_check = ["custom-control-input"];
      _cls_label = ["custom-control-label"];
    } else {
      _cls_input = ["form-check"];
      _cls_check = ["form-check-input"];
      _cls_label = ["form-check-label"];
    }

    // Validation
    if (control.state === "error") _cls_check.push("is-invalid");

    return (
      <div className={classnames(_cls_input, control.custom_class)}>
        <input id={__id}
               className={classnames(_cls_check)}
               type={"checkbox"}
               name={control.name}
               defaultChecked={_checked}
               onClick={e => control.onBooleanChange(value)}
               aria-invalid={control.state === "error"}
               disabled={control.disabled}/>
        <label htmlFor={__id} className={classnames(_cls_label)}>
          {control.label}
        </label>
        {this._renderFeedback(true)}
      </div>
    );
  }

  /**
   * Renders a group of checkboxes (multiple option input) or radio buttons
   * (single option input).
   *
   * @param {boolean} is_checkbox
   * @returns {*}
   * @private
   */
  _renderCheckboxOrRadioGroup(is_checkbox = false) {
    // Extractors
    const { props }   = this;
    const { control } = props;
    let { options, value } = control;

    // Classnames
    let _cls_group = [];
    if (is_checkbox === true) {
      _cls_group.push("checkbox-group");
    } else {
      _cls_group.push("radio-group");
    }

    // Last option ID
    let _last_index = options.length - 1;

    return (
      options
      && (
        <div className={classnames(_cls_group)}>
          {options.map((option, index) => {
            let __id,
                __checked,
                __click,
                __type,
                _cls_input,
                _cls_check,
                _cls_label;

            // Item ID/Key
            __id = (is_checkbox === true)
              ? `${control.name}-checkbox-${index}`
              : `${control.name}-radio-${index}`;

            // Is it a custom bootstrap input?
            if (option.custom && option.custom === true) {
              // Input group class
              _cls_input = ["custom-control"];
              if (is_checkbox === true) {
                _cls_input.push("custom-checkbox");
              } else {
                _cls_input.push("custom-radio");
              }
              if (option.inline === true) _cls_input.push("custom-control-inline");

              // Input class
              _cls_check = ["custom-control-input"];

              // Label
              _cls_label = ["custom-control-label"];
            } else {
              // Input group class
              _cls_input = ["form-check"];
              if (option.inline === true) _cls_input.push("form-check-inline");

              // Input class
              _cls_check = ["form-check-input"];

              // Label
              _cls_label = ["form-check-label"];
            }

            // Validation
            if (control.state === "error") _cls_check.push("is-invalid");

            // Checked status and click callback
            if (is_checkbox) {
              __checked = (
                value.includes(option.value) || value.includes(option.name)
              );

              __click = () => (
                control.onValueToggle(option.value || option.name)
              );
            } else {
              __checked = option.value === value || option.name === value;

              __click = () => (
                control.onValueChange(option.value || option.name)
              );
            }

            // Set input type
            __type = (is_checkbox) ? "checkbox" : "radio";

            return (
              <div className={classnames(_cls_input, control.custom_class)}
                   key={__id}>
                <input
                  id={__id}
                  className={classnames(_cls_check)}
                  type={__type}
                  name={control.name}
                  defaultChecked={__checked}
                  onClick={__click}
                  aria-invalid={control.state === "error"}
                  disabled={option.disabled}/>
                <label htmlFor={__id} className={classnames(_cls_label)}>
                  {option.name}
                </label>
                {index === _last_index && this._renderFeedback(true)}
              </div>
            );
          })}
        </div>
      )
    );
  }

  /**
   * Renders a single textarea input type (multiline text).
   *
   * @private
   */
  _renderTextArea() {
    // Extractors
    const { props }   = this;
    const { control } = props;

    // Classnames
    let _cls_names = ["form-control"];
    if (control.state === "error") _cls_names.push("is-invalid");
    if (control.state === "success") _cls_names.push("is-valid");

    return (
      <textarea
        className={classnames(_cls_names, control.custom_class)}
        value={control.value || ""}
        placeholder={control.placeholder}
        cols={control.cols || 30}
        rows={control.rows || 8}
        onChange={
          e => control.onValueChange(e.target.value) || this.forceUpdate()
        }/>
    );
  }

  /**
   * Renders a single text input (single line input).
   *
   * @private
   */
  _renderTextInput() {
    // Extractors
    const { props }   = this;
    const { control } = props;

    // Classnames
    let _cls_names = ["form-control"];
    if (control.state === "error") _cls_names.push("is-invalid");
    if (control.state === "success") _cls_names.push("is-valid");

    return (
      <input
        className={classnames(_cls_names, control.custom_class)}
        value={control.value || ""}
        type={control.type || "text"}
        placeholder={control.placeholder}
        onChange={
          e => control.onValueChange(e.target.value) || this.forceUpdate()
        }/>
    );
  }

  /**
   * Renders the valid/invalid input feedback.
   *
   * @param {boolean} display_block
   * @returns {*}
   * @private
   */
  _renderFeedback(display_block = false) {
    // Extractors
    const { props } = this;
    let { control } = props;

    // Classnames
    let _cls_names = [];
    if (control.state === "error") _cls_names.push("invalid-feedback");
    if (control.state === "success") _cls_names.push("valid-feedback");
    if (display_block) _cls_names.push("d-block");

    return (
      <div className={classnames(_cls_names)}>
        {control.message}
      </div>
    );
  }

  // Exposed Renderers
  // ----------------------------------------------------------------------

  /**
   * Renders all the controls inside a `CtrlCollection`.
   *
   * @param {CtrlCollection} control_collection
   * @returns {*}
   */
  static renderCollection(control_collection) {
    // Extract controls from collection
    let { controls } = control_collection;

    if (control_collection instanceof CtrlCollection) {
      // Render controls and return array
      let rendered_controls = [];

      for (let i in controls) {
        rendered_controls.push(
          <RendererBootstrap4 control={controls[i]} key={i}/>
        );
      }
      return rendered_controls;
    }
    return null;
  }

  /**
   * Renders a single control.
   *
   * This method is provided for renderer abstraction.
   *
   * @param {Ctrl} control
   * @returns {*}
   */
  static renderSingleControl(control) {
    return <RendererBootstrap4 control={control}/>
  }

  // React Lifecycle
  // ----------------------------------------------------------------------

  /**
   * Renders the component.
   *
   * @returns {*}
   */
  render() {
    // Extractors
    const { props }   = this;
    const { control } = props;

    // Classnames
    const _class = ["form-group"];

    return (
      <div className={classnames(_class, props.className)}>
        <label>{control.label}</label>
        {this._renderInput()}
        {
          control.message
          && control.message !== null
          && control.message !== undefined
          && control.message !== ""
          && control.type !== "single_option"
          && control.type !== "radio_group"
          && control.type !== "multiple_option"
          && control.type !== "checkbox_group"
          && this._renderFeedback()
        }
      </div>
    );
  }
}

// PropTypes
// ----------------------------------------------------------------------

RendererBootstrap4.defaultProps = {
  control: null
};

RendererBootstrap4.propTypes = {
  control: PropTypes.instanceOf(Ctrl).isRequired
};

export default RendererBootstrap4;
