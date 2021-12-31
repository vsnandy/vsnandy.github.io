import React, { useState, usEffect, useReducer } from 'react';
import Container from 'react-bootstrap/Container';

import Layout from '../../components/layout';
import SEO from '../../components/seo';
import NotFound from '../404';

const Home = () => {
  return (
    <Container fluid>
      <h1 className="text-center my-3">MN COVID Vaccine</h1>
    </Container>
  );
}

const AppSoon = () => {
  return (
    <Layout>
      <SEO title="MN COVID" />
      <Home />
    </Layout>
  );
}

const App = () => (
  <NotFound />
);

export default App;
