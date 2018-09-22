import React, { Component } from "react";
import ReactDOM from "react-dom";

import AddTimeForm from "./AddTimeForm";
import Time from "./Time";

const testTimes = [
    {
        id: 1,
        runDate: "2018-01-01",
        lap1: "00:00",
        lap2: "12:30",
        lap3: "23:59"
    },
    {
        id: 2,
        runDate: "2018-01-02",
        lap1: "00:00",
        lap2: "12:30",
        lap3: "23:59"
    },
    {
        id: 3,
        runDate: "2018-01-03",
        lap1: "00:00",
        lap2: "12:30",
        lap3: "23:69"
    }
];

export default class Main extends Component {
    constructor(props) {
        super(props);
        this.state = {
            hasError: false
        };
    }

    componentDidCatch(error, info) {
        this.setState({ hasError: true });
    }

    render() {
        // Check if we have times to display
        let times;
        if (!this.props.times || !this.props.times.map) {
            times = testTimes.map(time => <Time time={time} key={time.id} />);
        } else {
            times = this.props.times.map(time => (
                <Time time={time} key={time.id} />
            ));
        }

        return (
            <div className="container">
                <div className="row">
                    <div className="col-md-8 offset-md-2">
                        <AddTimeForm csrfToken={this.props.csrfToken} />
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-8 offset-md-2">
                        <div className="card">
                            <div className="card-header">List of Times</div>
                            {times}
                        </div>
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
