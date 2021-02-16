/**
 * /api/espn-ffl-helper.js
 *
 * @description:: Helper functions for espn ffl data
*/

////////////////////////
// Reusable Constants //
////////////////////////

// Player Positions
export const positionsMaps = () => {
  return {
    "all": [0,2,23,4,6],
    "QB": [0],
    "RB": [2],
    "WR": [4],
    "TE": [6],
    "FLEX": [23],
    "D/ST": [16],
    "K": [17]
  };
}

//////////////////////
// Helper Functions //
//////////////////////

// Converts Epoch time to CST
export const convertEpochToCST = (time) => {
  //console.log(time);
  var d = new Date(time);
  //console.log(d);
  var utc = d.getTime() + (d.getTimezoneOffset() * 60000);  //This converts to UTC 00:00
  var nd = new Date(utc + (3600000*-6));
  return nd.toLocaleString();
}

//////////////////////////////
// FFL Bot Helper Functions //
//////////////////////////////

// Return player summary
export const getPlayerSummary = (playerStats) => {
  return {
    id: playerStats.id, // player id
    fullName: playerStats.player.fullName, // full name
    onTeamId: playerStats.onTeamId, // fantasy team
    totalPoints: playerStats.appliedStatTotal, // season points
    defaultPositionId: playerStats.player.defaultPositionId, // default position id
    injuryStatus: playerStats.player.injuryStatus, // injury status (current)
    percentOwned: playerStats.player.ownership.percentOwned.toFixed(2), // own % of player across all leagues (current?)
    percentStarted: playerStats.player.ownership.percentStarted.toFixed(2), // start % of player across all leagues (current?)
    proTeamId: playerStats.player.proTeamId, // NFL team
    positionalRanking: playerStats.ratings["0"].positionalRanking, // positional ranking
    status: playerStats.status, // ON TEAM, FREE AGENT, etc...
    stats: playerStats.player.stats, // all stats for season
  };
}

// Return player points for given week
export const getPlayerPointsForWeek = (playerStats, scoringPeriodId) => {
  return playerStats.player.stats.find(s => s.scoringPeriodId === Number(scoringPeriodId)).appliedTotal.toFixed(2);
}

// Return the top scorer out of a list of top scorers
export const getTopScorer = (topScorers) => {
  return {
    playerName: topScorers[0].player.fullName,
    totalPoints: topScorers[0].player.stats.find(s => s.statSourceId === 0 && s.statSplitTypeId === 1).appliedTotal.toFixed(2)
  };
}
