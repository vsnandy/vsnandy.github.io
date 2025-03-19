import React, { useState } from 'react';
import ListGroup from 'react-bootstrap/ListGroup';
import Container from 'react-bootstrap/Container';
import Image from 'react-bootstrap/Image';
import Card from 'react-bootstrap/Card';
import InputGroup from 'react-bootstrap/InputGroup';
import Form from 'react-bootstrap/Form';

import PlayerModal from './player-modal';

import './player-props.css';

const headshotUrl = 'https://a.espncdn.com/combiner/i?img=/i/headshots/nfl/players/full/';
const notFoundUrl = 'https://a.espncdn.com/combiner/i?img=/i/teamlogos/leagues/500/nfl.png'

const PlayerProps = ({ players, events, slip, setSlip, token, week }) => {
    //console.debug("PROP EVENTS:", events);
    const [filteredPlayers, setFilteredPlayers] = useState([]);
    const [show, setShow] = useState(false);
    const [selectedPlayer, setSelectedPlayer] = useState("");

    const maxSlipId = slip.length === 0 ? 0 : Math.max(...slip.map(prop => prop.id));
    console.log("MAX SLIP ID:", maxSlipId);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const selectPlayer = async (player) => {
        setSelectedPlayer(player["id"]);
        handleShow();
    }

    const submitProps = (props) => {
        console.debug("Adding props to Bet Slip:", props);
        setSlip([...slip, ...props]);
        handleClose();
    }

    const searchPlayers = (event) => {
        if (event.target.value === '') {
            setFilteredPlayers([]);
        } else {
            // Omit inactive players from search (props wouldn't be available)
            const new_players = players.filter(player => {
                const inSearch = player["active"] 
                                    && player["fullName"]
                                    .toLowerCase()
                                    .includes(event.target.value.toLowerCase());
                return inSearch;
            });
            setFilteredPlayers(new_players);
        }
    }

    const PlayerList = () => {
        return (
            <>
                <ListGroup className="player-search-list">
                    { filteredPlayers.map(player => {
                        return (
                            <Container key={player["id"]} className="p-0">
                                <ListGroup.Item action onClick={() => selectPlayer(player)}>
                                    <Container className="player-item">
                                        <Image 
                                            src={headshotUrl + player["id"] + ".png"} 
                                            onError={event => {
                                                event.target.src = notFoundUrl
                                                event.onerror = null
                                            }}
                                            className="mr-2 p-0"
                                            roundedCircle
                                            width="65px"
                                        />
                                        <Container className="player-item-title">
                                            <p className="player-item-name">{player["fullName"]}</p>
                                            <p className="player-item-number">{player["jersey"]}</p>
                                        </Container>
                                    </Container>
                                </ListGroup.Item>
                            </Container>
                        );
                    })}
                </ListGroup>

                <p className="mt-3 mb-0">Players found: {filteredPlayers.length}</p>

                { show && 
                    <PlayerModal 
                        events={events} 
                        selectedPlayer={selectedPlayer} 
                        show={show}
                        handleClose={handleClose} 
                        submitProps={submitProps}
                        maxSlipId={maxSlipId}
                        week={week}
                        token={token}
                    /> 
                }
            </>
        );
    }

    return (
        <Card.Body>
            <InputGroup>
                <Container className="player-search-bar">
                    <Form.Control 
                        aria-label="Default" 
                        aria-describedby="inputGroup-sizing-default" 
                        onChange={searchPlayers} 
                        placeholder="Search for a player..."
                        size="md"
                    />
                    { filteredPlayers.length !== 0  
                        ? <PlayerList />
                        : <></>
                    }
                </Container>
            </InputGroup>
        </Card.Body>
    );
}

export default PlayerProps;