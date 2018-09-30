import React, { Component } from "react";
import ReactDOM from "react-dom";

import AddTimeForm from "./AddTimeForm";
import TimeList from "./TimeList";

export default class Main extends Component {
    constructor(props) {
        super(props);
        this.state = {
            hasError: false
        };
    }

    componentDidCatch(error, info) {
        console.log("Error", error, info);
        this.setState({ hasError: true });
    }

    render() {
        // Check if we have times to display
        return (
            <div className="container">
                <div className="row">
                    <div className="col-md-8 offset-md-2">
                        <AddTimeForm csrfToken={this.props.csrfToken} />
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-8 offset-md-2">
                        <TimeList />
                    </div>
                </div>
            </div>
        );
    }
}

const root = document.getElementById("main");
const csrfToken = document.querySelector('meta[name="csrf-token"]').content;

if (root) {
    ReactDOM.render(
        <Main csrfToken={csrfToken} times={root.getAttribute("data-times")} />,
        root
    );
}
