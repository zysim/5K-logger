import * as React from 'react'
import ReactDOM from 'react-dom'

import AddRunForm from './components/AddRunForm'
import RunList from './components/RunList'

export type RunDeets = {
  //
}

type Props = {
  csrfToken: string | null
}

type State = {
  hasError: boolean
  newRunDeets: RunDeets
}

export default class Main extends React.PureComponent<Props> {
  state: State = {
    hasError: false,
    newRunDeets: {},
  }

  public componentDidCatch(error: Error, info: any) {
    console.error("Error caught in Main's boundary:", error, info)
    this.setState({ hasError: true })
  }

  public render() {
    const { csrfToken } = this.props

    if (csrfToken == null) {
      return null
    }

    // Check if we have runs to display
    return (
      <React.Fragment>
        <div className="row">
          <div className="col-md-8 offset-md-2">
            <AddRunForm
              csrfToken={this.props.csrfToken}
              listNewlyRecordedRun={this.listNewlyRecordedRun.bind(this)}
            />
          </div>
        </div>
        <div className="row">
          <div className="col-md-8 offset-md-2">
            <RunList newRunDeets={this.state.newRunDeets} />
          </div>
        </div>
      </React.Fragment>
    )
  }

  /**
   * This method is called in AddRunForm, once a new run is successfully
   * recorded. This updates the `runs` state with the new run, which `RunList`
   * then renders.
   */
  private listNewlyRecordedRun(newRunDeets: RunDeets) {
    this.setState({ newRunDeets })
  }
}

const root = document.getElementById('main')
const csrfToken = document.querySelector('meta[name="csrf-token"]')

if (csrfToken == null) {
  throw Error('CSRF token is null')
}

if (root) {
  ReactDOM.render(<Main csrfToken={csrfToken.textContent} />, root)
}
