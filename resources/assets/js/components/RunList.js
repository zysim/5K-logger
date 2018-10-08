import React, { Component } from "react";
import axios from "axios";

import Run from "./Run";
import LoadingSpinner from "./LoadingSpinner";
import { arrayOrBust } from "../utilities";

export default class RunList extends Component {
    /**
     * This fetches a document with `id`.
     *
     * @param string id The ID of the Run document to fetch
     * @deprecated This is now deprecated as the route does not exist anymore
     */
    // async fetchDocument(id) {
    //     try {
    //         const response = await axios.get(`/api/get-run/${id}`, {
    //             headers: {
    //                 "Content-Type": "application/json"
    //             }
    //         });
    //         const run = response.data;
    //         return run;
    //     } catch (error) {
    //         !this.isCancelled &&
    //             this.setState({ isFetching: false, hasError: true });
    //         throw error;
    //     }
    // }

    constructor(props) {
        super(props);
        this.state = { runs: [], hasError: false, isFetching: true };
    }

    componentDidMount() {
        const uri = "/api/get-run/all";
        axios
            .get(uri, {
                headers: { "Content-Type": "application/json" }
            })
            .then(response => {
                !this.isCancelled &&
                    this.setState({
                        runs: response.data,
                        isFetching: false
                    });
            })
            .catch(error => {
                throw error;
            });
    }

    componentWillUnmount() {
        // Update isCancelled to kill pending fetches
        this.isCancelled = true;
    }

    componentDidCatch(error, info) {
        console.error("RunList caught an error:");
        console.error(error);
        this.setState({ isFetching: false, hasError: true });
    }

    componentDidUpdate(prevProps) {
        // Push the newly-added run to the list
        const currentRunDeets = this.props.newRunDeets;
        if (prevProps.newRunDeets.id !== currentRunDeets.id) {
            this.fetchDocument(currentRunDeets.id).then(run => {
                !this.isCancelled &&
                    this.setState(prevState => ({
                        runs: prevState.runs.concat(run)
                    }));
            });
        }
    }

    render() {
        // If there's an error
        if (this.state.hasError) {
            return <span>Error lol</span>;
        }
        // Run the spinner if we're still fetching shit
        if (this.state.isFetching) {
            return <LoadingSpinner />;
        }
        // Check if runs exist and has elements to show
        const runs = arrayOrBust(this.state.runs);
        return (
            <div className="card" id="run_list_container">
                <div className="card-header" id="run_list_header">
                    List of Runs
                </div>
                <div className="card-body" id="run_list_body">
                    {(runs &&
                        runs.map((run, i) => <Run run={run} key={i} />)) ||
                        "No runs to show"}
                </div>
            </div>
        );
    }
}
