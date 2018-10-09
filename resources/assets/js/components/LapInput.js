import React from "react";

export default function LapInput(props) {
    const name = `lap_${props.number}`;
    const id = `lap-${props.number}`;

    /**
     * Enables choosing a value for each input element via pressing the up and
     * down arrow keys.
     *
     * @param {React.SyntheticEvent} event The event triggered when pressing a
     *                                     key
     *
     * @returns null
     */
    function scrollNumber(event) {
        const el = event.target;
        const val = parseInt(el.value, 10);
        const max = parseInt(el.dataset.max, 10);
        if (event.key === "ArrowDown") {
            el.value = isNaN(val) ? max : val > 0 ? val - 1 : 0;
        }
        if (event.key === "ArrowUp") {
            el.value = isNaN(val) ? 0 : val < max ? val + 1 : max;
        }
    }

    return (
        <div className="row px-3 py-1">
            <div className="col-md-4">
                <label htmlFor={`#${id}`}>Lap {props.number}</label>
            </div>
            <div className="col-md-8" id={id}>
                <input
                    className="run_time_input run_time_input_minute"
                    name={name + "_m"}
                    onKeyDown={scrollNumber}
                    pattern="^\d{1,2}$"
                    required
                    data-max="99"
                />
                <span>m</span>
                <input
                    className="run_time_input run_time_input_second"
                    name={name + "_s"}
                    onKeyDown={scrollNumber}
                    pattern="^[1-5]?[0-9]$"
                    required
                    data-max="59"
                />
                <span>s</span>
                <input
                    className="run_time_input run_time_input_millisecond"
                    name={name + "_ms"}
                    onKeyDown={scrollNumber}
                    pattern="^\d{1,3}$"
                    required
                    data-max="999"
                />
                <span>ms</span>
            </div>
        </div>
    );
}
