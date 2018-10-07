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
        const uri = "/api/get-time/all";
        axios
            .get(uri, {
                headers: { "Content-Type": "application/json" }
            })
            .then(response => {
                !this.isCancelled &&
                    this.setState({
                        times: response.data,
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
        console.error("TimeList caught an error:");
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
                        times: prevState.times.concat(run)
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
        // Check if times exist and has elements to show
        const times =
            this.state.times && this.state.times.length > 0
                ? this.state.times
                : null;
        return (
            <div className="card" id="time_list_container">
                <div className="card-header" id="time_list_header">
                    List of Times
                </div>
                <div className="card-body" id="time_list_body">
                    {(times &&
                        times.map((time, i) => <Time time={time} key={i} />)) ||
                        "No times to show"}
                </div>
            </div>
        );
    }
}
