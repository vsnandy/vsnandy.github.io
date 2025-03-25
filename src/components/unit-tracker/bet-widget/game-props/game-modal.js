import React, { useState } from 'react';
import Container from 'react-bootstrap/Container';
import Card from 'react-bootstrap/Card';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Image from 'react-bootstrap/Image';

import { GameWeekTile } from '../game-week-tile';
import { GamePropsTile } from '../props-tile';

import './game-modal.css';

const GameModal = ({ event, show, handleClose, submitProps, maxSlipId, week, token }) => {
    const [ props, setProps ] = useState([]);
    const [ maxPropId, setMaxPropId ] = useState(maxSlipId+1);

    const addProp = (event) => {
        //console.debug("Adding prop", maxPropId, "to:\n", props);
        setProps([...props, {
            id: maxPropId,
            prop: {
                "BET": "TOTAL",
                "ODDS": "-110",
                "PROP_TYPE": "GAME",
                "OUTCOME": "TBD",
                "PROP_ID": event["shortName"],
                "EVENT_ID": event["id"],
                "VALUE": "OVER 50"
            },
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
        newProps[updateIndex] = propToUpdate;
        setProps(newProps);
    }

    return (
        <Modal show={show} onHide={handleClose} animation={false} centered keyboard dialogClassName="game-modal">
            <Modal.Header closeButton>
                <Modal.Title className="w-100 modal-title">
                    + Game Prop
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <GameWeekTile event={event} onBye={false} week={week} />
                <GamePropsTile event={event} props={props} addProp={addProp} removeProp={removeProp} updateProp={updateProp} />
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
    );
}

export default GameModal;