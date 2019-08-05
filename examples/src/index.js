import React, { Component } from "react";
import { render } from "react-dom";

import { Ctrl, CtrlCollection, RendererBootstrap4 } from "../../src";
import { CtrlBlueprints } from "./CtrlBlueprints";

class App extends Component {
  /**
   * @type {CtrlCollection}
   */
  controls;

  constructor (props) {
    super(props);

    this.state = {};

    this.controls = new CtrlCollection();
    for (let control of CtrlBlueprints) {
      this.controls.add(control);
    }

    this.onSubmitForm = this.onSubmitForm.bind(this);
  }

  /**
   *
   * @param {Event} event
   */
  onSubmitForm (event) {
    event.preventDefault();

    let { controls } = this;

    // Log object
    console.log(controls.toObject());

    if (!controls.validate()) {
      this.forceUpdate();
    }
  }

  render () {
    return (
      <div className={"container py-5"}>
        <h1 className={"display-4"}>
          <code>
            @yuigoto/ctrl
          </code>
        </h1>

        <p className={"text-muted lead"}>
          <code>Ctrl</code> is a multi-purpose controlled component, mainly for use with React, mostly useful for HTML inputs and forms.
        </p>

        <form onSubmit={this.onSubmitForm}>
          {RendererBootstrap4.renderCollection(this.controls)}

          <button type={"submit"} className={"btn btn-success"}>
            Submit 😉
          </button>
        </form>

        <hr/>

        <p>
          <small>
            by Fabio Y. Goto (<a href="mailto:lab@yuiti.com.br">lab@yuiti.com.br</a>)
          </small>
        </p>
      </div>
    );
  }
}

render(
  <App/>,
  document.getElementById("root")
);
