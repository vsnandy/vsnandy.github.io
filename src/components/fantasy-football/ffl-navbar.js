import React from 'react';

import './ffl-navbar.css';

const FFLNavbar = props => {
  return (
    <header className="ffl-navbar">
      <nav className="ffl-navbar-navigation">
        <div className="ffl-navbar-items">
          <ul>
            <li>
              <button 
                className={props.classes["Home"]} 
                onClick={() => props.changeView("Home")}
              >
                Home
              </button>
            </li>
            <li>
              <button 
                className={props.classes["League Info"]} 
                onClick={() => props.changeView("League Info")}
              >
                League Info
              </button>
            </li>
            <li>
              <button 
                className={props.classes["Team Info"]}
                onClick={() => props.changeView("Team Info")}
              >
                Team Info
              </button>
            </li>
          </ul>
        </div>
      </nav>
    </header>
  );
}

export default FFLNavbar;