import React, { useState } from 'react';
import Container from 'react-bootstrap/Container';

import * as espn from '../../api/espn';
import FFLNavbar from './ffl-navbar';

//////////
// HOME //
//////////

const Home = ({ state, dispatch }) => {
  return (
    <Container fluid>
      <FFLNavbar state={state} dispatch={dispatch} />
    </Container>
  );
}

export default Home;
