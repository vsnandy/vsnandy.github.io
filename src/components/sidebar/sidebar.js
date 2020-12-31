import React from 'react';
import { Link } from 'gatsby';

import './sidebar.css';

const SideBar = props => {
  let barClasses = ['sidebar'];
  if(props.show) {
    barClasses = ['sidebar', 'open'];
  }
  return (
    <nav className={barClasses.join(' ')}>
      <ul>
        <li><Link to="/" className="inactive-item" activeClassName="active-item">Home</Link></li>
        <li><Link to="/projects" className="inactive-item" activeClassName="active-item">Projects</Link></li>
        <li><Link to="/about" className="inactive-item" activeClassName="active-item">About</Link></li>
      </ul>
    </nav>
  );
}

export default SideBar;