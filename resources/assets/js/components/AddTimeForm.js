import React, { Component } from 'react';

import FormElement from './FormElement';

/**
 * This component contains the form that is used to record a new set of running
 */
export default class AddTimeForm extends Component {
    render() {
        return (
            <form action="/add-new-time" method="post">
                <input type="hidden" name="_token" value={this.props.csrfToken}/>
                <div className="card">
                    <div className="card-header">
                        Add A New Run
                    </div>
                    <div className="row px-3 py-1">
                        <div className="col-md-4">
                            <label htmlFor="#run-date">Date of run</label>
                        </div>
                        <div className="col-md-8">
                            <input type="date" name="run_date" id="run-date"/>
                        </div>
                    </div>

                    {/* Input that holds each lap time. Should name this better */}
                    <FormElement number={1} />
                    <FormElement number={2} />
                    <FormElement number={3} />

                    <div className="row px-3 py-1">
                        <div className="col-md-1">
                            <input type="submit" className="pull-right" value="Add"/>
                        </div>
                    </div>
                </div>
            </form>
        );
    }
}
