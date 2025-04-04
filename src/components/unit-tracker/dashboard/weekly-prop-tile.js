import React from 'react';
import Placeholder from 'react-bootstrap/Placeholder';
import Image from 'react-bootstrap/Image';
import ListGroup from 'react-bootstrap/ListGroup';
import Container from 'react-bootstrap/Container';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import { useQuery } from '@tanstack/react-query';
import { FaCircleCheck, FaCircleXmark, FaCircleMinus } from "react-icons/fa6";

import * as api from '../../../api/vsnandy-lambda-api/unit-bet';

import './weekly-prop-tile.css';

const headshotUrl = 'https://a.espncdn.com/combiner/i?img=/i/headshots/nfl/players/full/';
const notFoundUrl = 'https://a.espncdn.com/combiner/i?img=/i/teamlogos/leagues/500/nfl.png'

const footballPlayerStatConstants = api.footballPlayerStatConstants;
const footballGameStatConstants = api.footballGameStatConstants;

export const WeeklyPropTile = ({ bets, bettor, season, players, teams, week, token }) => {
    //console.log("WEEKLY PROP BETS for " + bettor + " - " + season + "#" + week + ":", bets[bettor][season + "#" + week.toString()])

    const fetchEvents = async (week) => {
        const response = await api.getEvents("football", "nfl", week, token);
        return response.result;
    };

    // Get the player count first
    const { data: events, isPending: isPendingEvents } = useQuery({
        queryKey: ['events' + week.toString()],
        queryFn: () => fetchEvents(week),
        gcTime: Infinity
    });

    const PlayerPropTile = ({ bet, events }) => {
        const fetchPlayerById = async (id) => {
            const response = await api.getPlayerById("football", "nfl", id, token);
            return response.result.athlete;
        };

        // Get the player count first
        const { data: player, isPending: isPendingPlayer } = useQuery({
            queryKey: [bet["PROP_ID"]],
            queryFn: () => fetchPlayerById(bet["PROP_ID"]),
            gcTime: Infinity
        });

        //const playerEvent = events["events"].find(e => e["id"] === bet["EVENT_ID"])

        const PlayerPropText = ({ player, bet }) => {
            const prop = bet["BET"];
            const odds = bet["ODDS"];
            const value = bet["VALUE"];

            if (api.footballBooleanProps.includes(prop)) {
                return (
                    <div className="player-prop">
                        <b>{player["fullName"]}</b>
                        <p className="m-0">{footballPlayerStatConstants[prop]}</p>
                        <p className="m-0">{odds}</p>
                    </div>
                );
            } else {
                if (value.startsWith("OVER") || value.startsWith("UNDER")) {
                    return (
                        <div className="player-prop">
                            <b>{value}</b>
                            <p className="m-0">{player["fullName"]} {footballPlayerStatConstants[prop]} O/U</p>
                            <p className="m-0">{odds}</p>
                        </div>
                    );
                } else {
                    return (
                        <div className="player-prop">
                            <b>{value}</b>
                            <p className="m-0">{player["fullName"]} {footballPlayerStatConstants[prop]}</p>
                            <p className="m-0">{odds}</p>
                        </div>
                    );
                }
            }
        }

        return (
            isPendingPlayer ? <ListGroup.Item><Placeholder xs={12} /></ListGroup.Item>
            : (
                <ListGroup.Item>
                    <Container className="prop-item">
                        <div className="player-headshot">
                            <Image 
                                src={headshotUrl + player["id"] + ".png"} 
                                onError={event => {
                                    event.target.src = notFoundUrl
                                    event.onerror = null
                                }}
                                rounded
                                width="60%"
                            />
                        </div>
                        <PlayerPropText player={player} bet={bet} />
                        <div className="outcome-icon">
                            { bet["OUTCOME"] === "Y" 
                                ? <FaCircleCheck color="green" size={25} /> 
                                : <FaCircleXmark color="red" size={25} />
                            }
                        </div>
                    </Container>
                </ListGroup.Item>
            )
        );
    }

    const GamePropTile = ({ bet, events }) => {
        const event = events["events"].find(event => event["id"] === bet["PROP_ID"]);

        return (
            <ListGroup.Item>
                {event["shortName"]}
            </ListGroup.Item>
        );
    }

    const TotalPropTile = ({ bet }) => (
        <ListGroup.Item variant={bet["OUTCOME"] === "Y" ? "success" : "danger"}>
            <Container className="total-prop-item">
                <h4 className="mb-0 total-header">Total: {bet["ODDS"]}</h4>
                <div className="outcome-icon">
                    { bet["OUTCOME"] === "Y" 
                        ? <FaCircleCheck color="green" size={25} /> 
                        : <FaCircleXmark color="red" size={25} />
                    }
                </div>
            </Container>
        </ListGroup.Item>  
    );

    return (
        <Card>
            <ListGroup variant="flush" className="prop-tile-group">
                {bets[bettor][season + "#" + week.toString()].map((bet, idx) => {
                    switch(bet["PROP_TYPE"]) {
                        case "PLAYER": return (
                            isPendingEvents 
                             ? <Placeholder key={idx} xs={12} />
                             : <PlayerPropTile key={idx} bet={bet} events={events} />
                            
                        )
                        case "GAME": return (
                            isPendingEvents
                             ? <Placeholder key={idx} xs={12} />
                             : <GamePropTile key={idx} bet={bet} events={events} />
                        )
                        case "TOTAL": return (
                            isPendingEvents
                             ? <Placeholder key={idx} xs={12} />
                             : <TotalPropTile key={idx} bet={bet} />
                        )
                        default: return <p>DEFAULT</p>
                    }
                })}
            </ListGroup>
        </Card>
    );
}


