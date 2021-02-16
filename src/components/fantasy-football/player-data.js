import React, { useState, useEffect, useRef } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Image from 'react-bootstrap/Image';
import Spinner from 'react-bootstrap/Spinner';
import ListGroup from 'react-bootstrap/ListGroup';
import Accordion from 'react-bootstrap/Accordion';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { useRanger } from 'react-ranger';

import * as espn from '../../api/espn';
import FFLNavbar from './ffl-navbar';
import * as helper from '../../api/espn-ffl-helper';

///////////////
// CONSTANTS //
///////////////

const positions = ["QB","RB","WR","TE","D/ST","K"];
const playerImgUrl = "https://a.espncdn.com/combiner/i?img=/i/headshots/nfl/players/full/";
const teamImgUrl = "https://a.espncdn.com/i/teamlogos/nfl/500/";

///////////////
// FUNCTIONS //
///////////////

// Get the top scorers for each position
const getTopScorersForWeek = async (state, scoringPeriodId) => {
  let topScorers = {};

  const topScorerArray = await Promise.all(positions.map(async (pos) => {
    return await espn.getTopScorersForWeek(state.leagueId, state.seasonId, scoringPeriodId, pos);
  }));

  positions.forEach((pos, idx) => {
    topScorers[pos] = topScorerArray[idx].result;
  });

  return topScorers;
}

// Get the top positional scorers for a range of weeks
const getTopScorersForWeeks = async (state, scoringPeriodRange) => {
  let topScorers = {};

  const topScorerArray = await Promise.all(positions.map(async (pos) => {
    return await espn.getTopScorersForWeeks(state.leagueId, state.seasonId, scoringPeriodRange[0], scoringPeriodRange[1], pos);
  }));

  positions.forEach((pos, idx) => {
    topScorers[pos] = topScorerArray[idx].result;
  });
  
  return topScorers;
}

// If stat exists, return it else return 0
const Stat = ({ name, vals, nval = 0, align = "left", xs="6", md="3", p="px-0", vtext="text-muted" }) => {
  let val = '';
  vals.forEach(v => v ? val += v : val += nval.toString());
  return (
    <Col xs={xs} md={md} className={p}>
      <p className={`text-${align} m-0`} style={{ fontSize: '14px' }}>
        {name}
      </p>
      <p className={`text-${align} ${vtext} m-0`} style={{ fontSize: '14px' }}>
        {val}
      </p>
    </Col>
  );
}

////////////////
// COMPONENTS //
////////////////

// Component to select a range of weeks
const WeekSelector = ({ state, scoringPeriodRange, setScoringPeriodRange, isMulti, setIsMulti }) => {
  const [values, setValues] = useState(scoringPeriodRange);
  const [multiState, setMultiState] = useState(isMulti);

  const handleRangeSwitch = () => {
    multiState
      ? setValues([values[1]])
      : setValues([1, values[0]]);

    setMultiState(!multiState);
  }

  const handleSubmit = () => {
    setIsMulti(multiState);
    setScoringPeriodRange(values);
  }

  const { getTrackProps, ticks, segments, handles } = useRanger({
    min: state.leagueInfo.status.firstScoringPeriod,
    max: state.currentNFLWeek,
    stepSize: 1,
    tickSize: 1,
    values,
    onChange: setValues
  });

  return (
    <Container fluid>
      <Row className="justify-content-between">
        {multiState
          ? <p className="my-auto">Choose Weeks:</p>
          : <p className="my-auto">Choose Week:</p>
        }
        <Form.Switch 
          id="week-mode-switch"
          label="Multi-Week"
          onChange={handleRangeSwitch}
          className="my-auto"
          defaultChecked={multiState}
        />
        <Button variant="outline-dark" size="sm" className="my-auto" onClick={handleSubmit}>Submit</Button>
      </Row>
      <div
        {...getTrackProps({
          style: {
            height: "4px",
            background: "indianred",
            boxShadow: "inset 0 1px 2px rgba(0,0,0,.6)",
            borderRadius: "2px",
            marginTop: "1em",
            marginBottom: "3em"
          }
        })}
      >
        {ticks.map(({ value, getTickProps }) => (
          <div 
            {...getTickProps({
              style: {
                content: "",
                background: "rgba(0, 0, 0, 0.2)",
                height: "5px",
                width: "2px",
                transform: "translate(-50%, 0.7em)"
              }
            })}
          >
            <div 
              style={{ 
                position: "absolute",
                fontSize: "1em",
                color: "rgba(0, 0, 0, 0.5)",
                top: "100%",
                transform: "translate(-35%, 0.2em)",
                whiteSpace: "nowrap"
              }}
            >
              {value}
            </div>
          </div>
        ))}
        {segments.map(({ getSegmentProps }, i) => (
          <div
            {...getSegmentProps({
              style: {
                background: i === 1 && values.length > 1 ? "maroon" : "#ddd",
                height: "100%"
              }
            })}
          />
        ))}
        {handles.map(({ getHandleProps }) => (
          <button 
            {...getHandleProps({
              style: {
                width: "20px",
                height: "20px",
                outline: "none",
                borderRadius: "100%",
                background: "linear-gradient(to bottom, #eee 45%, #ddd 55%)",
                border: "solid 1px maroon"
              }
            })}
          />
        ))}
      </div>
    </Container>
  );
}

