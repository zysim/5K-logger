import React, { Component } from "react";
import axios from "axios";

import LapInput from "./LapInput";

/**
 * This component contains the form that is used to record a new run.
 */
export default class AddRunForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            hasError: false,
            numberOfLaps: 15
        };
    }

    componentDidCatch(error, info) {
        // Display fallback UI
        this.setState({ hasError: true });
        console.error("Error caught in AddRunForm:");
        console.error(error);
    }

    /**
     * Adds a new lap to add runs to
     */
    // addLap() {
    //     this.setState((prevState, prop) => ({
    //         numberOfLaps: prevState.numberOfLaps++
    //     }));
    // }

    /**
     * Makes the post request to add a new run and stuff.
     */
    async addRun(ev) {
        try {
            ev.preventDefault();
            const data = new FormData(ev.target);
            // Post and get the new run ID
            const response = await axios.post("/api/add-run", data);
            this.props.listNewlyRecordedRun(response.data);
        } catch (error) {
            throw error;
        }
    }

    render() {
        if (this.state.hasError) {
            return <span>Lmao</span>;
        }
        return (
            <form
                action="/api/add-run"
                method="post"
                id="tracker:form__add_run"
                onSubmit={this.addRun.bind(this)}
            >
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
                            <input
                                type="date"
                                name="run_date"
                                id="run-date"
                                required
                            />
                        </div>
                    </div>

                    {Array(...Array(this.state.numberOfLaps)).map((_, i) => {
                        return <LapInput number={i} key={i.toString()} />;
                    })}

                    {/* <div className="row">
                        <div className="col-md-1">
                            <button onClick={this.addLap.bind(this)}>
                                Add more
                            </button>
                        </div>
                    </div> */}

                    <div className="row px-3 py-1">
                        <div className="col-md-1 pull-right">
                            <input type="submit" value="Add" />
                        </div>
                    </div>
                </div>
            </form>
        );
    }
}
