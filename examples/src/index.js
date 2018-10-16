import React, { Component } from "react";
import { render } from "react-dom";
import CtrlCollection from "ctrl/CtrlCollection";
import RendererBootstrap4 from "renderers/RendererBootstrap4";
import ControlBlueprintObject from "./ControlBlueprintObject";

class App extends Component {
  /**
   * App constructor.
   *
   * @param {*} props
   */
  constructor(props) {
    super(props);

    // Build control collection
    this.controlCollection = new CtrlCollection();
    for (let control of ControlBlueprintObject) {
      this.controlCollection.add(control);
    }

    // Binding
    this.onSubmitForm = this.onSubmitForm.bind(this);
  }

  // Methods
  // --------------------------------------------------------------------

  /**
   * Submit event callback.
   *
   * @param event
   */
  onSubmitForm(event) {
    event.preventDefault();

    let { controlCollection } = this;

    // Logs to object
    console.log(controlCollection.toObject());

    if (!controlCollection.validate()) {
      this.forceUpdate();
      return;
    }
  }

  // React Lifecycle
  // --------------------------------------------------------------------

  render() {
    return (
      <div className={"p-5"}>
        <h1 className={"display-4"}>
          Ctrl <small className={"font-weight-light text-muted"}>: example page</small>
        </h1>

        <p>
          <small>
            by Fabio Y. Goto (<a href="mailto:lab@yuiti.com.br">lab@yuiti.com.br</a>)
          </small>
        </p>

        <p className={"text-muted lead"}>
          <code>Ctrl</code> is a multi-purpose controlled component, mainly for use with React, mostly useful for HTML inputs and forms. It is an expanded fork of <code>Xcontrol</code>, originally built by Rodrigo Portela (<a href={"https://github.com/rportela"} target={"_blank"}>@rportela</a>).
        </p>

        <p>It basically works by creating <em>blueprints</em> (POJO) with specification for controls, which are then passed onto a <code>Ctrl</code> or <code>CtrlCollection</code> object, which will add validation and parsing capabilities to them.</p>

        <p>The single controls or the collection are, then, passed to a renderer component, for display and use. The examples in this page uses the `Bootstrap4Renderer` example component, but you're free to develop or expand on your own.</p>

        <p>It hasn't been tested yet, but the "raw" controls might be used with other libraries. Even though its primary target is <strong>React</strong>.</p>

        <hr/>

        <h3>Example form built with the components.</h3>

        <form onSubmit={this.onSubmitForm}>
          {RendererBootstrap4.renderCollection(this.controlCollection)}

          <hr/>

          <button type={"submit"} className={"btn btn-success"}>
            Enviar ✌
          </button>
        </form>
      </div>
    );
  }
}

render(<App/>, document.getElementById("root"));
