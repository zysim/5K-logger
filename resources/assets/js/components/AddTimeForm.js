import React, { Component } from "react";

import LapInput from "./LapInput";

/**
 * This component contains the form that is used to record a new set of running
 */
export default class AddTimeForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            hasError: false,
            numberOfLaps: 3
        };
    }

    componentDidCatch(error, info) {
        // Display fallback UI
        this.setState({ hasError: true });
        console.error(error);
        console.error(info);
    }

    render() {
        if (this.state.hasError) {
            return <span>Lmao</span>;
        }
        return (
            <form action="/add-time" method="post">
                <input
                    type="hidden"
                    name="_token"
                    value={this.props.csrfToken}
                />
                <div className="card">
                    <div className="card-header">Add A New Run</div>
                    <div className="row px-3 py-1">
                        <div className="col-md-4">
                            <label htmlFor="#run-date">Date of run</label>
                        </div>
                        <div className="col-md-8">
                            <input type="date" name="run_date" id="run-date" />
                        </div>
                    </div>

                    {Array(...Array(this.state.numberOfLaps)).map((_, i) => {
                        return <LapInput number={i + 1} key={i.toString()} />;
                    })}

                    <div className="row px-3 py-1">
                        <div className="col-md-1">
                            <input
                                type="submit"
                                className="pull-right"
                                value="Add"
                            />
                        </div>
                    </div>
                </div>
            </form>
        );
    }
}
