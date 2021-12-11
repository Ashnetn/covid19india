import {Component} from 'react'
import Loader from 'react-loader-spinner'
import {Link} from 'react-router-dom'
import Header from '../Header'
import Footer from '../Footer'
import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class About extends Component {
  state = {faqData: [], apiStatus: apiStatusConstants.initial}

  componentDidMount() {
    this.getDataFromApi()
  }

  getDataFromApi = async () => {
    this.setState({apiStatus: apiStatusConstants.inProgress})
    const apiUrl = 'https://apis.ccbp.in/covid19-faqs'
    const response = await fetch(apiUrl)
    if (response.ok) {
      const fetchedData = await response.json()
      this.setState({
        faqData: fetchedData,
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  renderLastUpdatedDate = () => {
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

    const newDate = new Date()
    const lastUpdatedMonth = month[newDate.getMonth()]
    return `Last updated on ${newDate.getDate()} ${lastUpdatedMonth} ${newDate.getFullYear()}`
  }

  renderAboutView = () => {
    const {faqData} = this.state
    return (
      <div className="about-main-container">
        <h1 className="about-head">About</h1>
        <p className="last-updated">{this.renderLastUpdatedDate()}</p>
        <p className="faq-heading">
          COVID-19 vaccines be ready for distribution
        </p>

        <ul className="faq-container" testid="faqsUnorderedList">
          {faqData.faq.map(eachItem => (
            <li className="faq" key={eachItem.qno}>
              <p className="faq-question">{eachItem.question}</p>
              <p className="faq-answer">{eachItem.answer}</p>
            </li>
          ))}
        </ul>
      </div>
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
        were sorry the page ypu requested could not be found <br /> Please go
        back to the homepage
      </p>
      <Link to="/">
        <button type="button" className="failure-view-button">
          Home
        </button>
      </Link>
    </div>
  )

  renderLoadingView = () => (
    <div className="loader-container" testid="aboutRouteLoader">
      <Loader type="TailSpin" color="#007BFF" height="30" width="30" />
    </div>
  )

  renderFullData = () => {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderAboutView()
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
        <div className="about-container">{this.renderFullData()}</div>
        <Footer />
      </>
    )
  }
}

export default About
