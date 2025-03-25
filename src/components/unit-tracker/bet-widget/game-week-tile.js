import React from 'react';
import Card from 'react-bootstrap/Card';
import Image from 'react-bootstrap/Image';
import ListGroup from 'react-bootstrap/ListGroup';
import { GoTriangleLeft, GoTriangleRight } from 'react-icons/go';

import './game-week-tile.css';

const GameDetails = ({ gameStatus, gameStatusDetail, gameTimeList, gameDate, competitions, homeTeam, awayTeam }) => {
    switch (gameStatus) {
        case 'STATUS_SCHEDULED': return (
            <div className="game-details">
                <div className="game-broadcast">{competitions["broadcast"]}</div>
                <div className="game-date">{gameDate.getMonth()+1 + "/" + gameDate.getDate()}</div>
                <div className="game-time">{gameTimeList[0] + ":" + gameTimeList[2]}</div> 
            </div>
        )
        case 'STATUS_FINAL': return (
            <div className="completed-game-details">
                <div className={"team-score" + (homeTeam["winner"] ? " winner" : "")}>
                    <h3 className="mb-0">{homeTeam["score"]}</h3>
                    {homeTeam["winner"] && <GoTriangleLeft size={25} />}
                </div>
                <h5 className="final-score">{gameStatusDetail}</h5>
                <div className={"team-score" + (awayTeam["winner"] ? " winner" : "")}>
                    {awayTeam["winner"] && <GoTriangleRight size={25} />}
                    <h3 className="mb-0">{awayTeam["score"]}</h3>
                </div>
            </div>
        )
        default: return (
            <div className="game-details">
                <div className="game-broadcast">{competitions["broadcast"]}</div>
                <div className="game-date">{gameDate.getMonth()+1 + "/" + gameDate.getDate()}</div>
                <div className="game-time">{gameTimeList[0] + ":" + gameTimeList[2]}</div> 
            </div>
        )
    }
}

const GameInfo = ({ event, onBye }) => {
    const competitions = !onBye ? event["competitions"][0] : null;
    const homeTeam = !onBye ? competitions["competitors"].find(comp => comp["homeAway"] === "home") : null;
    const awayTeam = !onBye ? competitions["competitors"].find(comp => comp["homeAway"] === "away") : null;
    const gameDate = !onBye ? new Date(competitions["date"]) : null;
    const gameTimeList = !onBye ? gameDate.toLocaleTimeString().split(":"): null;
    const gameStatus = !onBye ? event["status"]["type"]["name"] : null;
    const gameStatusDetail = !onBye ? event["status"]["type"]["detail"] : null;

    return (
        <div className="matchup-details">
            <div className="home-team-details">
                <div className="home-team">
                    <h5 className="m-0">{homeTeam["team"]["name"]}</h5>
                    <p className="p-0 m-0 home-team-record">{homeTeam["records"].find(r => r["name"] === "overall")["summary"]}</p>
                </div>
                <Image src={homeTeam["team"]["logo"]} height="50px" />
            </div>
            <GameDetails gameStatus={gameStatus} gameStatusDetail={gameStatusDetail} gameTimeList={gameTimeList} gameDate={gameDate} competitions={competitions} homeTeam={homeTeam} awayTeam={awayTeam} />
            <div className="away-team-details">
                <Image src={awayTeam["team"]["logo"]} height="50px" />
                <div className="away-team">
                    <h5 className="m-0">{awayTeam["team"]["name"]}</h5>
                    <p className="p-0 m-0 away-team-record">{awayTeam["records"].find(r => r["name"] === "overall")["summary"]}</p>
                </div>
            </div>
        </div>
    );
}

export const GameWeekTile = ({ event, onBye, week }) => (
    <Card>
        <Card.Header>
            <Card.Title className="week-header">Week {week}</Card.Title>
        </Card.Header>
        <Card.Body>
            { !onBye ? (
                <div className="game-week-tile">
                    <GameInfo event={event} onBye={onBye} />
                </div>
            ) : (
                <div>Player is on BYE. Please pick a different week to add props.</div>
            )}
        </Card.Body>
    </Card>
)

export const GamePropWeekTile = ({ event, selectGame }) => (
    <ListGroup.Item className="game-item" action variant="secondary" onClick={() => selectGame(event)}>
        <div className="game-week-tile-prop">
            <GameInfo event={event} onBye={false} />
        </div>
    </ListGroup.Item>
)