export const SlipWeeklyPropTile = ({ slip, setSlip, userAttributes, week }) => {

    const removeProp = (id) => {
        // Remove prop with the given id
        console.debug("Removing prop", id);
        const updatedSlip = slip.filter(prop => prop.id !== id);
        setSlip(updatedSlip);
    }

    const PlayerPropTile = ({ prop: { id, prop, player, event} }) => {

        const PlayerPropText = ({ player, bet }) => {
            const prop = bet["BET"];
            const odds = bet["ODDS"];
            const value = bet["VALUE"];

            if (api.footballBooleanProps.includes(prop)) {
                return (
                    <div className="player-prop">
                        <b>{player["fullName"]}</b>
                        <p className="m-0">{footballPlayerStatConstants[prop]}</p>
                        <p className="m-0">{odds}</p>
                    </div>
                );
            } else {
                if (value.startsWith("OVER") || value.startsWith("UNDER")) {
                    return (
                        <div className="player-prop">
                            <b>{value}</b>
                            <p className="m-0">{player["fullName"]} {footballPlayerStatConstants[prop]} O/U</p>
                            <p className="m-0">{odds}</p>
                        </div>
                    );
                } else {
                    return (
                        <div className="player-prop">
                            <b>{value}</b>
                            <p className="m-0">{player["fullName"]} {footballPlayerStatConstants[prop]}</p>
                            <p className="m-0">{odds}</p>
                        </div>
                    );
                }
            }
        }

        return (
            <ListGroup.Item>
                <Container className="prop-item">
                    <div className="player-headshot">
                        <Image 
                            src={headshotUrl + player["id"] + ".png"} 
                            onError={event => {
                                event.target.src = notFoundUrl
                                event.onerror = null
                            }}
                            rounded
                            width="50%"
                        />
                    </div>
                    <PlayerPropText player={player} bet={prop} />
                    <div className="remove-prop-from-tile">
                        <Button variant="none" onClick={() => removeProp(id)}><FaCircleMinus color="#C11B17" size={25} /></Button>
                    </div>
                </Container>
            </ListGroup.Item>
        );
    }

    const GamePropTile = ({ prop: { id, prop, event} }) => {
        const competitions = event["competitions"][0];
        const homeTeam = competitions["competitors"].find(comp => comp["homeAway"] === "home");
        const awayTeam = competitions["competitors"].find(comp => comp["homeAway"] === "away");

        const GamePropText = ({ event, bet }) => {
            const prop = bet["BET"];
            const odds = bet["ODDS"];
            const value = bet["VALUE"];

            return (
                <div className="game-prop">
                    <b>{value}</b>
                    <p className="m-0">{footballGameStatConstants[prop]}</p>
                    <p className="m-0">{odds}</p>
                </div>
            );
        }

        return (
            <ListGroup.Item>
                <Container className="prop-item">
                    <div className="game-teams">
                        <div><Image src={awayTeam["team"]["logo"]} height="35px" /> {awayTeam["team"]["name"]}</div>
                        <div><Image src={homeTeam["team"]["logo"]} height="35px" /> {homeTeam["team"]["name"]}</div>
                    </div>
                    <GamePropText event={event} bet={prop} />
                    <div className="remove-prop-from-tile">
                        <Button variant="none" onClick={() => removeProp(id)}><FaCircleMinus color="#C11b17" size={25} /></Button>
                    </div>
                </Container>
            </ListGroup.Item>
        );
    }

    const TotalPropTile = () => (
        <ListGroup.Item variant="secondary">
            <Container>
                <InputGroup size="lg">
                    <InputGroup.Text id="prop-total">Total</InputGroup.Text>
                    <Form.Control
                        placeholder="-110"
                        aria-label="prop-total"
                        aria-describedby="prop-total"
                    />
                </InputGroup>
            </Container>
        </ListGroup.Item>  
    );

    return (
        <Card.Body>
            <ListGroup className="prop-tile-group">
                <ListGroup.Item variant="secondary"><h4 className="slip-header">{userAttributes["nickname"]}'s Bets for Week {week}</h4></ListGroup.Item>
                { slip.map(prop => {
                    switch(prop.prop["PROP_TYPE"]) {
                        case "PLAYER": return <PlayerPropTile key={prop.id} prop={prop} />;
                        case "GAME": return <GamePropTile key={prop.id} prop={prop} />;
                        default: return <p key={prop.id}>DEFAULT</p>;
                    }
                })}
                <TotalPropTile />
            </ListGroup>
        </Card.Body>
    );
}