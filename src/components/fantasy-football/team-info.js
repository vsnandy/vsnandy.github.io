import React, { useState } from 'react';
import Container from 'react-bootstrap/Container';
import Image from 'react-bootstrap/Image';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Dropdown from 'react-bootstrap/Dropdown';
import Carousel from 'react-bootstrap/Carousel';
import Spinner from 'react-bootstrap/Spinner';

import * as espn from '../../api/espn';
import FFLNavbar from './ffl-navbar';
import { LineChart, BarChart } from '../charts/charts';
import { SmallSimpleTable } from '../tables/tables';

import './team-info.css';
import '../charts/charts.css';

const playerImgUrl = "https://a.espncdn.com/combiner/i?img=/i/headshots/nfl/players/full/";
const teamImgUrl = "https://a.espncdn.com/i/teamlogos/nfl/500/";


///////////////
// Functions //
///////////////

// Get a specific players points for game
const getStats = (p, state) => {
  let realGame = p.playerPoolEntry.player.stats.find(s => {
    return (
      s.scoringPeriodId === state.currentMpId &&
      s.seasonId === Number(state.seasonId) &&
      s.statSourceId === 0 && // Real
      s.statSplitTypeId === 1 // Game
    )
  });

  let projectedGame = p.playerPoolEntry.player.stats.find(s => {
    return (
      s.scoringPeriodId === state.currentMpId &&
      s.seasonId === Number(state.seasonId) &&
      s.statSourceId === 1 && // Projected
      s.statSplitTypeId === 1 // Game
    )
  });

  //console.log(p.playerPoolEntry.player.fullName, realGame, projectedGame);

  return {
    realGame: realGame ? realGame : { appliedStats: {}, appliedTotal: 0.0, stats: {} },
    projectedGame: projectedGame ? projectedGame : { appliedStats: {}, appliedTotal: 0.0, stats: {} },
  }
}

// Grab the record and points at the given week
const getRecordAndPoints = (state) => {
  let record = {wins: 0, losses: 0, ties: 0};
  let points = 0;
  let weekRecord = {type: "", streak: 0};
  let weekPoints = {sign: "", points: 0};

  // filter down to matchups containing the team and up until the given week
  const weeks = state.allScores.filter(w => w.matchupPeriodId <= state.currentMpId);

  let matchups = [];
  weeks.forEach(m => {
    if('away' in m && 'home' in m) {
      if(m.away.teamId === state.currentTeam.id) {
        matchups.push({ ...m.away, opp: m.home.teamId, oppPoints: m.home.totalPoints });
      } else if(m.home.teamId === state.currentTeam.id) {
        matchups.push({ ...m.home, opp: m.away.teamId, oppPoints: m.away.totalPoints });
      }
    } else if('away' in m) {
      if(m.away.teamId === state.currentTeam.id) {
        matchups.push({ ...m.away, opp: -1, oppPoints: 0 });
      }
    } else if('home' in m) {
      if(m.home.teamId === state.currentTeam.id) {
        matchups.push({ ...m.home, opp: -1, oppPoints: 0 });
      }
    }
  });

  for(var m of matchups) {
    points += m.totalPoints;
    weekPoints = {
      sign: (m.totalPoints < 0 ? "-" : "+"),
      points: m.totalPoints
    }; // keep setting the week points - will ultimately hold the current week's points

    if(m.opp !== -1) {
      if(m.totalPoints > m.oppPoints) {
        record.wins += 1;
        if(weekRecord.type !== "W") {
          weekRecord.streak = 0;
        }
        weekRecord.type = "W";
        weekRecord.streak += 1;
      } else if(m.totalPoints < m.oppPoints) {
        record.losses += 1;
        if(weekRecord.type !== "L") {
          weekRecord.streak = 0;
        }
        weekRecord.type = "L"
        weekRecord.streak += 1;
      } else {
        record.ties += 1;
        if(weekRecord.type !== "T") {
          weekRecord.streak = 0;
        }
        weekRecord.type = "T";
        weekRecord.streak += 1;
      }
    }
  }

  return {record, points, weekRecord, weekPoints};
}

////////////////
// COMPONENTS //
////////////////

