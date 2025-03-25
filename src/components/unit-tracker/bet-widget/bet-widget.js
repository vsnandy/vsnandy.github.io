import React, { useState } from "react";
import Card from 'react-bootstrap/Card';
import Nav from 'react-bootstrap/Nav';
import DropdownButton from 'react-bootstrap/DropdownButton';
import Dropdown from 'react-bootstrap/Dropdown';

import BetSlip from './bet-slip';
import PlayerProps from './player-props/player-props';
import GameProps from './game-props/game-props';

import * as api from '../../../api/vsnandy-lambda-api';

import './bet-widget.css';

const Widget = ({ players, events, teams, slip, setSlip, userAttributes, token }) => {
    const [ propType, setPropType ] = useState('#slip');
    const [ week, setWeek ] = useState(events["week"]["number"]);
    const [ selectedEvents, setSelectedEvents ] = useState(events);

    const fetchWeek = async (newWeek) => {
        console.debug("Clearing " + slip.length + " existing bets from slip...");
        setSlip([]);
        console.debug("Fetching events for week:", newWeek)
        const response = await api.getEvents("football", "nfl", newWeek, token);
        setWeek(newWeek);
        setSelectedEvents(response.result);
    };

    const switchPropType = (type) => {
        setPropType(type);
    }

    const WidgetBody = () => {
        switch(propType) {
            case '#slip': return <BetSlip slip={slip} setSlip={setSlip} week={week} userAttributes={userAttributes} />
            case '#player': return <PlayerProps players={players} events={selectedEvents} slip={slip} setSlip={setSlip} token={token} week={week} />
            case '#game': return <GameProps events={selectedEvents} slip={slip} setSlip={setSlip} token={token} week={week} />
            default: return (
                <Card.Body>
                    <Card.Title>Other Prop</Card.Title>
                    <Card.Text>Select another prop</Card.Text>
                </Card.Body>
            )
        }
    }

    return (
        <Card bg="light" text="dark">
            <Card.Header className="widget-header">
                <Nav variant="underline" defaultActiveKey="#slip" onSelect={switchPropType} className="w-75">
                    <Nav.Item className={propType === '#slip' ? "bet-nav-link-active" : "bet-nav-link"}>
                        <Nav.Link eventKey="#slip">Bet Slip ({slip.length})</Nav.Link>
                    </Nav.Item>
                    <Nav.Item className={propType === '#player' ? "bet-nav-link-active" : "bet-nav-link"}>
                        <Nav.Link eventKey="#player">+ Player Prop</Nav.Link>
                    </Nav.Item>
                    <Nav.Item className={propType === '#game' ? "bet-nav-link-active" : "bet-nav-link"}>
                        <Nav.Link eventKey="#game">+ Game Prop</Nav.Link>
                    </Nav.Item>
                </Nav>
                <DropdownButton title={"Week " + week} variant="outline-dark">
                    {selectedEvents["leagues"][0]["calendar"].find(sType => sType["value"] === "2")["entries"].map(curWeek => {
                        return (
                            <Dropdown.Item key={curWeek["value"]} eventKey={curWeek["value"]} onClick={() => fetchWeek(curWeek["value"])}>
                                Week {curWeek["value"]}
                            </Dropdown.Item>
                        );
                    })}
                </DropdownButton>
            </Card.Header>
            <WidgetBody />
        </Card>
    );
}

export default Widget;