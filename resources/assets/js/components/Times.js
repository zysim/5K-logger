import React from 'react';
import ReactDOM from 'react-dom';


/**
 * This component holds the list of run dates and their corresponding times.
 * @param {any} props The array of times to list out
 */
export default function Times (props) {
    // Check if we don't have any times to show
    if (!props.times || props.times.length === 0) {
        return <h3 className="text-center">No times recorded yet.</h3>;
    }
    // List all the times
    return props.times.map((time, i) => {
        return (
            <div className="row px-3 py-2">
                <div className="col-md-12">
                    <div className="row">
                        <div className="col-md-12">
                            <h4>{ time.runDate }</h4>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-2">First Lap:</div>
                        <div className="col-md-2">{ time.lap1 }</div>
                    </div>
                    <div className="row">
                        <div className="col-md-2">Second Lap:</div>
                        <div className="col-md-2">{ time.lap2 }</div>
                    </div>
                    <div className="row">
                        <div className="col-md-2">Third Lap:</div>
                        <div className="col-md-2">{ time.lap3 }</div>
                    </div>
                </div>
                <hr/>
            </div>
        );
    });
}
