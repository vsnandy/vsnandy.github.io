import * as helper from './espn-ffl-helper';

const baseURL = 'https://vsnandy.herokuapp.com/api/v1/espn/ffl';
//const baseURL = 'http://localhost:3000/api/v1/espn/ffl';

// Gets the basic league info
export const getBasicLeagueInfo = async (leagueId, seasonId) => {
  const response = await fetch(`${baseURL}/league/${leagueId}/season/${seasonId}/basic`);
  if(response.status === 200) {
    const result = await response.json();
    return {
      status: response.status,
      result
    }
  }

  throw new Error('Network response was not ok');
}

// Gets the league settings
export const getLeagueSettings = async (leagueId, seasonId) => {
  //console.log("Getting league settings");
  const response = await fetch(`${baseURL}/league/${leagueId}/season/${seasonId}/settings`);
  if(response.status === 200) {
    const result = await response.json();
    return {
      status: response.status,
      result
    }
  }

  throw new Error('Network response was not ok');
}

// Get the list of teams and basic info about them (no roster)
export const getTeams = async (leagueId, seasonId) => {
  const response = await fetch(`${baseURL}/league/${leagueId}/season/${seasonId}/teams`);
  if(response.status === 200) {
    const result = await response.json();
    return {
      status: response.status,
      result
    }
  }

  throw new Error('Network response was not ok');
}

// Get weekly matchup data (points by team and roster breakdown)
export const getMatchupsForWeek = async (leagueId, seasonId, scoringPeriodId, matchupPeriodId) => {
  const response = await fetch(`${baseURL}/league/${leagueId}/season/${seasonId}/scoringPeriod/${scoringPeriodId}/matchupPeriod/${matchupPeriodId}`);
  if(response.status === 200) {
    const result = await response.json();
    return {
      status: response.status,
      result
    }
  }

  throw new Error('Network response was not ok');
}

// Get the boxscore by week and roster details for given scoring period
export const getBoxscores = async (leagueId, seasonId, scoringPeriodId) => {
  const response = await fetch(`${baseURL}/league/${leagueId}/season/${seasonId}/scoringPeriod/${scoringPeriodId}/boxscores`);
  if(response.status === 200) {
    const result = await response.json();
    return {
      status: response.status,
      result
    }
  }

  throw new Error('Network response was not ok');
}

// Get the scores for all weeks without roster or team data
export const getAllScores = async (leagueId, seasonId) => {
  const response = await fetch(`${baseURL}/league/${leagueId}/season/${seasonId}/scores`);
  if(response.status === 200) {
    const result = await response.json();
    return {
      status: response.status,
      result
    }
  }

  throw new Error('Network response was not ok');
}

// Get roster for specific team at week
export const getTeam = async (leagueId, seasonId, scoringPeriodId, teamId) => {
  const response = await fetch(`${baseURL}/league/${leagueId}/season/${seasonId}/scoringPeriod/${scoringPeriodId}/team/${teamId}`);
  if(response.status === 200) {
    const result = await response.json();
    return {
      status: response.status,
      result
    }
  }

  throw new Error('Network response was not ok');
}

// Get all players for a given season
export const getAllPlayers = async (seasonId) => {
  const response = await fetch(`${baseURL}/season/${seasonId}/players`);
  if(response.status === 200) {
    const result = await response.json();
    return {
      status: response.status,
      result
    };
  }

  throw new Error('Network response was not ok');
}

// Get player info for season by name
export const getPlayerInfoByName = async (seasonId, playerName) => {
  const response = await fetch(`${baseURL}/season/${seasonId}/player/${playerName}`);
  if(response.status === 200) {
    const result = await response.json();
    return {
      status: response.status,
      result
    };
  }

  throw new Error('Network response was not ok');
}

// Get the top scorers advanced stats for week for a position
export const getTopScorersForWeek = async (leagueId, seasonId, scoringPeriodId, position) => {
  const response = await fetch(`${baseURL}/league/${leagueId}/season/${seasonId}/scoringPeriod/${scoringPeriodId}/position/${encodeURIComponent(position)}/topScorers`);

  if(response.status === 200) {
    const result = await response.json();
    const topScorers = result.data.players;

    return {
      status: response.status,
      result: topScorers
    };
  }

  throw new Error('Network response was not ok');
}

