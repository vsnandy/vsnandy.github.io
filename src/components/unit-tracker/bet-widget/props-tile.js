import React, { useState } from 'react';
import ListGroup from 'react-bootstrap/ListGroup';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Form from 'react-bootstrap/Form';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import { FaCircleMinus } from 'react-icons/fa6';

import * as api from '../../../api/vsnandy-lambda-api/unit-bet';

import './props-tile.css';

const PropsList = ({ props, updateProp, removeProp, statConstants }) => (
    <ListGroup className="props-list">
        { props.map(({ id, prop }) => (
            <ListGroup.Item key={id} variant="light">
                <Row>
                    <Col md={5}>
                        <FloatingLabel controlId="floatingSelectGrid" label="Prop Type">
                            <Form.Select 
                                aria-label="Prop type select" 
                                defaultValue={prop["BET"]}
                                onChange={(event) => updateProp(id, "BET", event.target.value)}
                            >
                                { Object.keys(statConstants).map(key => (
                                    <option key={key} value={key}>
                                        {statConstants[key]}
                                    </option>
                                ))}
                            </Form.Select>
                        </FloatingLabel>
                    </Col>
                    <Col md={3}>
                        <FloatingLabel controlId="floatingInputGrid" label="Value">
                            <Form.Control 
                                type="text" 
                                defaultValue={prop["VALUE"]}
                                onChange={(event) => updateProp(id, "VALUE", event.target.value)}
                            />
                        </FloatingLabel>
                    </Col>
                    <Col md={3}>
                        <FloatingLabel controlId="floatingInputGrid2" label="Odds">
                            <Form.Control 
                                type="text" 
                                defaultValue={prop["ODDS"]}
                                onChange={(event) => updateProp(id, "ODDS", event.target.value)}
                            />
                        </FloatingLabel>
                    </Col>
                    <Col md={1} className="remove-prop">
                        <Button variant="none" onClick={() => removeProp(id)}><FaCircleMinus color="#C11B17" size={25} /></Button>
                    </Col>
                </Row>
            </ListGroup.Item> 
        ))}
    </ListGroup>
);

// Allow multiple props for a player (i.e., Justin Jefferson - 100+ receiving yards && Anytime TD Scorer)
export const PlayerPropsTile = ({ player, playerEvent, props, addProp, removeProp, updateProp }) => (
    <div className="prop-container">
        <h5><u>Player Props ({props.length})</u></h5>
        <PropsList props={props} updateProp={updateProp} removeProp={removeProp} statConstants={api.footballPlayerStatConstants} />
        <Button variant="link" onClick={() => addProp(player, playerEvent)}>Add Prop +</Button>
    </div>
);


export const GamePropsTile = ({ event, props, addProp, removeProp, updateProp }) => (
    <div className="prop-container">
        <h5><u>Game Props ({props.length})</u></h5>
        <PropsList props={props} updateProp={updateProp} removeProp={removeProp} statConstants={api.footballGameStatConstants} />
        <Button variant="link" onClick={() => addProp(event)}>Add Prop +</Button>
    </div>
)