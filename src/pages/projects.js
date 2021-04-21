import React from 'react';
import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Container from 'react-bootstrap/Container';
import { Link } from 'gatsby';
import { FaArrowRight } from 'react-icons/fa';

import SEO from '../components/seo';
import Layout from '../components/layout';
import { projects } from '../db/projects-db';

const Projects = () => {
  const PCard = ({ project: { title, category, description, icon, link }}) => (
    <Col xs={12} className="d-flex align-items-stretch justify-content-center">
      <Card bg="light" text="dark" border="dark" className="align-items-center mb-4" style={{'width': '25em'}}>
        <Card.Header className="d-flex container-fluid">
          <Container className="p-0">{category}</Container>
          <Link to={link} className="stretched-link"><FaArrowRight size="1.3em" color="gray" /></Link>
        </Card.Header>
        <Card.Body className="container-fluid">
          <Card.Title className="text-center">{title}</Card.Title>
          <Card.Text className="text-center">{description}</Card.Text>
        </Card.Body>
        {icon}
      </Card>
    </Col>
  );

  return (
    <Container fluid>
      <h1 className="text-center my-3">Projects</h1>
      <Row xs={1} sm={2} lg={3} className="d-flex flex-wrap">
        {projects.map(project => <PCard key={project.id} project={project} /> )}
      </Row>
    </Container>
  );
}

const App = () => (
  <Layout>
    <SEO title="Projects" />
    <Projects />
  </Layout>
);

export default App;