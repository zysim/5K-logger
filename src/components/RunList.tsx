import axios, { AxiosResponse } from 'axios'
import * as React from 'react'
import { RunDeets } from '../Main'
import utilities from '../utils/utilities'
import LoadingSpinner from './LoadingSpinner'
import Run from './Run'

type Props = {
  newRunDeets: RunDeets,
}

type State = {
  hasError: boolean,
  isFetching: boolean,
  runs: any[],
}

export default class RunList extends React.PureComponent<Props, State> {
  /**
   * This fetches a document with `id`.
   *
   * @param string id The ID of the Run document to fetch
   * @deprecated This is now deprecated as the route does not exist anymore
   */
  // async fetchDocument(id) {
  //     try {
  //         const response = await axios.get(`/api/get-run/${id}`, {
  //             headers: {
  //                 "Content-Type": "application/json"
  //             }
  //         })
  //         const run = response.data
  //         return run
  //     } catch (error) {
  //         !this.isCancelled &&
  //             this.setState({ isFetching: false, hasError: true })
  //         throw error
  //     }
  // }
  private isCancelled: boolean = false

  public state: State = { runs: [], hasError: false, isFetching: true }

  public componentDidMount() {
    const uri = '/api/get-run/all'
    axios
      .get(uri, {
        headers: { 'Content-Type': 'application/json' },
      })
      .then((response: AxiosResponse<any>) => {
        !this.isCancelled &&
          this.setState({
            runs: response.data,
            isFetching: false,
          })
      })
      .catch((error: Error) => {
        console.error(`Error fetching runs:\n ${error.name}: ${error.message}`)
        !this.isCancelled &&
          this.setState({
            isFetching: false,
            hasError: true,
          })
      })
  }

  public componentWillUnmount() {
    // Update isCancelled to kill pending fetches
    this.isCancelled = true
  }

  public componentDidCatch(error: Error) {
    console.error('Error caught in RunList boundary:')
    console.error(error)
    this.setState({ isFetching: false, hasError: true })
  }

  // public componentDidUpdate(prevProps: Props) {
  //   // Push the newly-added run to the list
  //   const currentRunDeets = this.props.newRunDeets
  //   if (prevProps.newRunDeets.id !== currentRunDeets.id) {
  //     this.fetchDocument(currentRunDeets.id).then(run => {
  //       !this.isCancelled &&
  //         this.setState(prevState => ({
  //           runs: prevState.runs.concat(run),
  //         }))
  //     })
  //   }
  // }

  public render() {
    // If there's an error
    if (this.state.hasError) {
      return <span>Error lol</span>
    }
    // Run the spinner if we're still fetching shit
    if (this.state.isFetching) {
      return <LoadingSpinner />
    }
    // Check if runs exist and has elements to show
    const runs = utilities.arrayOrBust(this.state.runs)
    return (
      <div className="card" id="run_list_container">
        <div className="card-header" id="run_list_header">
          List of Runs
        </div>
        <div className="card-body" id="run_list_body">
          {(runs && runs.map((run: any) => <Run run={run} key={run.id} summarise={null} />)) ||
            'No runs to show'}
        </div>
      </div>
    )
  }
}
