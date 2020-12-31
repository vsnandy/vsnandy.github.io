import React from 'react';
import { Link } from 'gatsby';

import './project-card.css';

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
        {props.details.icon}
      </Link>
    </div>
  );
}

export default ProjectCard;