import React from "react";

/**
 * This component holds the list of run dates and their corresponding times.
 * @param {any} props The array of times to list out
 */
export default function Time(props) {
    const time = props.time;
    return (
        <div className="row px-3 py-2">
            <div className="col-md-12">
                <div className="row">
                    <div className="col-md-12">
                        <h4>{time.runDate || "Empty"}</h4>
                    </div>
                </div>
                {(time.lapTimes &&
                    time.lapTimes.map((lap, i) => (
                        <div className="row" key={i}>
                            <div className="col-md-2">Lap {i}</div>
                            <div className="col-md-2">{lap}</div>
                        </div>
                    ))) ||
                    ""}
            </div>
            <hr />
        </div>
    );
}