// Weekly matchup dropdown
const MatchupPeriodDropdown = ({ state: {currentMpId, currentTeam, leagueInfo }, setIsLoading, dispatch }) => {
  const changeMpId = async (id) => {
    //console.log(currentMpId, id);
    if(currentMpId !== Number(id)) {
      setIsLoading(true);
      const response = await espn.getTeam(leagueInfo.id, leagueInfo.seasonId, id, currentTeam.id);
      dispatch([
        { field: 'currentTeam', value: response.result.data.team },
        { field: 'currentMember', value: response.result.data.member },
        { field: 'currentMpId', value: Number(id) },
      ]);
      setIsLoading(false);
    }
  }

  return (
    <Container className="p-0" fluid>
      <Dropdown onSelect={(e) => changeMpId(e)}>
        <Dropdown.Toggle size="sm" id="spId-dropdown" variant="dark" />

        <Dropdown.Menu style={{ maxHeight: "300px", overflowY: "auto" }}>
          {Array.apply(null, Array(leagueInfo.status.currentMatchupPeriod)).map((x, i) => {
            if (currentMpId === i+1) { return <Dropdown.Item key={i+1} eventKey={i+1} active>{i+1}</Dropdown.Item>}
            else { return <Dropdown.Item key={i+1} eventKey={i+1}>{i+1}</Dropdown.Item>}
          })}
        </Dropdown.Menu>
      </Dropdown>
    </Container>
  );
}

// team selection dropdown
const TeamsDropdown = ({ state: { teamInfo, leagueInfo, currentMpId, currentTeam }, setIsLoading, dispatch }) => {
  const changeTeam = async (id) => {
    if(currentTeam.id !== Number(id)) {
      setIsLoading(true);
      const response = await espn.getTeam(leagueInfo.id, leagueInfo.seasonId, currentMpId, id);
      dispatch([
        { field: 'currentTeam', value: response.result.data.team },
        { field: 'currentMember', value: response.result.data.member }
      ]);
      setIsLoading(false);
    }
  }

  return (
    <Container className="p-0" fluid>
      <Dropdown onSelect={(e) => changeTeam(e)}>
        <Dropdown.Toggle size="sm" id="dropdown-basic" variant="dark" />

        <Dropdown.Menu style={{ maxHeight: "300px", overflowY: "auto" }}>
          {teamInfo.teams.map((team) => {
            if (team.id === currentTeam.id) { return <Dropdown.Item key={team.id} eventKey={team.id} active>{`${team.location} ${team.nickname}`}</Dropdown.Item>}
            else { return <Dropdown.Item key={team.id} eventKey={team.id}>{`${team.location} ${team.nickname}`}</Dropdown.Item>}
          })}
        </Dropdown.Menu>
      </Dropdown>
    </Container>
  );
}

// team card in the team header
const TeamCard = ({state, state: { currentTeam, currentMember, teamInfo }, setIsLoading, dispatch }) => {
  return (
    <Container className="mt-2 border border-dark bg-light d-flex justify-content-center align-items-center rounded" fluid>
      <Row>
        <Col xs="auto" className="mt-1">
          {currentTeam.logo ? (<Image src={currentTeam.logo.replace('http:', 'https:')} width="50em" />) : (
            <Image src="https://g.espncdn.com/lm-app/lm/img/shell/shield-FFL.svg" width="50em" />
          )}
        </Col>
        <Col xs="auto">
          <Row>
            <Col xs="9" sm="8" md="auto">
              <h3>{currentTeam.location} {currentTeam.nickname}</h3>
            </Col>
            <Col xs="3" sm="4" md="auto" className="mt-1">
              <TeamsDropdown 
                state={state}
                dispatch={dispatch} 
                setIsLoading={setIsLoading}
              />
            </Col>
          </Row>
          <Row>
            <Col>
              <h6 className="text-muted pb-1">
                {currentMember.firstName[0].toUpperCase() + currentMember.firstName.slice(1,)} {" "}
                {currentMember.lastName[0].toUpperCase() + currentMember.lastName.slice(1,)}
              </h6>
            </Col>
          </Row>
        </Col>
      </Row>
    </Container>
  );
}

