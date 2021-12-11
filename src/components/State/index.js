/* eslint-disable jsx-a11y/no-static-element-interactions */
import {Component} from 'react'
import Loader from 'react-loader-spinner'
import {Link} from 'react-router-dom'
import {
  LineChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Line,
  BarChart,
  Bar,
  ResponsiveContainer,
} from 'recharts'
import statesList from '../Home/statesList'
import Header from '../Header'
import Footer from '../Footer'
import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

const activeIdConstants = {
  confirmed: 'CONFIRMED',
  active: 'ACTIVE',
  recovered: 'RECOVERED',
  deceased: 'DECEASED',
  tested: 'TESTED',
}

class State extends Component {
  state = {
    covidData: {},
    apiStatus: apiStatusConstants.initial,
    timelineApiStatus: apiStatusConstants.initial,
    activeId: activeIdConstants.confirmed,
    stateCode: '',
    timelineData: {},
  }

  componentDidMount() {
    this.getDataFromApi()
    this.getTimelineDataFromApi()
  }

  getDataFromApi = async () => {
    this.setState({apiStatus: apiStatusConstants.inProgress})
    const apiUrl = 'https://apis.ccbp.in/covid19-state-wise-data'
    try {
      const response = await fetch(apiUrl)
      if (response.ok) {
        const fetchedData = await response.json()
        const {match} = this.props
        const {params} = match
        const {stateCode} = params
        console.log(fetchedData[stateCode])
        this.setState({
          covidData: fetchedData[stateCode],
          apiStatus: apiStatusConstants.success,
          stateCode,
        })
      } else {
        this.setState({apiStatus: apiStatusConstants.failure})
      }
    } catch (error) {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  getTimelineDataFromApi = async () => {
    const {match} = this.props
    const {params} = match
    const {stateCode} = params
    this.setState({timelineApiStatus: apiStatusConstants.inProgress})
    const apiUrl = `https://apis.ccbp.in/covid19-timelines-data`
    try {
      const response = await fetch(apiUrl)
      if (response.ok) {
        const fetchedData = await response.json()
        this.setState({
          timelineData: fetchedData[stateCode].dates,
          timelineApiStatus: apiStatusConstants.success,
        })
      } else {
        this.setState({timelineApiStatus: apiStatusConstants.failure})
      }
    } catch (error) {
      this.setState({timelineApiStatus: apiStatusConstants.failure})
    }
  }

  setActiveId = event => {
    this.setState({activeId: event.target.id})
  }

  renderCasesInsights = () => {
    const {covidData, activeId} = this.state
    const active =
      covidData.total.confirmed -
      (covidData.total.deceased + covidData.total.recovered)

    return (
      <div className="cases-insights-container">
        <div
          className={`case-status-count-container ${
            activeId === 'CONFIRMED' && 'bg-red'
          }`}
          testid="stateSpecificConfirmedCasesContainer"
          id={activeIdConstants.confirmed}
          onClick={this.setActiveId}
        >
          <p className="case-status red">Confirmed</p>
          <img
            src="https://res.cloudinary.com/ashnet/image/upload/v1638369158/covid19/checkmark_p5fqqh.svg"
            alt="state specific confirmed cases pic"
          />
          <p className="case-count red">{covidData.total.confirmed}</p>
        </div>
        <div
          className={`case-status-count-container ${
            activeId === 'ACTIVE' && 'bg-blue'
          }`}
          testid="stateSpecificActiveCasesContainer"
          id={activeIdConstants.active}
          onClick={this.setActiveId}
        >
          <p className="case-status blue">Active</p>
          <img
            src="https://res.cloudinary.com/ashnet/image/upload/v1638421602/covid19/active-case_siqnx9.svg"
            alt="state specific active cases pic"
          />
          <p className="case-count blue">{active}</p>
        </div>
        <div
          className={`case-status-count-container ${
            activeId === 'RECOVERED' && 'bg-green'
          }`}
          testid="stateSpecificRecoveredCasesContainer"
          id={activeIdConstants.recovered}
          onClick={this.setActiveId}
        >
          <p className="case-status green">Recovered</p>
          <img
            src="https://res.cloudinary.com/ashnet/image/upload/v1638421840/covid19/recovered-case_ffxs8c.svg"
            alt="state specific recovered cases pic"
          />
          <p className="case-count green">{covidData.total.recovered}</p>
        </div>
        <div
          className={`case-status-count-container ${
            activeId === 'DECEASED' && 'bg-grey'
          }`}
          testid="stateSpecificDeceasedCasesContainer"
          id={activeIdConstants.deceased}
          onClick={this.setActiveId}
        >
          <p className="case-status grey">Deceased</p>
          <img
            src="https://res.cloudinary.com/ashnet/image/upload/v1638422045/covid19/deceased-case_maojgz.svg"
            alt="state specific deceased cases pic"
          />
          <p className="case-count grey">{covidData.total.deceased}</p>
        </div>
      </div>
    )
  }

  convertObjectsDataIntoListItemsUsingForInMethod = data => {
    const {activeId} = this.state
    const resultList = []

    const keyNames = Object.keys(data)

    keyNames.forEach(keyName => {
      if (data[keyName]) {
        const {total} = data[keyName]

        const confirmed = total.confirmed ? total.confirmed : 0
        const deceased = total.deceased ? total.deceased : 0
        const recovered = total.recovered ? total.recovered : 0

        resultList.push({
          name: keyName,
          confirmed,
          deceased,
          recovered,
          active: confirmed - (deceased + recovered),
        })
      }
    })
    return resultList.sort(
      (a, b) =>
        parseFloat(b[activeId.toLowerCase()]) -
        parseFloat(a[activeId.toLowerCase()]),
    )
  }

  renderDistrictWiseCount = () => {
    const {covidData, activeId} = this.state
    const districtData = covidData.districts
      ? this.convertObjectsDataIntoListItemsUsingForInMethod(
          covidData.districts,
        )
      : []
    let activeColor = 'red'

    switch (true) {
      case activeId === activeIdConstants.confirmed:
        activeColor = 'red'
        break
      case activeId === activeIdConstants.active:
        activeColor = 'blue'
        break
      case activeId === activeIdConstants.recovered:
        activeColor = 'green'
        break
      case activeId === activeIdConstants.deceased:
        activeColor = 'grey'
        break
      default:
        activeColor = 'red'
    }

    return (
      <>
        <h1 className={`top-districts-head ${activeColor}`}>Top Districts</h1>
        <ul
          className="top-districts-container"
          testid="topDistrictsUnorderedList"
        >
          {districtData.map(eachItem => (
            <li
              className="top-districts"
              key={eachItem[activeId.toLowerCase()]}
            >
              <p className="top-districts-count">
                {eachItem[activeId.toLowerCase()]}
              </p>
              <p className="district-name">{eachItem.name}</p>
            </li>
          ))}
        </ul>
      </>
    )
  }

  convertObjectToList = activeId => {
    const {timelineData} = this.state
    const resultList = []
    const keyNames = Object.keys(timelineData)

    keyNames.forEach(date => {
      let count = 0
      if (activeId === activeIdConstants.active) {
        count =
          timelineData[date].total.confirmed -
          (timelineData[date].total.deceased +
            timelineData[date].total.recovered)
      } else {
        count = timelineData[date].total[activeId.toLowerCase()]
      }

      resultList.push({
        date,
        count,
      })
    })

    return resultList
  }

  renderBarChart = () => {
    const {activeId} = this.state

    let activeColor = 'red'

    switch (true) {
      case activeId === activeIdConstants.confirmed:
        activeColor = '#ff073a'
        break
      case activeId === activeIdConstants.active:
        activeColor = '#007bff'
        break
      case activeId === activeIdConstants.recovered:
        activeColor = '#28a745'
        break
      case activeId === activeIdConstants.deceased:
        activeColor = '#6c757d'
        break
      default:
        activeColor = '#94a3b8'
    }
    const data = this.convertObjectToList(activeId)
    return (
      <div className="chart-container">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data.slice(-10)}>
            <XAxis dataKey="date" stroke={activeColor} fontSize="14" />
            <Tooltip />

            <Bar
              dataKey="count"
              barSize={35}
              fill={activeColor}
              radius={[8, 8, 0, 0]}
              className="bar"
              label={{position: 'top', fontSize: '11', fill: activeColor}}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    )
  }

  renderLineChart = activeId => {
    const data = this.convertObjectToList(activeId)
    let activeColor = ''
    let bgColor = ''

    switch (true) {
      case activeId === activeIdConstants.confirmed:
        activeColor = '#ff073a'
        bgColor = 'bg-red'
        break
      case activeId === activeIdConstants.active:
        activeColor = '#007bff'
        bgColor = 'bg-blue'
        break
      case activeId === activeIdConstants.recovered:
        activeColor = '#28a745'
        bgColor = 'bg-green'
        break
      case activeId === activeIdConstants.deceased:
        activeColor = '#6c757d'
        bgColor = 'bg-grey'
        break
      case activeId === activeIdConstants.tested:
        activeColor = '#9673B9'
        bgColor = 'bg-violet'
        break
      default:
        activeColor = '#94a3b8'
        bgColor = 'bg-grey'
    }

    return (
      <div
        testid="lineChartsContainer"
        className={`chart-container ${bgColor}`}
      >
        <ResponsiveContainer width="100%" height={300}>
          <LineChart
            data={data}
            margin={{top: 5, right: 30, left: 20, bottom: 5}}
          >
            <XAxis dataKey="date" stroke={activeColor} fontSize="11" />
            <YAxis stroke={activeColor} fontSize="11" />
            <Tooltip />
            <Line type="monotone" dataKey="count" stroke={activeColor} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    )
  }

  renderLastUpdatedDate = () => {
    const {covidData} = this.state

    const month = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ]

    const newDate = new Date(covidData.meta.last_updated)
    const lastUpdatedMonth = month[newDate.getMonth()]
    return `Last updated on ${newDate.getDate()} ${lastUpdatedMonth} ${newDate.getFullYear()}`
  }

