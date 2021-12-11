import {Component} from 'react'
import {Link, NavLink} from 'react-router-dom'
import {RiCloseCircleFill} from 'react-icons/ri'
import './index.css'

class Header extends Component {
  state = {isClicked: false}

  showAndHideMenu = () => {
    this.setState(prevState => ({isClicked: !prevState.isClicked}))
  }

  render() {
    const {isClicked} = this.state
    const menu = isClicked && (
      <div className="mobile-navbar-menu">
        <div className="mobile-menu">
          <ul className="mobile-navlink-container">
            <Link className="link" to="/">
              <li className="mobile-navlink">Home</li>
            </Link>
            <Link className="link" to="/about">
              <li className="mobile-navlink">About</li>
            </Link>
          </ul>
          <button
            type="button"
            className="navbar-menu-button"
            onClick={this.showAndHideMenu}
          >
            <RiCloseCircleFill className="close-icon" />
          </button>
        </div>
      </div>
    )
    return (
      <>
        <div className="navbar-container">
          <div className="navbar">
            <Link className="link" to="/">
              <h1 className="logo">COVID19INDIA</h1>
            </Link>
            <ul className="navlink-container">
              <li className="navlink">
                <NavLink
                  to="/"
                  className="link"
                  activeClassName="navlink-active"
                >
                  Home
                </NavLink>
              </li>
              <li className="navlink">
                <NavLink
                  to="/about"
                  className="link"
                  activeClassName="navlink-active"
                >
                  About
                </NavLink>
              </li>
            </ul>

            <button
              type="button"
              className="navbar-menu-button"
              onClick={this.showAndHideMenu}
            >
              <img
                className="navbar-menu-icon"
                src="https://res.cloudinary.com/ashnet/image/upload/v1638335452/covid19/navbar-mobile-menu-icon_trcdwq.svg"
                alt="menu-icon"
              />
            </button>
          </div>
        </div>
        {menu}
      </>
    )
  }
}

export default Header
