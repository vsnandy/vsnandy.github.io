import React, { useState, useReducer, useEffect } from 'react';
import Container from 'react-bootstrap/Container';
import Image from 'react-bootstrap/Image';

import Layout from '../../components/layout';
import SEO from '../../components/seo';
import NotFound from '../404';

//import { SmallSimpleTable } from '../../components/tables/tables';


//////////////////////
// STATE & REDUCERS //
//////////////////////


/////////////////////
// Tables & Charts //
/////////////////////


//////////////////////////
// RENDERING COMPONENTS //
//////////////////////////

const Home = () => {
  return (
    <Container fluid>
      <h1 className="text-center my-3">NFL Analytics</h1>
    </Container>
  );
}

const AppSoon = () => {
  return (
    <Layout>
      <SEO title="NFL Analytics" description="NFL Analytics Project" />
      <Home />
    </Layout>
  );
}

const App = () => (
  <NotFound />
);

export default AppSoon;