// Containers for team name/dropdown, week dropdown, record, and total points
const TeamHeader = ({ state, state: { currentTeam }, dispatch, setIsLoading }) => {
  const { record, points, weekRecord, weekPoints } = getRecordAndPoints(state);

  const recordClass = (weekRecord.type === "W" ? "text-success" : (weekRecord.type === "L" ? "text-danger" : "text-warning"));

  const pointsClass = (weekPoints.sign === "+" ? "text-success" : "text-danger");

  return (
    <Row className="display-flex">
      <Col xs="12" sm="8" md="6" className="px-0 mx-auto mx-sm-0">
        <TeamCard
          state={state}
          dispatch={dispatch}
          setIsLoading={setIsLoading}
        />
      </Col>
      <Col xs="12" sm="4" md="2" className="pl-0 pr-0 pl-sm-2">
        <Container className="mt-2 px-0 border border-dark bg-light rounded d-flex flex-column justify-content-center" fluid>
          <Row xs="auto" className="align-items-center justify-content-center">
            <Col xs="auto" className="px-0">
              <h3 className="text-center">Week</h3>
            </Col>
            <Col xs="auto" className="ml-2 px-0">
              <MatchupPeriodDropdown 
                setIsLoading={setIsLoading} 
                state={state}
                dispatch={dispatch} />
            </Col>
          </Row>
          <h5 className="text-center">{state.currentMpId}</h5>
        </Container>
      </Col>
      <Col xs="6" md="2" className="pl-0 pr-1 pl-md-2 pr-md-0">
        <Container className="mt-2 px-0 border border-dark bg-light rounded d-flex flex-column justify-content-center" fluid>
          <h3 className="text-center">Record</h3>
          <h5 className="text-center">
            {record.wins}-{record.losses}-{record.ties} {" "}
            (<span className={recordClass}>{weekRecord.type}{weekRecord.streak}</span>)
          </h5>
        </Container>
      </Col>
      <Col xs="6" md="2" className="pr-0 pl-1 pl-md-2">
        <Container className="mt-2 px-0 border border-dark bg-light rounded d-flex flex-column justify-content-center" fluid>
          <h3 className="text-center">Total Points</h3>
          <h5 className="text-center">
            {points.toFixed(2)} {" "}
            (<span className={pointsClass}>{weekPoints.sign}{weekPoints.points}</span>)
          </h5>
        </Container>
      </Col>
    </Row>
  );
}

// top 3 player carousel
const PlayersCarousel = ({state, state: { currentTeam, constants } }) => {
  // From the rostered players, grab the top 3 performers for the week (who were set in lineup)
  
  // First identify the week's set lineup
  const starters = currentTeam.roster.entries.filter(p => {
    return constants.lineupSlotsMap[p.lineupSlotId].starter;
  });
  
  // Sort the starters by points scored
  const sortedStarters = starters.sort((p1, p2) => {
    return (getStats(p1, state).realGame.appliedTotal - getStats(p2, state).realGame.appliedTotal) * -1;
  });
  
  // return the top 3 scorers for carousel
  const topScorers = sortedStarters.slice(0, 3);

  return (
    <Carousel className="rounded bg-dark border border-dark" interval={5000} keyboard={false} pauseonhover="true">
      {topScorers.map((p, idx) => {
        // grab the headshot url
        const img_src = (
          p.playerPoolEntry.player.lastName === "D/ST" ? 
          `${teamImgUrl}${p.playerPoolEntry.player.proTeamId}.png` :
          `${playerImgUrl}${p.playerId}.png`
        );
        
        return (
          <Carousel.Item
            key={idx}
          >
            <Carousel.Caption style={{ position: 'relative', left: 0, top: 0 }} className="pb-0">
              <h4>{p.playerPoolEntry.player.fullName}</h4>
            </Carousel.Caption>
            <Image
              src={img_src}
              className="d-block mx-auto"
              height="150px"
              rounded
            />
            <Carousel.Caption style={{ position: 'relative', left: 0, top: 0 }} className="pt-2 mb-4">
              <h5>{getStats(p, state).realGame.appliedTotal.toFixed(2)} points</h5>
            </Carousel.Caption>
          </Carousel.Item>
        );
      })}
    </Carousel>
  );
}

///////////////////////
// CHARTS AND TABLES //
///////////////////////

const ScoresChart = ({ state }) => {
  // filter down to matchups containing the team and up until the given week
  const weeks = state.allScores.filter(w => w.matchupPeriodId <= state.currentMpId);

  let matchups = [];
  weeks.forEach(m => {
    if('away' in m && 'home' in m) {
      if(m.away.teamId === state.currentTeam.id) {
        matchups.push({ ...m.away, matchupPeriodId: m.matchupPeriodId, opp: m.home.teamId, oppPoints: m.home.totalPoints });
      } else if(m.home.teamId === state.currentTeam.id) {
        matchups.push({ ...m.home, matchupPeriodId: m.matchupPeriodId, opp: m.away.teamId, oppPoints: m.away.totalPoints });
      }
    } else if('away' in m) {
      if(m.away.teamId === state.currentTeam.id) {
        matchups.push({ ...m.away, matchupPeriodId: m.matchupPeriodId, opp: -1, oppPoints: 0 });
      }
    } else if('home' in m) {
      if(m.home.teamId === state.currentTeam.id) {
        matchups.push({ ...m.home, matchupPeriodId: m.matchupPeriodId, opp: -1, oppPoints: 0 });
      }
    }
  });

  const weekIds = Array.apply(null, Array(state.currentMpId)).map((x, i) => i + 1);

  const inputs = {
    title: "Points For and Against by Week",
    labels: weekIds,
    datasets: [
      {
        label: "Points For",
        data: matchups.map(m => m.totalPoints),
        borderColor: "ForestGreen",
        backgroundColor: "ForestGreen",
        borderWidth: 1,
        fill: false,
        lineTension: 0.4,
      },
      {
        label: "Points Against",
        data: matchups.map(m => m.oppPoints),
        borderColor: "FireBrick",
        backgroundColor: "FireBrick",
        borderWidth: 1,
        fill: false,
        lineTension: 0.4,
      }
    ],
    xTitle: "Week",
    yTitle: "Points",
    ttMode: 'x',
    ttIntersect: false,
    ttPosition: 'average',
    ttTitle: matchups.map(m => {
      const oppTeam = state.teamInfo.teams.find(t => t.id === m.opp);
      return (
        oppTeam
        ? `Week ${m.matchupPeriodId} vs. ${oppTeam.location} ${oppTeam.nickname}`
        : `Week ${m.matchupPeriodId} vs. Bye`
      );
    }),
    /*
    ttAfterTitle: matchups.map(m => {
      const oppTeam = state.teamInfo.teams.find(t => t.id === m.opp);
      return (
        oppTeam 
        ? `${state.currentTeam.location} ${state.currentTeam.nickname} vs. ${oppTeam.location} ${oppTeam.nickname}\n`
        : "Bye\n"
      );
    }),
    */
  };

  return <LineChart inputs={inputs} />
}

