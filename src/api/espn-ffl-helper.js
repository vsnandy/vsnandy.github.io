/**
 * /api/espn-ffl-helper.js
 *
 * @description:: Helper functions for espn ffl data
*/

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
    totalPoints: topScorers[0].player.stats.find(s => s.statSourceId === 0 && s.statSplitTypeId === 1).appliedTotal
  };
}