  renderStateView = () => {
    const {covidData, stateCode} = this.state
    const stateDetails = statesList.find(
      eachState => eachState.state_code === stateCode,
    )
    return (
      <div className="state-main-container">
        <div className="state-title-container">
          <h1 className="state-head">{stateDetails.state_name}</h1>

          <div className="tested-container">
            <p className="tested-text">Tested</p>
            <p className="tested-count">{covidData.total.tested}</p>
          </div>
        </div>
        <p className="last-updated"> {this.renderLastUpdatedDate()}</p>

        {this.renderCasesInsights()}
        {this.renderDistrictWiseCount()}
        {this.renderTimelineView()}
      </div>
    )
  }

  renderTimelineViewData = () => (
    <>
      {this.renderBarChart()}
      <h1 className="about-head">Daily Spread Trends</h1>
      {this.renderLineChart(activeIdConstants.confirmed)}
      {this.renderLineChart(activeIdConstants.active)}
      {this.renderLineChart(activeIdConstants.recovered)}
      {this.renderLineChart(activeIdConstants.deceased)}
      {this.renderLineChart(activeIdConstants.tested)}
    </>
  )

  renderTimelineLoadingView = () => (
    <div className="loader-container" testid="timelinesDataLoader">
      <Loader type="TailSpin" color="#007BFF" height="30" width="30" />
    </div>
  )

