import React from 'react';
import { Link } from 'gatsby';

import './logo.css';

// Logo with size passed in
const Logo = props => {
  return (
    <Link to="/" id="my-logo">
      <div className="first-name">Varun&nbsp;</div>
      <div className="last-name">Nandyal</div>
    </Link>
  );
}

export default Logo;