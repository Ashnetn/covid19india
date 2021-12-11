import {Component} from 'react'
import {BsSearch} from 'react-icons/bs'
import {FcGenericSortingAsc, FcGenericSortingDesc} from 'react-icons/fc'
import {BiChevronRightSquare} from 'react-icons/bi'
import Loader from 'react-loader-spinner'
import {Link} from 'react-router-dom'
import statesList from './statesList'
import Header from '../Header'
import Footer from '../Footer'
import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class Home extends Component {
  state = {
    searchInput: '',
    apiStatus: apiStatusConstants.initial,
    covidData: [],
    filteredResultData: [],
    isFiltered: false,
  }

  componentDidMount() {
    this.getCovidDataFromApi()
  }

  convertObjectsDataIntoListItemsUsingForInMethod = data => {
    const resultList = []

    const keyNames = Object.keys(data)

    keyNames.forEach(keyName => {
      if (data[keyName]) {
        const {total} = data[keyName]

        const confirmed = total.confirmed ? total.confirmed : 0
        const deceased = total.deceased ? total.deceased : 0
        const recovered = total.recovered ? total.recovered : 0
        const tested = total.tested ? total.tested : 0
        const population = data[keyName].meta.population
          ? data[keyName].meta.population
          : 0
        resultList.push({
          stateCode: keyName,
          name: statesList.find(state => state.state_code === keyName)
            .state_name,
          confirmed,
          deceased,
          recovered,
          tested,
          population,
          active: confirmed - (deceased + recovered),
        })
      }
    })
    return resultList
  }

  getCovidDataFromApi = async () => {
    this.setState({apiStatus: apiStatusConstants.inProgress})
    const apiUrl = 'https://apis.ccbp.in/covid19-state-wise-data'
    const response = await fetch(apiUrl)
    const fetchedData = await response.json()
    if (response.ok) {
      const covidDataList = this.convertObjectsDataIntoListItemsUsingForInMethod(
        fetchedData,
      )
      console.log(fetchedData)
      this.setState({
        covidData: covidDataList,
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  renderCasesInsights = () => {
    const {covidData} = this.state
    let confirmedCount = 0
    let deceasedCount = 0
    let recoveredCount = 0

    covidData.forEach(state => {
      confirmedCount += state.confirmed
      deceasedCount += state.deceased
      recoveredCount += state.recovered
    })

    const activeCount = confirmedCount - (deceasedCount + recoveredCount)

    return (
      <ul className="cases-insights-container">
        <div
          className="case-status-count-container"
          testid="countryWideConfirmedCases"
        >
          <p className="case-status red">Confirmed</p>
          <img
            src="https://res.cloudinary.com/ashnet/image/upload/v1638369158/covid19/checkmark_p5fqqh.svg"
            alt="country wide confirmed cases pic"
          />
          <p className="case-count red">{confirmedCount}</p>
        </div>

        <div
          className="case-status-count-container"
          testid="countryWideActiveCases"
        >
          <p className="case-status blue">Active</p>
          <img
            src="https://res.cloudinary.com/ashnet/image/upload/v1638421602/covid19/active-case_siqnx9.svg"
            alt="country wide active cases pic"
          />
          <p className="case-count blue">{activeCount}</p>
        </div>
        <div
          className="case-status-count-container"
          testid="countryWideRecoveredCases"
        >
          <p className="case-status green">Recovered</p>
          <img
            src="https://res.cloudinary.com/ashnet/image/upload/v1638421840/covid19/recovered-case_ffxs8c.svg"
            alt="country wide recovered cases pic"
          />
          <p className="case-count green">{recoveredCount}</p>
        </div>
        <div
          className="case-status-count-container"
          testid="countryWideDeceasedCases"
        >
          <p className="case-status grey">Deceased</p>
          <img
            src="https://res.cloudinary.com/ashnet/image/upload/v1638422045/covid19/deceased-case_maojgz.svg"
            alt="country wide deceased cases pic"
          />
          <p className="case-count grey">{deceasedCount}</p>
        </div>
      </ul>
    )
  }

  filterAscending = () => {
    this.setState({isFiltered: false})
  }

  filterDecending = () => {
    this.setState({isFiltered: true})
  }

  filterDataSort = () => {
    const {covidData} = this.state
    const filteredData = covidData.reverse()
    return filteredData
  }

  renderCovidDataTable = () => {
    const {covidData, isFiltered} = this.state
    const filteredData = isFiltered ? this.filterDataSort() : covidData

    return (
      <div className="covid-data-table-container">
        <div className="covid-data-table" testid="stateWiseCovidDataTable">
          <div className="covid-data-table-head">
            <div className="table-head table-head-left width20">
              <div className="states-head-filter ">
                <p> States/UT</p>
                <button
                  type="button"
                  className="datatable-sort-button"
                  testid="ascendingSort"
                  onClick={this.filterAscending}
                >
                  <FcGenericSortingAsc className="datatable-sort-button-icon" />
                </button>
                <button
                  type="button"
                  className="datatable-sort-button"
                  testid="descendingSort"
                  onClick={this.filterDecending}
                >
                  <FcGenericSortingDesc className="datatable-sort-button-icon" />
                </button>
              </div>
            </div>
            <p className="table-head width13">Confirmed</p>
            <p className="table-head width13">Active</p>
            <p className="table-head width13">Recovered</p>
            <p className="table-head width13">Deceased</p>
            <p className="table-head width13">Population</p>
          </div>

          <ul className="covid-data-list">
            {filteredData.map(eachState => (
              <li className="data-table-list-item" key={eachState.stateCode}>
                <p className="table-data table-head-left white width20">
                  {eachState.name}
                </p>
                <p className="table-data red width13">{eachState.confirmed}</p>
                <p className="table-data blue width13">{eachState.active}</p>
                <p className="table-data green width13">
                  {eachState.recovered}
                </p>
                <p className="table-data grey width13">{eachState.deceased}</p>
                <p className="table-data blue-grey width13">
                  {eachState.population}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    )
  }

  onChangeSearchInput = event => {
    this.setState(
      {searchInput: event.target.value},
      this.filterSearchInputResult,
    )
  }

  filterSearchInputResult = () => {
    const {searchInput} = this.state
    const filteredResult = statesList.filter(
      eachItem =>
        searchInput !== '' &&
        eachItem.state_name.toLowerCase().startsWith(searchInput.toLowerCase()),
    )

    this.setState({filteredResultData: filteredResult})
  }

  renderSearchBar = () => {
    const {searchInput, filteredResultData} = this.state

    return (
      <>
        <div className="search-container">
          <div className="search-icon-container">
            <BsSearch className="search-icon" />
          </div>
          <input
            className="search-field"
            type="search"
            value={searchInput}
            placeholder="Enter the State"
            onChange={this.onChangeSearchInput}
          />
        </div>
        {filteredResultData.length > 0 && (
          <ul
            className="search-result-container"
            testid="searchResultsUnorderedList"
          >
            {filteredResultData.map(eachItem => (
              <Link
                key={eachItem.state_code}
                className="link"
                to={`state/${eachItem.state_code}`}
              >
                <li className="search-result">
                  <p className="result-state">{eachItem.state_name}</p>
                  <div className="search-result-code-container">
                    <p className="search-result-code">{eachItem.state_code}</p>
                    <BiChevronRightSquare className="result-icon" />
                  </div>
                </li>
              </Link>
            ))}
          </ul>
        )}
      </>
    )
  }

  renderFailureView = () => (
    <div className="failure-view-container">
      <img
        src="https://res.cloudinary.com/ashnet/image/upload/v1638537471/covid19/failure_d7rdoc.svg"
        alt="error"
        className="failure-view-image"
      />
      <h1 className="failure-view-head">PAGE NOT FOUND</h1>
      <p className="failure-view-description">
        we are sorry the page ypu requested could not be found
      </p>

      <button
        type="button"
        className="failure-view-button"
        onClick={this.getCovidDataFromApi}
      >
        Retry
      </button>
    </div>
  )

  renderLoadingView = () => (
    <div className="loader-container" testid="homeRouteLoader">
      <Loader type="TailSpin" color="#007BFF" height="30" width="30" />
    </div>
  )

  renderFullData = () => {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case apiStatusConstants.success:
        return (
          <>
            {this.renderCasesInsights()}
            {this.renderCovidDataTable()}
          </>
        )
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
        <div className="home-container">
          <div className="main-home-container">
            {this.renderSearchBar()}
            {this.renderFullData()}
          </div>
        </div>
        <Footer />
      </>
    )
  }
}

export default Home
