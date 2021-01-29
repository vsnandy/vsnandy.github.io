//const baseURL = `https://vsnandy.herokuapp.com/football`;
const baseURL = 'http://localhost:8000/football';

export const getLeagueInfo = async (leagueId, seasonId) => {
  const response = await fetch(`${baseURL}/league/${leagueId}/season/${seasonId}/info`);
  if(response.status === 200) {
    const result = await response.json();
    return { status: response.status, result };
  }

  return { status: response.status, error: "Error" };
}

export const getCurrentTeamsInfo = async (leagueId, seasonId, spId) => {
  const response = await fetch(`${baseURL}/league/${leagueId}/season/${seasonId}/scoringPeriod/${spId}`);
  if(response.status === 200) {
    const result = await response.json();
    return { status: response.status, result };
  }

  return { status: response.status, error: "Error" };
}