// Component to list Top 5 Scoring Leaders for position
const ScoringLeaders = ({ state, pos, topScorers, isMulti, scoringPeriodRange }) => {
  const PlayerDetails = ({ p }) => {
    const stats = p.combinedStats.realStats.stats;
    const realPoints = p.combinedStats.realStats.appliedTotal;
    const projPoints = p.combinedStats.projStats.appliedTotal;
    const oppStats = p.combinedStats.oppStats;
    let gameDate = null;
    if(!isMulti) {
      const schedule = state.proTeamSchedules.settings.proTeams.find(t => t.id === p.opponents[0].playerTeamId).proGamesByScoringPeriod;
      const game = schedule[p.opponents[0].scoringPeriodId][0];
      gameDate = helper.convertEpochToCST(game.date);
      //console.log(gameDate);
    }

    return (
      <Container fluid>
        <Row className="justify-content-between">
          <Col xs="7" md="8" className="px-0">
            {!isMulti &&
              <div className="mb-2">
                <h6 className="m-0 mb-1">
                  NFL WEEK {scoringPeriodRange[0]}
                </h6>
                <Row className="justify-content-start px-0 mx-0">
                  <Stat 
                    name="OPP" 
                    vals={[p.opponents[0].loc === "away"
                          ? "@" + state.constants.proTeamsMap[p.opponents[0].oppTeamId].abbrev
                          : state.constants.proTeamsMap[p.opponents[0].oppTeamId].abbrev
                        ]}
                  />
                </Row>
              </div>
            }
            {pos === "QB" &&
              <div className="mb-2">
                <h6 className="m-0 mb-1">
                  PASSING
                </h6>
                <Row className="justify-content-start px-0 mx-0">
                  <Stat name="C / A" vals={[stats[1],"/",stats[0]]} nval={"0/0"} md="auto" p="px-0 pr-3" />
                  <Stat name="YDS" vals={[stats[3]]} md="3" />
                  <Stat name="TD" vals={[stats[4]]} md="2" />
                  <Stat name="INT" vals={[stats[20]]} md="2" />
                </Row>
              </div>
            }
            {["QB","RB","WR","TE"].includes(pos) && 
              <div className="mb-2">
                <h6 className="m-0 mb-1">
                  RUSHING
                </h6>
                <Row className="justify-content-start px-0 mx-0">
                  <Stat name="CAR" vals={[stats[23]]} />
                  <Stat name="YDS" vals={[stats[24]]} />
                  <Stat name="TD" vals={[stats[25]]} />
                </Row>
              </div>
            }
            {["RB","WR","TE"].includes(pos) &&
              <div className="mb-2">
                <h6 className="m-0 mb-1">
                  RECEIVING
                </h6>
                <Row className="justify-content-start px-0 mx-0">
                  <Stat name="REC" vals={[stats[53]]} />
                  <Stat name="YDS" vals={[stats[42]]} />
                  <Stat name="TD" vals={[stats[43]]} />
                  <Stat name="TAR" vals={[stats[58]]} />
                </Row>
              </div>
            }
            {["QB","RB","WR","TE"].includes(pos) && 
              <div className="mb-2">
                <h6 className="m-0 mb-1">
                  MISC
                </h6>
                <Row className="justify-content-start px-0 mx-0">
                  <Stat name="2PC" vals={[stats[62]]} />
                  <Stat name="FUML" vals={[stats[72]]} />
                  <Stat name="TD" vals={[stats[10000]]} />
                </Row>
              </div>
            }
            {["D/ST"].includes(pos) && 
              <div className="mb-2">
                <h6 className="m-0 mb-1">
                  DEFENSE / SPECIAL TEAMS
                </h6>
                <Row className="justify-content-start px-0 mx-0 mb-1">
                  <Stat name="TD" vals={[stats[105]]} />
                  <Stat name="INT" vals={[stats[95]]} />
                  <Stat name="FR" vals={[stats[96]]} />
                  <Stat name="SCK" vals={[stats[99]]} />
                </Row>
                <Row className="justify-content-start px-0 mx-0">
                  <Stat name="SFTY" vals={[stats[98]]} />
                  <Stat name="BLK" vals={[stats[97]]} />
                  <Stat name="PA" vals={[stats[120]]} />
                  <Stat name="YA" vals={[stats[127]]} />
                </Row>
              </div>
            }
            {["K"].includes(pos) &&
              <div className="mb-2">
                <h6 className="m-0 mb-1">
                  KICKING
                </h6>
                <Row className="justify-content-start px-0 mx-0 mb-1">
                  <Stat name="FG39 / FGA39" vals={[stats[80], "/", stats[81]]} md="6"/>
                  <Stat name="FG49 / FGA49" vals={[stats[77], "/", stats[78]]} md="6" />
                </Row>
                <Row className="justify-content-start px-0 mx-0 mb-1">
                  <Stat name="FG50+ / FGA50+" vals={[stats[74], "/", stats[75]]} md="6" />
                  <Stat name="FG / FM" vals={[stats[83], "/", stats[84]]} md="6" />
                </Row>
                <Row className="justify-content-start px-0 mx-0">
                  <Stat name="XP / XPA" vals={[stats[86], "/", stats[87]]} md="6" />
                </Row>
              </div>
            }
          </Col>
          <Col xs="5" md="4" className="px-0">
            <h6 className="text-right m-0 mb-1">
              FANTASY
            </h6>
            <Row className="justify-content-end px-0 mx-0 mb-1">
              <Stat 
                name="PROJ" 
                vals={[
                  projPoints.toFixed(2)
                ]}
                align="right" md="6" 
              />
              <Stat 
                name="+/-" 
                vals={[
                  (realPoints-projPoints >= 0)
                  ? "+" + (realPoints-projPoints).toFixed(2)
                  : (realPoints-projPoints).toFixed(2)
                ]} 
                align="right" md="6" 
                vtext={realPoints-projPoints > 0 ? "text-success" : "text-danger"}
              />
            </Row>
            <Row className="justify-content-end mx-0 px-0">
              <Stat 
                name={isMulti ? "AVG OPR" : "OPR"}
                vals={[oppStats.appliedRank.toFixed(2)]}
                align="right" md="6"
              />
              {/* Commenting out since stat is misleading
              <Stat
                name={isMulti ? "AVG OPA" : "OPA"}
                vals={[oppStats.appliedAverage.toFixed(2)]}
                align="right" md="6"
              />*/}
            </Row>
          </Col>
        </Row>
      </Container>
    );
  }

  return (
    <Card border="dark">
      <Card.Header className="px-2 py-1 border-bottom border-dark bg-light">
        <Row className="mx-0 justify-content-between">
          <Card.Text className="my-0 align-self-end text-left" style={{ fontSize: '14px' }}>Player</Card.Text>
          <Card.Title className="m-0" style={{ fontSize: '24px' }}>{pos}</Card.Title>
          <Card.Text className="my-0 align-self-end text-right" style={{ fontSize: '14px' }}>Points</Card.Text>
        </Row>
      </Card.Header>
      <ListGroup variant="flush">
        <Accordion>
          {topScorers[pos].slice(0, 5).map((p, idx) => {
            const img_src = (
              p.player.lastName === "D/ST" ? 
              `${teamImgUrl}${p.player.proTeamId}.png` :
              `${playerImgUrl}${p.id}.png`
            );
            const borderClass = idx === 0 ? 'border-top-0' : idx === 4 ? 'rounded-bottom' : '';
            
            // grab who has the player, check if free agent
            const onTeamId = state.teamInfo.teams.find(t => t.id === p.onTeamId);
            const onTeamAbbrev = onTeamId ? onTeamId.abbrev : "FA";

            return (
              <div key={idx}>
                <Accordion.Toggle 
                  as={ListGroup.Item} 
                  action 
                  variant="light"
                  className={["py-1 mx-0 border-left-0 border-right-0 border-bottom-0", borderClass]} 
                  eventKey={idx+1}
                >
                  <Row>
                    <Image
                      src={img_src}
                      height="35px"
                      rounded
                    />
                    <Col className="ml-1 pl-1">
                      <p style={{ fontSize: '14px' }} className="mb-0 text-dark">
                        {p.player.fullName}
                      </p>
                      <p style={{ fontSize: '12px' }} className="mb-0">
                        {state.constants.proTeamsMap[p.player.proTeamId].abbrev} {" "}
                        {state.constants.positions[p.player.defaultPositionId].abbrev} {" "}
                        ({onTeamAbbrev})
                      </p>
                    </Col>
                    <h6 className="font-weight-normal my-auto text-dark">
                      {p.combinedStats.realStats.appliedTotal.toFixed(2)}
                    </h6>
                  </Row>
                </Accordion.Toggle>
                <Accordion.Collapse eventKey={idx+1}>
                  <Card.Body className="border-top p-2">
                    <PlayerDetails p={p} />
                  </Card.Body>
                </Accordion.Collapse>
              </div>
            );
          })}
        </Accordion>
      </ListGroup>
    </Card>
  );
}

