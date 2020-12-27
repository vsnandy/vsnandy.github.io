const baseURL = `https://vsnandy.herokuapp.com/football`;

export const getLeagueInfo = async (leagueId, seasonId) => {
  const response = await fetch(`${baseURL}/league/${leagueId}/season/${seasonId}/info`);
  if(response.status === 200) {
    const result = await response.json();
    return { status: response.status, result };
  }

  return { status: response.status, error: "Error" };
}

export const getCurrentTeamsInfo = async (leagueId, seasonId) => {
  const response = await fetch(`${baseURL}/league/${leagueId}/season/${seasonId}/scoringPeriod/18`);
  if(response.status === 200) {
    const result = await response.json();
    return { status: response.status, result };
  }

  return { status: response.status, error: "Error" };
}