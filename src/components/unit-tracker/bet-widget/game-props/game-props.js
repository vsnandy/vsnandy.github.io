import React, { useState } from 'react';
import ListGroup from 'react-bootstrap/ListGroup';
import Card from 'react-bootstrap/Card';

import { GamePropWeekTile } from '../game-week-tile';
import GameModal from './game-modal';

import './game-props.css';

const GameProps = ({ events, slip, setSlip, token, week }) => {
    const [show, setShow] = useState(false);
    const [selectedGame, setSelectedGame] = useState({})

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const selectGame = (event) => {
        setSelectedGame(event);
        handleShow();
    }

    const maxSlipId = slip.length === 0 ? 0 : Math.max(...slip.map(prop => prop.id));

    const submitProps = (props) => {
        console.debug("Adding props to Bet Slip:", props);
        setSlip([...slip, ...props]);
        handleClose();
    }

    return (
        <Card.Body>
            <h3 className="game-week-header">Week {week} Games</h3>
            <ListGroup variant="flush">
                { events.events.map(event => <GamePropWeekTile key={event.id} event={event} selectGame={selectGame} />) }
            </ListGroup>
            { show && 
                <GameModal 
                    event={selectedGame}
                    show={show}
                    handleClose={handleClose} 
                    submitProps={submitProps}
                    maxSlipId={maxSlipId}
                    week={week}
                    token={token}
                /> 
            }
        </Card.Body>
    );
}

export default GameProps;