import React, { useState, useReducer, useEffect } from 'react';
import Container from 'react-bootstrap/Container';
import Image from 'react-bootstrap/Image';
import Spinner from 'react-bootstrap/Spinner';

import Layout from '../../components/layout';
import LeagueSummary from '../../components/nba/league-summary';
import SEO from '../../components/seo';
import * as nba from '../../api/vsnandy-lambda-api';
import PaginationControls from '../../components/PaginationControls';

import { SmallSimpleTable } from '../../components/tables/tables';

const playerImgUrl = 'https://a.espncdn.com/combiner/i?img=/i/headshots/nba/players/full/';

//////////////////////
// STATE & REDUCERS //
//////////////////////

const PAGE_SIZE = 25;

const initialState = {
  page: 'playerDashboard',
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

function formatDate(isoString) {
  const date = new Date(isoString);

  const month = date.getUTCMonth() + 1; // months are 0-based
  const day = date.getUTCDate();
  const year = date.getUTCFullYear();

  return `${month}/${day}/${year}`;
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

    return null;
    /*
    return (
      <SmallSimpleTable headers={headers} rows={rows} />
    );
    */
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

    return null;
    /*
    return (
      <SmallSimpleTable headers={['IMG', ...headers]} rows={rows} />
    );
    */
  } else {
    return null;
  }
}

const PlayerDashboard = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [players, setPlayers] = useState([])
  const headers = ["displayName", "weight", "displayHeight", "age", "dateOfBirth", "birthPlace", "jersey", "active"];
  const [rows, setRows] = useState([]);

  useEffect(() => {
    setIsLoading(true);
    const setPlayerRecords = (init_players) => {
      const init_rows = init_players.map(p => {
        const fallbacks = [
          `${playerImgUrl}${p.id}.png&w=350&h=254`,
          `https://a.espncdn.com/combiner/i?img=/i/headshots/mens-college-basketball/players/full/${p.id}.png&w=350&h=254`,
          "https://secure.espncdn.com/combiner/i?img=/i/headshots/nophoto.png"
        ];

        const row = [<Image 
          key={p.id}
          src={fallbacks[0]} 
          data-index="0"
          onLoad={(e) => {
            e.currentTarget.dataset.index = "0";
          }}
          onError={(e) => {
            const img = e.currentTarget;
            const index = Number(img.dataset.index || 0) + 1;

            if (index < fallbacks.length) {
              img.dataset.index = index.toString();
              img.src = fallbacks[index];
            } else {
              img.onerror = null;
            }
          }}
          height="50px" 
          />
        ];

        for (const header of headers) {
          let val = p[header];
          if (typeof(val) === "object") {
            val = Object.values(val).join(", ");
          }

          if (typeof(val) === "boolean") {
            val ? val = "Yes" : val = "No";
          }

          if (header === 'dateOfBirth') {
            val = p[header] ? formatDate(p[header]) : "";
          }

          row.push(val);
        }

        return row;
      });

      setRows(init_rows);
    }

    const fetchPlayers = async () => {
      if (players.length === 0) {
        const response = await nba.getAthletes("basketball", "nba", 1000, 1, "");
        setPlayers(response.result.players);
        setPlayerRecords(response.result.players);
      }
    }

    fetchPlayers();
    setIsLoading(false);
  }, []);

  if (players.length > 0 && rows.length > 0 && !isLoading) {
    return (
      <Container fluid>
        <PaginationControls page={page} pageSize={PAGE_SIZE} total={players.length} onPageChange={setPage} />
        <SmallSimpleTable 
          headers={["Headshot", ...headers]}
          rows={rows.slice((PAGE_SIZE) * (page - 1), (PAGE_SIZE) * (page - 1) + PAGE_SIZE)}
        />
      </Container>
    );
  } else {
    console.log("Loading...");
    return (
      <Container fluid className="d-flex justify-content-center my-5">
        <Spinner as="span" animation="border" size="lg" role="status" aria-hidden="true" />
      </Container>
    );
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
      case 'playerDashboard':
        return (
          <Container fluid>
            <PlayerDashboard />
          </Container>
        )
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

const App = () => {
  return (
    <Layout>
      <SEO title="NBA Analytics" description="NB Analytics Project" />
      <Home />
    </Layout>
  );
}

export default App;
