import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import Container from 'react-bootstrap/Container';
import Card from 'react-bootstrap/Card';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Spinner from 'react-bootstrap/Spinner';
import Image from 'react-bootstrap/Image';

import { GameWeekTile } from '../game-week-tile';
import { PlayerPropsTile } from '../props-tile';

import { getEvent } from '../../utils';
import * as api from '../../../../api/vsnandy-lambda-api';

import './player-modal.css';

const headshotUrl = 'https://a.espncdn.com/combiner/i?img=/i/headshots/nfl/players/full/';
const notFoundUrl = 'https://a.espncdn.com/combiner/i?img=/i/teamlogos/leagues/500/nfl.png'

const PlayerModal = ({ events, selectedPlayer, show, handleClose, submitProps, maxSlipId, week, token }) => {
    const [ props, setProps ] = useState([]);
    const [ maxPropId, setMaxPropId ] = useState(maxSlipId+1);

    const addProp = (player, event) => {
        //console.debug("Adding prop", maxPropId, "to:\n", props);
        setProps([...props, {
            id: maxPropId,
            prop: {
                "BET": "ATTD",
                "ODDS": "-110",
                "PROP_TYPE": "PLAYER",
                "OUTCOME": "TBD",
                "PROP_ID": selectedPlayer,
                "EVENT_ID": event["id"],
                "VALUE": "1"
            },
            player: player,
            event: event,
        }])
        setMaxPropId(maxPropId + 1);
    };

    const removeProp = (id) => {
        // Remove prop with the given id
        //console.debug("Removing prop", id);
        const updatedProps = props.filter(prop => prop.id !== id);
        setProps(updatedProps);
    }

    const updateProp = (id, key, val) => {
        // Update a prop based on inputs
        // Can only update - BET, VALUE, ODDS
        // TODO: KEEP INDEX
        const updateIndex = props.map(prop => prop.id).indexOf(id);
        const propToUpdate = props.find(prop => prop.id === id);
        propToUpdate["prop"][key] = val;
        let newProps = props;
        //console.debug("OLD PROPS:", newProps);
        newProps[updateIndex] = propToUpdate;
        //console.debug("NEW PROPS:", newProps);
        setProps(newProps);
    }

    const fetchPlayerById = async (id) => {
        console.debug("[PLAYER MODAL] -- Fetching Player:", id);
        const response = await api.getPlayerById("football", "nfl", id, token);
        //console.debug(response.result.athlete);
        return response.result.athlete;
    };

    // Get the player count first
    const { data: player, isPending: isPendingPlayer } = useQuery({
        queryKey: [selectedPlayer],
        queryFn: () => fetchPlayerById(selectedPlayer),
        gcTime: Infinity
    });

    const playerId = player?.id

    const { data: playerEvent, isPending: isPendingEvent } = useQuery({
        queryKey: [selectedPlayer + "#event"],
        queryFn: () => getEvent(events, player),
        gcTime: Infinity,
        enabled: !!playerId
    });

    console.debug("Pending:", isPendingPlayer, " || ", isPendingEvent);

    return ( isPendingPlayer || isPendingEvent
        ? <Spinner size="lg" />
        : (
            <Modal show={show} onHide={handleClose} animation={false} centered keyboard dialogClassName="player-modal">
                <Modal.Header closeButton>
                    <Modal.Title className="w-100 modal-title">
                        + Player Prop
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body className="modal-stat-body">
                    <Image 
                        src={headshotUrl + player["id"] + ".png"} 
                        onError={event => {
                            event.target.src = notFoundUrl
                            event.onerror = null
                        }}
                        className="mr-2 p-0"
                        rounded
                        height="150px"
                    />
                    <Container>
                        <div className="modal-first-name">{player["firstName"].toUpperCase()}</div>
                        <div className="modal-last-name">{player["lastName"].toUpperCase()}</div>
                        <div className="modal-player-info">
                            <div className="team-name">
                                <div className="mr-3">{player["team"]["displayName"]}</div>
                                <Image src={player["team"]["logos"][0]["href"]} width="25px" />
                            </div>
                            <div className="pr-5">#{player["jersey"]}</div>
                            <div>{player["position"]["name"]}</div>
                        </div>
                    </Container>
                    <Container className="modal-stats">
                        <Card>
                            <Card.Header 
                                style={{ background: "#" + player["team"]["color"], color: "white" }}
                                className="modal-stat-header"
                            >
                                {player["statsSummary"]["displayName"].toUpperCase()}
                            </Card.Header>
                            <Card.Body>
                                <div className="modal-stat-card-body">
                                    { player["statsSummary"].hasOwnProperty("statistics") && player["statsSummary"]["statistics"].map(stat => {
                                        return (
                                            <div key={stat["abbreviation"]}>
                                                <div className="stat-abbr">{stat["abbreviation"]}</div>
                                                <div className="stat-val">{stat["value"].toFixed(1).replace(/[.,]0$/, "")}</div>
                                                <div className="stat-rank">{stat["rankDisplayValue"]}</div>
                                            </div>
                                        )
                                    })}
                                </div>
                            </Card.Body>
                        </Card>
                    </Container>
                </Modal.Body>
                <Modal.Body>
                    <GameWeekTile 
                        event={playerEvent[0]} 
                        onBye={playerEvent[1]} 
                        week={week} 
                    />
                    { 
                        !playerEvent[1] && 
                        <PlayerPropsTile 
                            player={player}
                            playerEvent={playerEvent[0]}
                            props={props}
                            addProp={addProp} 
                            removeProp={removeProp}  
                            updateProp={updateProp}
                        />
                    }
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={() => submitProps(props)}>
                        Save Changes
                    </Button>
                </Modal.Footer>
            </Modal>
        )
    );
}

export default PlayerModal;