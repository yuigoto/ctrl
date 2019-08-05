import React, { Component } from "react";
import PropTypes from "prop-types";
import classnames from "classnames";

import { Ctrl } from "../ctrl/Ctrl";
import { CtrlCollection } from "../ctrl/CtrlCollection";
import { CtrlStates } from "../ctrl/CtrlStates";
import { CtrlType } from "../ctrl/CtrlType";

/**
 * Renderers/RendererBootstrap4
 * ----------------------------------------------------------------------
 * `Ctrl` component renderer for React, made specifically for Bootstrap 4.
 * 
 * @since 0.0.1
 */
class RendererBootstrap4 extends Component {
  // Lifecycle
  // --------------------------------------------------------------------

  /**
   * Renders the component.
   *
   * @returns {*}
   */
  render () {
    const { props, state } = this;
    const { control } = props;

    let classes = ["form-group"];

    return (
      <div className={classnames(classes, props.className)}>
        <label>{control.label}</label>
        {this._renderControl()}
        {
          control.message
          && control.message !== ""
          && control.type !== CtrlType.SINGLE_OPTION
          && control.type !== CtrlType.RADIO_GROUP
          && control.type !== CtrlType.MULTIPLE_OPTION
          && control.type !== CtrlType.CHECKBOX_GROUP
          && this._renderFeedback()
        }
      </div>
    );
  }

  // Static Methods
  // --------------------------------------------------------------------

  /**
   * Takes a `Ctrl` instance as an input and returns a component.
   *
   * @param {Ctrl} control 
   *     Instance of `Ctrl`
   * @returns {RendererBootstrap4}
   */
  static renderSingleControl (control) {
    if (control instanceof Ctrl) {
      return (
        <RendererBootstrap4 control={control}/>
      );
    }

    return null;
  }

  /**
   * Takes a `CtrlCollection` instance as an input and returns an array 
   * of rendered components.
   *
   * @param {CtrlCollection} controlCollection 
   *     Instance of `CtrlCollection`
   * @returns {RendererBootstrap4[]}
   */
  static renderCollection (controlCollection) {
    const { controls } = controlCollection;

    if (controlCollection instanceof CtrlCollection) {
      let rendered = [];

      for (let i in controls) {
        rendered.push(
          <RendererBootstrap4 control={controls[i]} key={i}/>
        );
      }

      return rendered;
    }

    return null;
  }

  // Private Methods
  // --------------------------------------------------------------------

  /**
   * Catch-all method for the main renderer.
   *
   * @returns {*}
   */
  _renderControl () {
    const { props } = this;
    const { control } = props;

    switch (control.type) {
      case CtrlType.MULTIPLE_OPTION:
      case CtrlType.CHECKBOX_GROUP:
        return this._renderCheckboxOrRadioGroup(true);
      case CtrlType.SINGLE_OPTION:
      case CtrlType.RADIO_GROUP:
        return this._renderCheckboxOrRadioGroup();
      case CtrlType.TEXTAREA:
        return this._renderTextarea();
      case CtrlType.DROPDOWN:
        return this._renderDropdown();
      case CtrlType.BOOLEAN:
        return this._renderBoolean();
      default:
        return this._renderDefault();
    }
  }

  /**
   * Renders a boolean-type input.
   *
   * @returns {*}
   */
  _renderBoolean () {
    const { props } = this;
    const { control } = props;
    let { value } = control;

    let __id = control.name + "-" + (new Date()).toString();
    let _checked = (value === true);

    let _classInput, _classCheck, _classLabel;
    if (control.custom) {
      _classInput = ["custom-control", "custom-checkbox"];
      _classCheck = ["custom-control-input"];
      _classLabel = ["custom-control-label"];
    } else {
      _classInput = ["form-check"];
      _classCheck = ["form-check-input"];
      _classLabel = ["form-check-label"];
    }

    if (control.state === CtrlStates.ERROR) _classCheck.push("is-invalid");
    if (control.state === CtrlStates.VALID) _classCheck.push("is-valid");

    return (
      <div className={classnames(_classInput, control.customClass)}>
        <input
          id={__id}
          className={classnames(_classCheck)}
          type={control.getType()}
          name={control.name}
          defaultChecked={_checked}
          onClick={e => control.onBooleanChange(value) || this.forceUpdate()}
          aria-invalid={control.state === CtrlStates.ERROR}
          disabled={control.disabled}/>
        <label for={__id} className={classnames(_classLabel)}>
          {control.label}
        </label>
        {this._renderFeedback(true)}
      </div>
    );
  }

