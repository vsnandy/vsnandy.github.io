/**
 * Layout component that queries for data
 * with Gatsby's useStaticQuery component
 *
 * See: https://www.gatsbyjs.com/docs/use-static-query/
 */

import React from "react"
import PropTypes from "prop-types"

//import Header from "./header"
import Navbar from '../components/navbar/navbar';

import "./layout.css"

const Layout = ({ children }) => {
  return (
    <div
      id="layout"
    >
      <Navbar />
      <main>{children}</main>
      <footer 
        className="footer"
      >
        © {new Date().getFullYear()}, Built with
        {` `}
        <a href="https://www.gatsbyjs.com" style={{ color: 'white' }}>Gatsby</a>
      </footer>
    </div>
  );
}

Layout.propTypes = {
  children: PropTypes.node.isRequired,
}

export default Layout
