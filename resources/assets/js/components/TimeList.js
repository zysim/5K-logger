import React, { Component } from "react";
import axios from "axios";

import Time from "./Time";
import LoadingSpinner from "./LoadingSpinner";

export default class TimeList extends Component {
    /**
     * This fetches a document with `id`.
     *
     * @param string id The ID of the Time document to fetch
     */
    async fetchDocument(id) {
        try {
            const response = await axios.get(`/api/get-time/${id}`, {
                headers: {
                    "Content-Type": "application/json"
                }
            });
            const time = response.data;
            return time;
        } catch (error) {
            !this.isCancelled &&
                this.setState({ isFetching: false, hasError: true });
            throw error;
        }
    }

    constructor(props) {
        super(props);
        this.state = { times: [], hasError: false, isFetching: true };
    }

    componentDidMount() {
        // Fetch the test documents
        // TODO: Need to fetch all documents COUCHDB DOCS
        const testDocuments = [
            "6f9a16fd8e4d84cfcbf90455df0035b8",
            "6f9a16fd8e4d84cfcbf90455df003f03",
            "91fa5c917d9312d68258034fbf000c54"
        ];
        Promise.all(testDocuments.map(d => this.fetchDocument(d))).then(
            times => {
                !this.isCancelled &&
                    this.setState({
                        times: [...times],
                        isFetching: false
                    });
            }
        );
    }

    componentWillUnmount() {
        // Update isCancelled to kill pending fetches
        this.isCancelled = true;
    }

    componentDidCatch(error, info) {
        console.error("TimeList error:", error, info);
        this.setState({ isFetching: false, hasError: true });
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
        const times = this.state.times;
        return (
            <div className="card" id="time_list_container">
                <div className="card-header" id="time_list_header">
                    List of Times
                </div>
                <div className="card-body" id="time_list_body">
                    {(times &&
                        times.map((time, i) => <Time time={time} key={i} />)) ||
                        ""}
                </div>
            </div>
        );
    }
}
