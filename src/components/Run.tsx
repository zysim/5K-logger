import * as React from 'react'
import { Run as RunT, Time as TimeT } from '../types'
import TimeArray, { divide as TimeDivide } from '../utils/timearray'

type Props = {
  run: RunT,
  summarise: boolean | null,
}

type State = {
  summarise: boolean,
  totalAndMean: {
    total: TimeT,
    mean: TimeT,
  } | null,
}

/**
 * This component holds the list of run dates and their corresponding times.
 * @param {any} props The array of times to list out
 */
export default class Run extends React.PureComponent<Props, State> {
  // There may be a general override for summary rendering
  public state: State = {
    summarise: this.props.summarise || true,
    totalAndMean: null,
  }

  private isCancelled = false

  public componentDidMount() {
    // Calculate the total and mean times once it's mounted
    this.setState({
      totalAndMean: this.getTotalAndMean(this.props.run.lapTimes),
    })
  }

  public componentWillUnmount() {
    this.isCancelled = true
  }

  public render() {
    const { run } = this.props
    const { totalAndMean, summarise } = this.state

    let view
    if (run.lapTimes && summarise && totalAndMean) {
      const total = totalAndMean.total
      const mean = totalAndMean.mean
      // Render a view that shows total and mean times
      view = (
        <div className="time_body">
          <div className="time_body_item">
            <div>Total:</div>
            <div>{this.stringify(total)}</div>
          </div>
          <div className="time_body_item">
            <div>Average:</div>
            <div>{this.stringify(mean)}</div>
          </div>
        </div>
      )
    } else if (run.lapTimes) {
      // Render a list of individual lap times
      // run.lapTimes = [[<minutes>, <seconds>, <milliseconds>], ...]
      view = run.lapTimes.map((t: TimeT, i: number) => (
        <div className="time_body time_body_item" key={i}>
          <div>Lap {i}</div>
          <div>{this.stringify(t)}</div>
        </div>
      ))
    } else {
      // Component was unmounted or something I guess
      view = ''
    }
    return (
      <div className="time_container">
        <h4 className="time_header">{run.runDate || 'Empty'}</h4>
        <div>
          <button className="mx-auto" onClick={this.toggleSummary.bind(this)}>
            <span className={this.state.summarise ? 'summary' : 'detailed'} />
          </button>
        </div>
        {view}
      </div>
    )
  }

  /**
   * Toggles rendering the summary view and the detail view.
   */
  private toggleSummary() {
    this.setState((prevState: State) => ({
      summarise: !prevState.summarise,
    }))
  }

  /**
   * Calculates the total and mean time from the array of individual lap times.
   *
   * @param times{number[][]} The array of individual lap times to calculate
   *
   * @return {number[]} The total and mean times, in that order
   */
  private getTotalAndMean(times: number[][]) {
    // const element = times.map((time: number[]) => time[i]).reduce((sum, t) => sum + t)
    // Get the total for each time element and push to the array
    const summed = times[0].map((_, i) => {
      return times.map((time: number[]) => time[i]).reduce((sum, t) => sum + t)
    })

    // Tidy it up
    const total = TimeArray(summed[0], summed[1], summed[2])
    const mean = TimeDivide(total, times.length)
    return { total, mean }
  }

  /**
   * Renders a time array to a readable string
   *
   * @param time{number[]} The time array
   *
   * @return string A string representing the time for the frontend
   */
  private stringify(time: TimeT) {
    return `${time[0]}m ${time[1]}.${time[2]}s`
  }
}
