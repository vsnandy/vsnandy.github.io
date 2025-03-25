import React, { useState, useEffect, useReducer } from 'react';
import Container from 'react-bootstrap/Container';

import Layout from '../../components/layout';
import SEO from '../../components/seo';
import NotFound from '../404';

import * as ncaa from '../../api/ncaa';
import { Button } from 'react-bootstrap';

const Home = () => {
  const getSchools = async () => {
    const schools = await ncaa.getAllSchools();
    console.log(schools);
    return schools;
  }

  return (
    <Container fluid>
      <h1 className="text-center my-3">WAPIT</h1>
      <Button onClick={getSchools}>Random School</Button>
    </Container>
  );
}

const App = () => {
  return (
    <Layout>
      <SEO title="WAPIT" />
      <Home />
    </Layout>
  );
}

const AppNotFound = () => (
  <NotFound />
);

export default App;
