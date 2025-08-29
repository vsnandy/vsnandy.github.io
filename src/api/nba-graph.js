import { gql } from '@apollo/client';

export const GET_ALL_STATS_FOR_TEAM = gql`
  query Team($teamAbbr: String!) {
    team(teamAbbr: $teamAbbr) {
        id
        teamName
        teamAbbr
        season
        league
        wins
        loss
        winLossPercent
        finish
        srs
        pace
        relPace
        ortg
        relOrtg
        drtg
        relDrtg
        playoffs
        coaches
        topWs
        topWsPlayer
        ws
    }
  }
`;