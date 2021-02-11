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
import Overlay from 'react-bootstrap/Overlay';
import Tooltip from 'react-bootstrap/Tooltip';
import { useRanger } from 'react-ranger';

import * as espn from '../../api/espn';
import FFLNavbar from './ffl-navbar';

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

// Get the stats and points, keeping track of multi-week or not
const getPlayerPoints = (p, state, isMulti) => {
  if(isMulti) {
    return p.combinedStats.realStats.appliedTotal.toFixed(2);
  } else {
    return (
      p.player.stats.find(s => {
        return (
          s.statSourceId === 0 && 
          s.statSplitTypeId === 1 && 
          s.seasonId === state.leagueInfo.seasonId
        );
      }).appliedTotal.toFixed(2)
    );
  }
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
    min: 1,
    max: state.leagueInfo.status.currentMatchupPeriod,
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
const ScoringLeaders = ({ state, pos, topScorers, isMulti }) => {
  const PlayerDetails = ({ p }) => {
    return (
      <Container fluid>
        <Row>
          <Col xs="6" sm="4" md="3">
            <h6 className="text-center m-0">PROJ</h6>
            {isMulti
              ? <p className="text-center m-0" style={{ fontSize: '14px' }}>{p.combinedStats.projStats.appliedTotal.toFixed(2)}</p>
              : <p className="text-center m-0" style={{ fontSize: '14px' }}>{p.player.stats.find(s => {
                return (
                  s.statSourceId === 1 && 
                  s.statSplitTypeId === 1 && 
                  s.seasonId === state.leagueInfo.seasonId
                );
              }).appliedTotal.toFixed(2)}</p>
            }
          </Col>
        </Row>
      </Container>
    );
  }

  return (
    <Card border="dark">
      <Card.Header className="px-2 border-bottom border-dark bg-light">
        <Card.Title className="m-0">
          {pos}
        </Card.Title>
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
            return (
              <div key={idx}>
                <Accordion.Toggle 
                  as={ListGroup.Item} 
                  action 
                  variant="light"
                  className={["py-1 border-left-0 border-right-0 border-bottom-0", borderClass]} 
                  eventKey={idx+1}
                >
                  <Row>
                    <Image
                      src={img_src}
                      height="35px"
                      rounded
                    />
                    <Col className="ml-1">
                      <p style={{ fontSize: '14px' }} className="mb-0 text-dark">{p.player.fullName}</p>
                      <p style={{ fontSize: '12px' }} className="mb-0">
                        {state.constants.proTeamsMap[p.player.proTeamId].abbrev} {" "}
                        {state.constants.positions[p.player.defaultPositionId].abbrev}
                      </p>
                    </Col>
                    <h6 className="font-weight-normal my-auto text-dark">
                      {getPlayerPoints(p, state, isMulti)} pts
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
  const [scoringPeriodRange, setScoringPeriodRange] = useState([state.leagueInfo.status.currentMatchupPeriod]);

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
            {positions.map((p, idx) => (
              <Col key={idx} xs="12" sm="6" lg="4" className="mt-3">
                <ScoringLeaders state={state} pos={p} topScorers={topScorers} isMulti={isMulti} />
              </Col>
            ))}
          </Row>
        </Container>
      }
    </Container>
  );
}

export default Home;