  renderTimelineFailureView = () => (
    <div className="failure-view-container">
      <img
        src="https://res.cloudinary.com/ashnet/image/upload/v1638537471/covid19/failure_d7rdoc.svg"
        alt="error"
        className="failure-view-image"
      />
      <h1 className="failure-view-head">DATA NOT FOUND</h1>
      <p className="failure-view-description">
        were sorry the page ypu requested could not be found <br /> Please retry
        again
      </p>

      <button
        type="button"
        className="failure-view-button"
        onClick={this.getTimelineDataFromApi}
      >
        Retry
      </button>
    </div>
  )

  renderTimelineView = () => {
    const {timelineApiStatus} = this.state

    switch (timelineApiStatus) {
      case apiStatusConstants.success:
        return this.renderTimelineViewData()
      case apiStatusConstants.failure:
        return this.renderTimelineFailureView()
      case apiStatusConstants.inProgress:
        return this.renderTimelineLoadingView()
      default:
        return null
    }
  }

  renderFailureView = () => (
    <div className="failure-view-container">
      <img
        src="https://res.cloudinary.com/ashnet/image/upload/v1638537471/covid19/failure_d7rdoc.svg"
        alt="error"
        className="failure-view-image"
      />
      <h1 className="failure-view-head">DATA NOT FOUND</h1>
      <p className="failure-view-description">
        were sorry the page ypu requested could not be found <br /> Please retry
        again
      </p>

      <button
        type="button"
        className="failure-view-button"
        onClick={this.getDataFromApi}
      >
        Retry
      </button>
    </div>
  )

  renderLoadingView = () => (
    <div className="loader-container" testid="stateDetailsLoader">
      <Loader type="TailSpin" color="#007BFF" height="30" width="30" />
    </div>
  )

  renderFullData = () => {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderStateView()
      case apiStatusConstants.failure:
        return this.renderFailureView()
      case apiStatusConstants.inProgress:
        return this.renderLoadingView()
      default:
        return null
    }
  }

  render() {
    return (
      <>
        <Header />
        <div className="state-container">{this.renderFullData()}</div>
        <Footer />
      </>
    )
  }
}

export default State
