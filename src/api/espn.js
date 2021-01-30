const baseURL = 'https://vsnandy.herokuapp.com/espn';
//const baseURL = 'http://localhost:8000/espn';

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

// Get the ESPN sports constant
export const getSports = async () => {
  const response = await fetch(`${baseURL}/web-constants`);
  if(response.status === 200) {
    const result = await response.json();
    
    // make the exports
    return {
      status: response.status,
      result: result.kona['nav-data'].teams
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
      result: { 'data': result["next_data"].props.pageProps.page.config.constants }
    }
  }

  throw new Error('Network response was not ok');
}