import React, { useEffect, useState } from 'react';
import Spinner from 'react-bootstrap/Spinner';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import ListGroup from 'react-bootstrap/ListGroup';
import Accordion from 'react-bootstrap/Accordion';
import Image from 'react-bootstrap/Image';

import * as nba from '../../api/nba';

import { SimpleTable } from '../tables/tables';
import '../tables/tables.css';

///////////////
// FUNCTIONS //
///////////////

const calcFP = (p) => {
  return p['PTS'] + p['REB']*1.25 + p['AST']*1.5 + p['STL']*2.5 + p['BLK']*2.5 + p['DD2']*3 + p['TD3']*3 + p['TOV']*-1
}

const StatLeaders = ({ stat, period, playerStats }) => {
  const filteredRows = () => {
    const sortedRows = playerStats.stats.sort((a, b) => {
      return (
        ((a[stat]/a['GP']) > (b[stat]/b['GP']) ? -1 : 1)
      )
    }).slice(0, 5);

    const final = sortedRows.map(row => {
      return {
        'PLAYER_ID': row['PLAYER_ID'],
        'PLAYER_NAME': row['PLAYER_NAME'],
        'STAT': (row[stat]/row['GP']).toFixed(1),
        'TEAM': row['TEAM_ABBREVIATION'],
      };
    });
    
    return final;
  }

  const finalRows = filteredRows();

  /*
  return (
    <SimpleTable headers={headers} rows={finalRows} />
  );
  */

  return (
    <Card border="dark" className="mb-4">
      <Card.Header className="px-2 py-1 border-bottom border-dark bg-light">
        <Row className="mx-0 justify-content-between">
          <Card.Text 
            className="my-0 align-self-end text-left"
            style={{ fontSize: '14px' }}
          >
            Player
          </Card.Text>
          <Card.Title
            className="m-0"
            style={{ fontSize: '24px' }}
          >
            {stat}
          </Card.Title>
          <Card.Text 
            className="my-0 align-self-end text-left"
            style={{ fontSize: '14px' }}
          >
            Per Game
          </Card.Text>
        </Row>
      </Card.Header>
      <ListGroup variant="flush">
        <Accordion>
          {finalRows.map((p, idx) => {
            const img_src = `https://cdn.nba.com/headshots/nba/latest/1040x760/${p['PLAYER_ID']}.png`
            const borderClass = idx === 0 ? 'border-top-0': idx === 4 ? 'rounded-bottom': '';

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
                      height="40px"
                      rounded
                    />
                    <Col className="ml-1 pl-1">
                      <p 
                        style={{ fontSize: '14px' }}
                        className="mb-0 text-dark"
                      >
                        {p['PLAYER_NAME']}
                      </p>
                      <p
                        style={{ fontSize: '12px' }}
                        className="mb-0"
                      >
                        {p['TEAM']}
                      </p>
                    </Col>
                    <h6 className="font-weight-normal my-auto text-dark">
                      {p['STAT']}
                    </h6>
                  </Row>
                </Accordion.Toggle>
              </div>
            )
          })}
        </Accordion>
      </ListGroup>
    </Card>
  )
}

const SeasonLeaders = (playerStats) => {
  if(playerStats) {
    return (
      <Container fluid>
        <Row>
          {['PTS', 'REB', 'AST', 'BLK', 'STL', 'FPTS'].map((stat, idx) => {
            return (
              <Col xs='4' key={idx}>
                <StatLeaders 
                  stat={stat} 
                  period='G' 
                  playerStats={playerStats} 
                />
              </Col>
            );
          })}
        </Row>
      </Container>
    );
  } else {
    return null;
  }
}

const LeagueSummary = () => {
  const [playerStats, setPlayerStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Grab Player Stats
  useEffect(() => {
    const fetchPlayerStats = async () => {
      setIsLoading(true);

      const response = await nba.getLeagueDashPlayerStats();
      // Add Yahoo FPTS
      const result = {
        headers: [...response.result.data.headers, 'FPTS'],
        stats: response.result.data.stats.map(p => {
          return {...p, 'FPTS': calcFP(p)}
        })
      }

      //console.log(result)
      //console.log(response.result.data)

      setPlayerStats(result);
      setIsLoading(false);
    }

    fetchPlayerStats();
  }, [])

  return(
    <Container fluid>
      {isLoading ? 
        <Container className="d-flex justify-content-center mt-3" fluid>
          <Spinner animation="border" />
        </Container>
        : SeasonLeaders(playerStats)
      }
    </Container>
  );
}

export default LeagueSummary;