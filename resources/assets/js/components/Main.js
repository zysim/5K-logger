import React, { Component, Fragment } from "react";
import ReactDOM from "react-dom";

import AddRunForm from "./AddRunForm";
import RunList from "./RunList";

export default class Main extends Component {
    constructor(props) {
        super(props);
        this.state = {
            hasError: false,
            newRunDeets: {}
        };
    }

    componentDidCatch(error, info) {
        console.error("Error received:", error, info);
        this.setState({ hasError: true });
    }

    /**
     * This method is called in AddRunForm, once a new run is successfully
     * recorded. This updates the `runs` state with the new run, which `RunList`
     * then renders.
     */
    listNewlyRecordedRun(newRunDeets) {
        this.setState({ newRunDeets });
    }

    render() {
        // Check if we have runs to display
        return (
            <Fragment>
                <div className="row">
                    <div className="col-md-8 offset-md-2">
                        <AddRunForm
                            csrfToken={this.props.csrfToken}
                            listNewlyRecordedRun={this.listNewlyRecordedRun.bind(
                                this
                            )}
                        />
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-8 offset-md-2">
                        <RunList newRunDeets={this.state.newRunDeets} />
                    </div>
                </div>
            </Fragment>
        );
    }
}

const root = document.getElementById("main");
const csrfToken = document.querySelector('meta[name="csrf-token"]').content;

if (root) {
    ReactDOM.render(<Main csrfToken={csrfToken} />, root);
}
