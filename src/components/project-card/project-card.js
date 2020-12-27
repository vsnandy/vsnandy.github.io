import React from 'react';
import { Link } from 'gatsby';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';

import './project-card.css';

// Add all solid FontAwesome icons for use
// access them using -> library.definitions.fas.[icon_name]
library.add(fas);

const ProjectCard = props => {
  return (
    <div className="card-container">
      <Link to={props.details.link}>
        <header className="card-title">
          {props.details.title}
        </header>
        <p className="card-description">
          {props.details.description}
        </p>
        <FontAwesomeIcon className="card-icon" icon={props.details.icon_name} size="3x" />
      </Link>
    </div>
  );
}

export default ProjectCard;