  /**
   * Renders a checkbox/single-option, radio/multiple-option input type 
   * group.
   *
   * @returns {*}
   */
  _renderCheckboxOrRadioGroup (isCheckbox = false) {
    const { props } = this;
    const { control } = props;
    let { options, value } = control;

    let _classesGroup = [];
    if (isCheckbox === true) {
      _classesGroup.push("checkbox-group");
    } else {
      _classesGroup.push("radio-group");
    }

    // Last option ID (we use it to render feedback)
    let lastIndex = options.length - 1;

    return (
      options
      && (
        <div className={classnames(_classesGroup)}>
          {options.map((option, index) => {
            let _id,
                _checked,
                _click,
                _type,
                _classInput,
                _classCheck,
                _classLabel;

            _id = (isCheckbox === true)
              ? `${control.name}-checkbox-${index}`
              : `${control.name}-radio-${index}`;

            // Is it custom?
            if (option.custom && option.custom === true) {
              _classInput = ["custom-control"];
              _classInput.push(
                isCheckbox === true
                  ? "custom-checkbox"
                  : "custom-radio"
              );
              if (option.inline === true) _classInput.push("custom-control-inline");

              _classCheck = ["custom-control-input"];

              _classLabel = ["custom-control-label"];
            } else {
              _classInput = ["form-check"];
              if (option.inline === true) _classInput.push("form-check-inline");

              _classCheck = ["form-check-input"];

              _classLabel = ["form-check-label"];
            }

            if (control.state === CtrlStates.ERROR) _classCheck.push("is-invalid");
            if (control.state === CtrlStates.VALID) _classCheck.push("is-valid");

            if (isCheckbox === true) {
              _checked = (
                Array.isArray(value)
                && (
                  value.includes(option.value) || value.includes(option.name)
                )
              );

              _click = () => {
                control.onValueToggle(option.value || option.name);
              };
            } else {
              _checked = (option.value === value || option.name === value);

              _click = () => {
                control.onValueChange(option.value || option.name);
              };
            }

            _type = control.getType();

            return (
              <div className={classnames(_classInput, control.customClass)}
                   key={_id}>
                <input
                  id={_id}
                  className={classnames(_classCheck)}
                  type={_type}
                  name={control.name}
                  defaultChecked={_checked}
                  onClick={_click}
                  aria-invalid={control.state === CtrlStates.ERROR}
                  disabled={option.disabled}/>
                <label htmlFor={_id} className={classnames(_classLabel)}>
                  {option.name}
                </label>
                {index === lastIndex && this._renderFeedback(true)}
              </div>
            );
          })}
        </div>
      )
    );
  }

  /**
   * Renders a select/dropdown-type input.
   *
   * @returns {*}
   */
  _renderDropdown () {
    const { props } = this;
    const { control } = props;
    let { value } = control;

    let _classes = ["form-control"];
    if (control.state === CtrlStates.ERROR) _classes.push("is-invalid");
    if (control.state === CtrlStates.VALID) _classes.push("is-valid");
    if (control.custom === true) {
      _classes.push("custom-select");
    }

    return (
      <select
        className={classnames(_classes, control.customClass)}
        onChange={e => control.onValueChange(e.target.value) || this.forceUpdate()}
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
   * Renders a textarea form input.
   *
   * @returns {*}
   */
  _renderTextarea () {
    const { props } = this;
    const { control } = props;

    let _classes = ["form-control"];
    if (control.state === CtrlStates.ERROR) _classes.push("is-invalid");
    if (control.state === CtrlStates.VALID) _classes.push("is-valid");

    return (
      <textarea
        className={classnames(_classes, control.customClass)}
        value={control.value || ""}
        placeholder={control.placeholder}
        cols={control.cols || 30}
        rows={control.rows || 8}
        onChange={e => control.onValueChange(e.target.value) || this.forceUpdate()}/>
    );
  }

  /**
   * Renders the valid/invalid feedback message.
   *
   * @param {Boolean} displayBlock 
   *     If the object should be rendered with a BS4 "block" display class
   * @returns {*}
   */
  _renderFeedback (displayBlock) {
    const { props } = this;
    const { control } = props;

    let _classes = [];
    if (control.state === CtrlStates.ERROR) _classes.push("invalid-feedback");
    if (control.state === CtrlStates.VALID) _classes.push("valid-feedback");
    if (displayBlock === true) _classes.push("d-block");

    return (
      <div className={classnames(_classes)}>
        {control.message}
      </div>
    );
  }

  /**
   * Renders any default-type input field.
   *
   * @returns {*}
   */
  _renderDefault () {
    const { props } = this;
    const { control } = props;

    let _classes = ["form-control"];
    if (control.state === CtrlStates.ERROR) _classes.push("is-invalid");
    if (control.state === CtrlStates.VALID) _classes.push("is-valid");

    return (
      <input
        className={classnames(_classes, control.customClass)}
        value={control.value}
        type={control.getType()}
        placeholder={control.placeholder}
        onChange={e => control.onValueChange(e.target.value) || this.forceUpdate()}/>
    );
  }
}

RendererBootstrap4.defaultProps = {
  control: null,
  className: ""
};

RendererBootstrap4.propTypes = {
  control: PropTypes.instanceOf(Ctrl).isRequired,
  className: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.arrayOf(PropTypes.string)
  ])
};

export {
  RendererBootstrap4
};
