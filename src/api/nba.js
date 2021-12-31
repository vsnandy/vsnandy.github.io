//const baseURL = 'http://localhost:3000/api/v1/nba';
const baseURL = 'https://vsnandy.loca.lt/api/v1/nba';

// Get player details
export const getPlayerDetails = async (playerName) => {
  const response = await fetch(`${baseURL}/player/${playerName}`);
  if(response.status === 200) {
    const result = await response.json();
    return {
      status: response.status,
      result
    }
  }

  throw new Error('Network response was not ok');
}

// Get league leaders for stat
export const getLeagueLeaders = async (statCategory) => {
  const response = await fetch(`${baseURL}/leaders/${statCategory}`);
  if(response.status === 200) {
    const result = await response.json();
    return {
      status: response.status,
      result
    }
  }

  throw new Error('Network response was not ok');
}

// Get Player Stats
export const getLeagueDashPlayerStats = async () => {
  const response = await fetch(`${baseURL}/leaguedashplayerstats/2021-22/Regular Season`);
  if(response.status === 200) {
    const result = await response.json();
    //console.log(result);
    const stats = result.data['rowSet'].map(row => {
      return (
        row.reduce((stats, field, idx) => {
          stats[result.data['headers'][idx]] = field;
          return stats;
        }, {})
      )
    });

    return {
      status: response.status,
      result: { 
        data: {
          headers: result.data['headers'],
          stats: stats
        }
      }
    }
  }

  throw new Error('Network response was not ok');
}