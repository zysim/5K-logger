import React from "react";

/**
 * This component holds the list of run dates and their corresponding times.
 * @param {any} props The array of times to list out
 */
export default function Time(props) {
    const time = props.time;
    return (
        <div className="time_container">
            <h4 className="time_header">{time.runDate || "Empty"}</h4>
            {(time.lapTimes &&
                time.lapTimes.map((lap, i) => (
                    <div className="time_body" key={i}>
                        <div>Lap {i}</div>
                        <div>{lap}</div>
                    </div>
                ))) ||
                ""}
        </div>
    );
}
