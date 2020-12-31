import React from 'react';
import { Link } from 'gatsby';

import DrawerToggleButton from '../sidebar/drawer-toggle-button';
import Logo from '../logo/logo';
import './navbar.css';

const Navbar = props => (
  <header className="navbar">
    <nav className="navbar__navigation">
      <div className="navbar__toggle-button">
        <DrawerToggleButton click={props.drawerClickHandler} />
      </div>
      <div className="navbar__logo"><Logo /></div>
      <div className="spacer" />
      <div className="navbar_navigation-items">
        <ul>
          <li>
            <Link to="/" className="navbar__inactive-item" activeClassName="navbar__active-item">
              Home
            </Link>
          </li>
          <li>
            <Link to="/projects/" className="navbar__inactive-item" activeClassName="navbar__active-item">
              Projects
            </Link>
          </li>
          <li>
            <Link to="/about/" className="navbar__inactive-item" activeClassName="navbar__active-item">
              About
            </Link>
          </li>
          {/*
          <li>
            <Link to="/contact/" className="navbar__inactive-item" activeClassName="navbar__active-item">
              Contact
            </Link>
          </li>
          */}
        </ul>
      </div>
    </nav>
  </header>
);

export default Navbar;