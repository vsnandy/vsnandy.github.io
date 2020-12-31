import React from 'react';

import SEO from '../components/seo';
import Layout from '../components/layout';
import { projects } from '../db/projects-db';
import ProjectCard from '../components/project-card/project-card';

import '../styles/page.css';

class Projects extends React.Component {
  state = {
    projects: null,
  };

  componentDidMount() {
    this.setState({ projects: projects });
  }

  renderCards = () => {
    if(this.state.projects != null) return this.state.projects.map(project => {
      return <ProjectCard key={project.id} details={project} />
    });

    return <div />;
  }

  render() {
    return (
      <Layout>
        <main className="page">
          <SEO title="Projects" />
          <header className="top-header">Projects</header>
          <div className="project-container">
            {this.renderCards()}
          </div>
        </main>
      </Layout>
    );
  }
}

export default Projects;