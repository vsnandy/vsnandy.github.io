import React, { useState, usEffect, useReducer } from 'react';
import Container from 'react-bootstrap/Container';

import Layout from '../../components/layout';
import SEO from '../../components/seo';

const Home = () => {
  return (
    <Container fluid>
      <h1 className="text-center my-3">MN COVID Vaccine</h1>
    </Container>
  );
}

const App = () => {
  return (
    <Layout>
      <SEO title="MN COVID" />
      <Home />
    </Layout>
  );
}

export default App;
