import React from 'react';

export default function FormElement(props) {
    const name = `lap_${props.number}`;
    const id = `lap-${props.number}`;
    return (
        <div className="row px-3 py-1">
            <div className="col-md-4">
                <label htmlFor={`#${id}`}>Lap { props.number }</label>
            </div>
            <div className="col-md-8">
                <input type="time" name={name} id={id} step="1" required/>
            </div>
        </div>
    );
}
