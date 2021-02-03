import React, { useEffect, useReducer } from 'react';
import Container from 'react-bootstrap/Container';
import Spinner from 'react-bootstrap/Spinner';

import Layout from '../../components/layout';
import SEO from '../../components/seo';
import LeagueSearchCard from '../../components/fantasy-football/league-search-card';
import TeamInfo from '../../components/fantasy-football/team-info';
import LeagueOverview from '../../components/fantasy-football/league-overview';
import FFLBot from '../../components/fantasy-football/ffl-bot';


import '../../styles/page.css';

const initialState = {
  leagueId: '',
  seasonId: '',
  page: 'leagueSearch',
  leagueInfo: {},
  teamInfo: {},
  constants: {},
  currentTeam: {},
  currentMpId: null,
  matchupInfo: {},
  allScores: {},
};

/*
const reducer = (state, { field, value }) => {
  console.log(field, value);
  return {
    ...state,
    [field]: value,
  }
}
*/

const reducer = (state, pairs) => {
  //console.log(pairs);
  let newState = {...state};
  pairs.forEach(({ field, value }) => {
    newState = {...newState, [field]: value}
  });

  return newState;
}

const Home = () => {
  // define state vars and functions
  const [state, dispatch] = useReducer(reducer, initialState);
  const { page } = state;

  useEffect(() => {
    //console.log(state);

    // eslint-disable-next-line
  }, [state]);

  const renderPage = () => {
    switch(page) {
      case 'leagueSearch':
        return (
          <Container className="d-flex justify-content-center" fluid>
            <LeagueSearchCard state={state} dispatch={dispatch} />
          </Container>
        );
      case 'leagueOverview':
        return (
          <Container fluid>
            <LeagueOverview state={state} dispatch={dispatch} />
            <FFLBot />
          </Container>
        );
      case 'teamInfo':
        return (
          <Container fluid>
            <TeamInfo state={state} dispatch={dispatch} />
            <FFLBot />
          </Container>
        );
      default:
        return;
    }
  }

  return (
    <Container fluid>
      <h1 className="text-center my-3">ESPN Fantasy Football</h1>
      {renderPage()}
    </Container>
  );
}

const App = () => {
  return (
    <Layout>
      <SEO title="Fantasy Football" />
      <Home />
    </Layout>
  );
}

export default App;