//////////
// HOME //
//////////

const Home = ({ state, dispatch }) => {
  // start with single select & at current Matchup Period
  const [scoringPeriodRange, setScoringPeriodRange] = useState([state.currentNFLWeek]);

  const [topScorers, setTopScorers] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isMulti, setIsMulti] = useState(false);

  useEffect(() => {
    let isCancelled = false;

    const fetchTopScorers = async () => {
      setIsLoading(true);

      let data = {};
      !isMulti 
        ? data = await getTopScorersForWeek(state, scoringPeriodRange)
        : data = await getTopScorersForWeeks(state, scoringPeriodRange);
      
      if(!isCancelled) {
        console.log(data);
        setTopScorers(data);
        setIsLoading(false);
      }
    }

    fetchTopScorers();

    return () => {
      setIsLoading(false);
      isCancelled = true;
    };
  }, [state, isMulti, scoringPeriodRange]);

  return (
    <Container fluid>
      <FFLNavbar state={state} dispatch={dispatch} />
      {isLoading ?
        <Container className="d-flex justify-content-center mt-3" fluid>
          <Spinner animation="border" />
        </Container> : 
        <Container className="mt-3 pb-3" fluid>
          {isMulti 
            ? <h3 className="text-center">Scoring Leaders for Weeks {scoringPeriodRange[0]} &ndash; {scoringPeriodRange[1]}</h3>
            : <h3 className="text-center">Scoring Leaders for Week {scoringPeriodRange[0]}</h3>
          }
          <WeekSelector 
            state={state} 
            scoringPeriodRange={scoringPeriodRange} 
            setScoringPeriodRange={setScoringPeriodRange} 
            isMulti={isMulti}
            setIsMulti={setIsMulti}
          />
          <Row className="my-2">
            {positions.map((pos, idx) => (
              <Col key={idx} xs="12" sm="6" lg="4" className="mt-3">
                <ScoringLeaders {...{state, pos, topScorers, isMulti, scoringPeriodRange}} />
              </Col>
            ))}
          </Row>
        </Container>
      }
    </Container>
  );
}

export default Home;