// Get the top positional scorers for a range of weeks
export const getTopScorersForWeeks = async (leagueId, seasonId, startWeek, endWeek, position) => {
  const response = await fetch(`${baseURL}/league/${leagueId}/season/${seasonId}/startWeek/${startWeek}/endWeek/${endWeek}/position/${encodeURIComponent(position)}/topScorers`);

  if(response.status === 200) {
    const result = await response.json();
    const topScorers = result.data.players;

    return {
      status: response.status,
      result: topScorers
    };
  }

  throw new Error('Network response was not ok');
}

// Get the pro team schedules
export const getProTeamSchedules = async (seasonId) => {
  const response = await fetch(`${baseURL}/season/${seasonId}/proTeamSchedules`);

  if(response.status === 200) {
    const result = await response.json();
    
    return {
      status: response.status,
      result
    };
  }

  throw new Error('Network response was not ok');
}

// Get nfl game by season, pro team, and scoring period
export const getProGame = async (seasonId, proTeamId, scoringPeriodId) => {
  const response = await fetch(`${baseURL}/season/${seasonId}/proTeam/${proTeamId}/scoringPeriod/${scoringPeriodId}/game`);

  if(response.status === 200) {
    const result = await response.json();

    return {
      status: response.status,
      result
    };
  }

  throw new Error('Network response was not ok');
}

// Get NFL Games for a week
export const getNFLGamesForWeek = async (seasonId, scoringPeriodId) => {
  const response = await fetch(`${baseURL}/season/${seasonId}/scoringPeriod/${scoringPeriodId}/games`);

  if(response.status === 200) {
    const result = await response.json();

    return {
      status: response.status,
      result
    };
  }

  throw new Error('Network response was not ok');
}

// Get the ESPN sports constant
export const getSports = async () => {
  const response = await fetch(`${baseURL}/web-constants`);
  if(response.status === 200) {
    const result = await response.json();
    
    // make the exports
    return {
      status: response.status,
      result: result.data.kona['nav-data'].teams
    }
  }

  throw new Error('Network response was not ok');
}

// Get the ESPN FFL constants
export const getFflConstants = async() => {
  const response = await fetch(`${baseURL}/web-constants`);
  if(response.status === 200) {
    const result = await response.json();

    return {
      status: response.status,
      result: { 'data': result.data["next_data"].props.pageProps.page.config.constants }
    }
  }

  throw new Error('Network response was not ok');
}

// ------------------- //
// Specific to ffl-bot //
// ------------------- //

export const botGetTopScorersForWeek = async (leagueId, seasonId, scoringPeriodId, position="all") => {
  //console.log("Grabbing topScorersForWeekByPosition: ", leagueId, seasonId, scoringPeriodId, position);
  const response = await fetch(`${baseURL}/league/${leagueId}/season/${seasonId}/scoringPeriod/${scoringPeriodId}/position/${encodeURIComponent(position)}/topScorers`);

  if(response.status === 200) {
    const result = await response.json();
    const topScorers = result.data.players;
    const topScorer = helper.getTopScorer(topScorers);
    
    return {
      status: response.status,
      result: {
        playerName: topScorer.playerName,
        totalPoints: topScorer.totalPoints
      }
    };
  }

  throw new Error('Network response was not ok');
}

export const botGetPlayerStatsForWeek = async (leagueId, seasonId, playerName, scoringPeriodId) => {
  //console.log("Grabbing playerStatsForWeek: ", leagueId, seasonId, scoringPeriodId, playerName);
  // make sure playerName has capitalized first letters
  if(!playerName.toLowerCase().includes("d/st")) {
    playerName = playerName.toLowerCase().split(" ").map((s) => s.charAt(0).toUpperCase() + s.substring(1)).join(" ");
  } else {
    playerName = playerName.toLowerCase().split(" ").map((s, idx) => {
      if(idx === 0) {
        return s.charAt(0).toUpperCase() + s.substring(1);
      } else {
        return s.toUpperCase();
      }
    }).join(" ");
  }
  const response = await fetch(`${baseURL}/league/${leagueId}/season/${seasonId}/scoringPeriod/${scoringPeriodId}/player/${encodeURIComponent(playerName)}`);

  if(response.status === 200) {
    const result = await response.json();
    const playerData = result.data.players[0];

    // result has full list of stats and player data
    // we just need to summarize and return a few things
    const playerPoints = helper.getPlayerPointsForWeek(playerData, scoringPeriodId);

    return {
      status: response.status,
      result: {
        totalPoints: playerPoints
      }
    };
  }

  throw new Error('Network response was not ok');
}
