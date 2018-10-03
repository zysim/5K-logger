import React, { Component } from "react";

import TimeArray, { divide as TimeDivide } from "../timearray";

/**
 * This component holds the list of run dates and their corresponding times.
 * @param {any} props The array of times to list out
 */
export default class Time extends Component {
    constructor(props) {
        super(props);
        // There may be a general override for summary rendering
        this.state = {
            summarise: this.props.summarise || true,
            totalAndMean: null
        };
    }

    componentDidMount() {
        // Calculate the total and mean times once it's mounted
        this.setState({
            totalAndMean: this.getTotalAndMean(this.props.time.lapTimes)
        });
    }

    componentWillUnmount() {
        this.isCancelled = true;
    }

    render() {
        const time = this.props.time;
        let view;
        if (time.lapTimes && this.state.summarise && this.state.totalAndMean) {
            const total = this.state.totalAndMean.total;
            const mean = this.state.totalAndMean.mean;
            // Render a view that shows total and mean times
            view = (
                <div className="time_body">
                    <div className="time_body_item">
                        <div>Total:</div>
                        <div>{this.stringify(total)}</div>
                    </div>
                    <div className="time_body_item">
                        <div>Average:</div>
                        <div>{this.stringify(mean)}</div>
                    </div>
                </div>
            );
        } else if (time.lapTimes) {
            // Render a list of individual lap times
            // time.lapTimes = [[<minutes>, <seconds>, <milliseconds>], ...]
            view = time.lapTimes.map((t, i) => (
                <div className="time_body time_body_item" key={i}>
                    <div>Lap {i}</div>
                    <div>{this.stringify(t)}</div>
                </div>
            ));
        } else {
            // Component was unmounted or something I guess
            view = "";
        }
        return (
            <div className="time_container">
                <h4 className="time_header">{time.runDate || "Empty"}</h4>
                <div>
                    <button
                        className="mx-auto"
                        onClick={this.toggleSummary.bind(this)}
                    >
                        <span
                            className={
                                this.state.summarise ? "summary" : "detailed"
                            }
                        />
                    </button>
                </div>
                {view}
            </div>
        );
    }

    /**
     * Toggles rendering the summary view and the detail view.
     */
    toggleSummary() {
        this.setState(prevState => ({
            summarise: !prevState.summarise
        }));
    }

    /**
     * Calculates the total and mean time from the array of individual lap times.
     *
     * @param times{Number[][]} The array of individual lap times to calculate
     *
     * @return {Number[]} The total and mean times, in that order
     */
    getTotalAndMean(times) {
        const t = [];
        // Get the total for each time element and push to the array
        for (let i = 0; i < times[0].length; i++) {
            const element = times
                .map(time => time[i])
                .reduce((sum, t) => sum + t);
            t.push(element);
        }
        // Tidy it up
        const total = TimeArray.apply(null, t);
        const mean = TimeDivide(total, times.length);
        return { total, mean };
    }

    /**
     * Renders a time array to a readable string
     *
     * @param time{Number[]} The time array
     *
     * @return string A string representing the time for the frontend
     */
    stringify(time) {
        return `${time[0]}m ${time[1]}.${time[2]}s`;
    }
}