// Roster Table
const RosterTable = ({ state }) => {
  const headers = ["SLOT", "PLAYER", "PROJ", "SCORE"]; // Table headers

  const rows = state.currentTeam.roster.entries.sort((a, b) => {
      return (
        state.constants.lineupSlotsMap[a.lineupSlotId].displayOrder - 
        state.constants.lineupSlotsMap[b.lineupSlotId].displayOrder
      )
    }).map((p, idx) => {
      const { realGame, projectedGame } = getStats(p, state);
      return (
        [
          state.constants.lineupSlotsMap[p.lineupSlotId].abbrev,
          <Container className="px-0" fluid>
            <Row className="p-0 m-0">
              <Col xs="4 pl-0" sm="auto" className="d-flex align-items-center">
                {
                  p.playerPoolEntry.player.defaultPositionId === 16 
                  ? <Image src={`${teamImgUrl}${p.playerPoolEntry.player.proTeamId}.png`} width="50px" rounded />
                  : <Image src={`${playerImgUrl}${p.playerId}.png`} width="50px" rounded />
                }
              </Col>
              <Col xs="8 px-0" sm="auto">
                <span className="m-0 align-bottom" style={{ fontSize: '14px' }}>{p.playerPoolEntry.player.fullName}</span>
                <br />
                <span className="m-0 text-muted align-top" style={{ fontSize: '12px' }}>
                  {state.constants.proTeamsMap[p.playerPoolEntry.player.proTeamId].abbrev} {" "}
                  {state.constants.positions[p.playerPoolEntry.player.defaultPositionId].abbrev}
                </span>
              </Col>
            </Row>
          </Container>,
          projectedGame.appliedTotal.toFixed(2),
          realGame.appliedTotal.toFixed(2)
        ]
      );
  });

  return <SmallSimpleTable headers={headers} rows={rows} />;
}



//////////
// HOME //
//////////

// Main function for team info page
const Home = ({ state, dispatch }) => {
  const [isLoading, setIsLoading] = useState(false);
  //const [currentMember, setCurrentMember] = useState(state.teamInfo.members.find(m => m.id === state.currentTeam.primaryOwner));

  return (
    <Container fluid>
      <FFLNavbar state={state} dispatch={dispatch} />
      {isLoading ? (
        <Container className="d-flex justify-content-center mt-2" fluid>
          <Spinner animation="border" />
        </Container>
      ) : (
        <Container fluid>
          <Container fluid>
            <TeamHeader 
              state={state}
              dispatch={dispatch}
              setIsLoading={setIsLoading}
            />
          </Container>
          <Container fluid className="py-2 mt-2">
            <Row>
              <Col xs="12" md="6" className=" px-0 h-100">
                <h5 className="text-center mb-3">Top Scorers for Week {state.currentMpId}</h5>
                <PlayersCarousel state={state} />
              </Col>
              <Col xs="12" md="6" className="py-0 pl-md-2 mt-4 mt-md-0 auto-chart-wrapper">
                <ScoresChart state={state} />
              </Col>
            </Row>
          </Container>
          <Container fluid className="px-0 py-2 mt-2">
            <h5 className="text-center mb-3">Roster for Week {state.currentMpId}</h5>
            <Container fluid className="full-500 table-wrapper px-0">
              <RosterTable state={state} />
            </Container>
          </Container>
        </Container>
      )}
    </Container>
  );
}

export default Home;
