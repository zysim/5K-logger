import React from "react";

export default function LoadingSpinner(props) {
    return (
        <div id="tracker:spinner__container">
            <div id="tracker:spinner__dot_container">
                <div className="tracker:spinner__dot" />
                <div className="tracker:spinner__dot" />
                <div className="tracker:spinner__dot" />
            </div>
        </div>
    );
}
