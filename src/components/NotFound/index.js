import {Link} from 'react-router-dom'
import Header from '../Header'
import Footer from '../Footer'
import './index.css'

const NotFound = () => (
  <>
    <Header />
    <div className="failure-view-container">
      <img
        src="https://res.cloudinary.com/ashnet/image/upload/v1638537471/covid19/failure_d7rdoc.svg"
        alt="not-found-pic"
        className="failure-view-image"
      />
      <h1 className="failure-view-head">PAGE NOT FOUND</h1>
      <p className="failure-view-description">
        we are sorry, the page you requested could not be found
      </p>
      <Link to="/">
        <button type="button" className="failure-view-button">
          Home
        </button>
      </Link>
    </div>
    <Footer />
  </>
)

export default NotFound
