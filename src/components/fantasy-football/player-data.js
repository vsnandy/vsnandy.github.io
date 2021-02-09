import React, { useState, useEffect } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import ListGroup from 'react-bootstrap/ListGroup';

import * as espn from '../../api/espn';
import FFLNavbar from './ffl-navbar';

///////////////
// CONSTANTS //
///////////////

const positions = ["QB","RB","WR","TE","D/ST","K"];

///////////////
// FUNCTIONS //
///////////////

// Set the top scorers for each position
const getTopScorers = async (state, scoringPeriodId) => {
  let topScorers = {};

  const topScorerArray = await Promise.all(positions.map(async (pos) => {
    return await espn.getTopScorers(state.leagueId, state.seasonId, scoringPeriodId, pos);
  }));

  positions.forEach((pos, idx) => {
    topScorers[pos] = topScorerArray[idx].result;
  });

  return topScorers;
}

////////////////
// COMPONENTS //
////////////////

// Component to list Top 5 Scoring Leaders for position
const ScoringLeaders = ({ pos, topScorers }) => {
  console.log(pos, topScorers);
  return (
    <Container fluid>
      <h6>{topScorers[pos].player.fullName}</h6>
    </Container>
  );
}

//////////
// HOME //
//////////

const Home = ({ state, dispatch }) => {
  const [scoringPeriodId, setScoringPeriodId] = useState(state.leagueInfo.status.currentMatchupPeriod);
  const [topScorers, setTopScorers] = useState(getTopScorers(state, scoringPeriodId));

  return (
    <Container fluid>
      <FFLNavbar state={state} dispatch={dispatch} />
      <Container className="mt-4" fluid>
        <Row>
          {positions.map((p, idx) => (
            <Col key={idx} xs="4">
              <h4 className="font-weight-bold text-center">{p}</h4>
              <ScoringLeaders pos={p} topScorers={topScorers} />
            </Col>
          ))}
        </Row>
      </Container>
    </Container>
  );
}

export default Home;
