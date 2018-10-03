import React from "react";

export default function LapInput(props) {
    const name = `lap_${props.number}`;
    const id = `lap-${props.number}`;
    return (
        <div className="row px-3 py-1">
            <div className="col-md-4">
                <label htmlFor={`#${id}`}>Lap {props.number}</label>
            </div>
            <div className="col-md-8" id={id}>
                <input
                    className="lap_input_time"
                    type="number"
                    name={name + "_m"}
                    required
                />
                m
                <input
                    className="lap_input_time"
                    type="number"
                    max="59"
                    name={name + "_s"}
                    required
                />
                s
                <input
                    className="lap_input_time"
                    type="number"
                    max="999"
                    name={name + "_ms"}
                    required
                />
                ms
            </div>
        </div>
    );
}
