import React from "react";
// import ReactDOM from 'react-dom';

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
                        <h4>{time.runDate}</h4>
                    </div>
                </div>
                {[1, 2, 3].map(i => (
                    <div className="row">
                        <div className="col-md-2">Lap {i}</div>
                        <div className="col-md-2">{time[`lap${i}`]}</div>
                    </div>
                ))}
            </div>
            <hr />
        </div>
    );
}
