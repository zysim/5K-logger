import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import AddTimeForm from './AddTimeForm';
import Times from './Times';

const times = [
    {
        runDate: "2018-01-01",
        lap1: "00:00",
        lap2: "12:30",
        lap3: "23:59",
    },
    {
        runDate: "2018-01-02",
        lap1: "00:00",
        lap2: "12:30",
        lap3: "23:59",
    },
    {
        runDate: "2018-01-03",
        lap1: "00:00",
        lap2: "12:30",
        lap3: "23:59",
    }
];

export default class Main extends Component {
    render() {
        console.log(this.props);
        return (
            <div className="container">
                <div className="row">
                    <div className="col-md-8 offset-md-2">
                        <AddTimeForm csrfToken={this.props.csrfToken} />
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-8 offset-md-2">
                        <div className="card">
                            <div className="card-header">
                                List of Times
                            </div>
                            <Times times={times}/>
                            {/* <Times times={this.props.times}/> */}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

const csrfToken = "EM6sPXNsIJtcVBsVp4T4xue88FlUcjHE2PdsuBCl";
const root = document.getElementById('main');
if (root) {
    ReactDOM.render(<Main csrfToken={csrfToken} times={ root.getAttribute('data-times') }/>, root);
}
