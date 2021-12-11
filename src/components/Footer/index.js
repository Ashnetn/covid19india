import {VscGithubAlt} from 'react-icons/vsc'
import {FiInstagram} from 'react-icons/fi'
import {FaTwitter} from 'react-icons/fa'
import './index.css'

export default function Footer() {
  return (
    <div className="footer">
      <h1 className="logo">COVID19INDIA</h1>
      <p className="footer-description">
        We stand with everyone fighting on the front lines
      </p>
      <ul className="footer-logo-container">
        <li>
          <VscGithubAlt className="footer-icon" />
        </li>
        <li>
          <FiInstagram className="footer-icon" />
        </li>
        <li>
          <FaTwitter className="footer-icon" />
        </li>
      </ul>
    </div>
  )
}
