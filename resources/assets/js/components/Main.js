import React, { Component, Fragment } from "react";
import ReactDOM from "react-dom";

import AddTimeForm from "./AddTimeForm";
import TimeList from "./TimeList";

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
     * This method is called in AddTimeForm, once a new run is successfully
     * recorded. This updates the `runs` state with the new run, which `TimeList`
     * then renders.
     */
    listNewlyRecordedRun(newRunDeets) {
        this.setState({ newRunDeets });
    }

    render() {
        // Check if we have times to display
        return (
            <Fragment>
                <div className="row">
                    <div className="col-md-8 offset-md-2">
                        <AddTimeForm
                            csrfToken={this.props.csrfToken}
                            listNewlyRecordedRun={this.listNewlyRecordedRun.bind(
                                this
                            )}
                        />
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-8 offset-md-2">
                        <TimeList newRunDeets={this.state.newRunDeets} />
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
