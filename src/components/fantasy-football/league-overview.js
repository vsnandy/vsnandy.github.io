import React from 'react';
import Container from 'react-bootstrap/Container';

import FFLNavbar from './ffl-navbar';
import { BarChart } from '../charts/charts';
import { SimpleTable } from '../tables/tables';
import '../charts/charts.css';
import '../tables/tables.css';

const WinsChart = ({state: { leagueInfo, teamInfo }}) => {
  const numGames = (
    leagueInfo.status.currentMatchupPeriod > leagueInfo.settings.scheduleSettings.matchupPeriodCount ?
      leagueInfo.settings.scheduleSettings.matchupPeriodCount :
      leagueInfo.status.currentMatchupPeriod
  );

  const inputs = {
    title: `Wins by Team (${numGames} games played)`,
    labels: teamInfo.teams.map(team => {
      const owner = teamInfo.members.find(m => m.id === team.primaryOwner);
      return (
        owner.firstName[0].toUpperCase() + owner.firstName.slice(1,) + " "
        + owner.lastName[0].toUpperCase()
      );
    }),
    datasets: [
      {
        label: "# of Wins",
        data: teamInfo.teams.map(team => team.record.overall.wins),
        backgroundColor: "#8000005F",
        borderColor: "#800000",
        borderWidth: 1,
      }
    ],
    tooltipTitles: teamInfo.teams.map(team => `${team.location} ${team.nickname}`),
    xTitle: "Teams",
    yTitle: "# of Wins",
    maxY: numGames % 2 === 1 ? numGames + 1 : numGames,
  };

  return <BarChart inputs={inputs} />;
}

const PointsChart = ({state: { teamInfo }}) => {
  const inputs = {
    title: "Points Scored by Team (Regular Season)",
    labels: teamInfo.teams.map(team => {
      const owner = teamInfo.members.find(m => m.id === team.primaryOwner);
      return (
        owner.firstName[0].toUpperCase() + owner.firstName.slice(1,) + " "
        + owner.lastName[0].toUpperCase()
      );
    }),
    datasets: [
      {
        label: "Points Scored",
        data: teamInfo.teams.map(team => team.record.overall.pointsFor.toFixed(2)),
        backgroundColor: "#0000005F",
        borderColor: "#000000",
        borderWidth: 1,
      }
    ],
    tooltipTitles: teamInfo.teams.map(team => `${team.location} ${team.nickname}`),
    xTitle: "Teams",
    yTitle: "Points Scored"
  };

  return <BarChart inputs={inputs} />;
}

const Standings = ({state: { leagueInfo, teamInfo }}) => {
  const headers = ["ID", "TEAM", "DIVISION", "RECORD", "WIN%", "GB", "PF", "PA", "STRK"];
  const rows = teamInfo.teams.map(t => {
    return (
      [
        t.id, 
        `${t.location} ${t.nickname}`,
        leagueInfo.settings.scheduleSettings.divisions.find(d => d.id === t.divisionId).name.toUpperCase(),
        `${t.record.overall.wins}-${t.record.overall.losses}-${t.record.overall.ties}`,
        t.record.overall.percentage.toFixed(4),
        t.record.overall.gamesBack,
        t.record.overall.pointsFor.toFixed(2),
        t.record.overall.pointsAgainst.toFixed(2),
        `${t.record.overall.streakType[0]}${t.record.overall.streakLength}`
      ]
    );
  });

  return (
    <SimpleTable headers={headers} rows={rows} />
  );
}

const LeagueOverview = ({ state, dispatch }) => {
  return (
    <Container fluid>
      <FFLNavbar state={state} dispatch={dispatch} />
      <Container style={{ marginBottom: '50px' }} fluid>
        <Container className="half-400 chart-wrapper" fluid>
          <WinsChart state={state} />
        </Container>
        <Container className="half-400 chart-wrapper" fluid>
          <PointsChart state={state} />
        </Container>
        <Container className="d-flex flex-column align-items-center border-top border-bottom border-dark py-3" fluid>
          <h5>Team Standings</h5>
          <Container className="full-400 table-wrapper my-2" fluid>
            <Standings state={state} />
          </Container>
        </Container>
      </Container>
    </Container>
  );
}

export default LeagueOverview;