import React, { useState, useReducer, useEffect } from 'react';
import Container from 'react-bootstrap/Container';
import Image from 'react-bootstrap/Image';

import LeagueSummary from '../../components/nba/league-summary';
import Layout from '../../components/layout';
import SEO from '../../components/seo';
import * as nba from '../../api/nba';
import NotFound from '../404';

import { SmallSimpleTable } from '../../components/tables/tables';

//const playerImgUrl = 'https://cdn.nba.com/headshots/nba/latest/1040x760';
//const  playerImgUrl = 'https://ak-static.cms.nba.com/wp-content/uploads/headshots/nba/1610612744/2021/260x190/201939.png'

//////////////////////
// STATE & REDUCERS //
//////////////////////

const initialState = {
  page: 'leagueSummary',
  season: '',
  playerData: {},
};

const reducer = (state, pairs) => {
  //console.log(pairs);
  let newState = {...state};
  pairs.forEach(({ field, value }) => {
    newState = {...newState, [field]: value}
  });

  return newState;
}

/////////////////////
// Tables & Charts //
/////////////////////

const LeagueLeadersTable = () => {
  const [statCategory, setStatCategory] = useState('BLK');
  const [leaders, setLeaders] = useState('');

  useEffect(() => {
    const fetchLeaders = async () => {
      const response = await nba.getLeagueLeaders(statCategory);
      setLeaders(response.result.data);
    }

    fetchLeaders();
  }, [statCategory]);

  if(leaders !== '') {
    const headers = leaders['resultSet']['headers'].slice(1);
    const rows = leaders['resultSet']['rowSet'].map(row => row.slice(1));

    return (
      <SmallSimpleTable headers={headers} rows={rows} />
    );
  } else {
    return null;
  }
}

const FantasyLeadersTable = () => {
  const [leaders, setLeaders] = useState('');

  useEffect(() => {
    const fetchLeaders = async () => {
      const response = await nba.getLeagueDashPlayerStats();
      setLeaders(response.result.data);
    }
    console.log("Fetching player stats!");
    fetchLeaders();
  }, [])

  if(leaders !== '') {
    const ids = []
    
    const headers = leaders['headers'].filter((header, idx) => {
      if (['PLAYER_NAME', 'TEAM_ABBREVIATION', 'GP', 'MIN', 'PTS', 
      'REB', 'AST', 'STL', 'BLK', 'TOV', 'DD2', 'TD3'].includes(header)) {
        ids.push(idx)
      }
      return ['PLAYER_NAME', 'TEAM_ABBREVIATION', 'GP', 'MIN', 'PTS', 
        'REB', 'AST', 'STL', 'BLK', 'TOV', 'DD2', 'TD3'].includes(header);
    });
    //console.log(ids)
    const rows = leaders['rowSet'].map(row => {
      return [<Image
        src={`https://cdn.nba.com/headshots/nba/latest/1040x760/${row[0]}.png`}
        height="35px"
        rounded
      />, ...row.filter((val, idx) => ids.includes(idx))]
    });
    
    //const headers = leaders['headers']
    //const rows = leaders['rowSet']

    return (
      <SmallSimpleTable headers={['IMG', ...headers]} rows={rows} />
    );
  } else {
    return null;
  }
}

//////////////////////////
// RENDERING COMPONENTS //
//////////////////////////

const Home = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { page } = state;

  useEffect(() => {

    // eslint-disable-next-line
  }, [state]);

  const renderPage = () => {
    switch(page) {
      case 'leagueSummary':
        return (
          <Container fluid>
            <LeagueSummary state={state} dispatch={dispatch} />
          </Container>
        );
      default:
        return;
    }
  }

  return (
    <Container fluid>
      <h1 className="text-center my-3">NBA Analytics</h1>
      {renderPage()}
    </Container>
  );
}

const AppSoon = () => {
  return (
    <Layout>
      <SEO title="NBA Analytics" />
      <Home />
    </Layout>
  );
}

const App = () => (
  <NotFound />
);

export default App;
