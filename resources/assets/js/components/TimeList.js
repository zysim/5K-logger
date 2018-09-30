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
        console.log("Fetching");
        try {
            const response = await axios.get(`/api/get-time/${id}`, {
                headers: {
                    "Content-Type": "application/json"
                }
            });
            const time = response.data;
            // Check if the component has unmounted before updating state
            !this.isCancelled &&
                this.setState({
                    time: { ...time },
                    isFetching: false
                });
        } catch (error) {
            !this.isCancelled &&
                this.setState({ isFetching: false, hasError: true });
            throw error;
        }
    }

    constructor(props) {
        super(props);
        this.state = { time: {}, hasError: false, isFetching: true };
    }

    componentDidMount() {
        // Fetch the test document
        // TODO: Need to fetch all documents COUCHDB DOCS
        const testDocument = "91fa5c917d9312d68258034fbf000c54";
        this.fetchDocument(testDocument);
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
        return (
            <div className="card">
                <div className="card-header">List of Times</div>
                {/* {this.props.times.map(time => (
                    <Time time={time} key={time.id} />
                ))} */}
                <Time time={this.state.time} />
            </div>
        );
    }
}
