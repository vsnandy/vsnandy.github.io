import React, { useState } from "react";
import Container from "react-bootstrap/Container";
import Card from 'react-bootstrap/Card';
import Accordion from 'react-bootstrap/Accordion';
import Dropdown from 'react-bootstrap/Dropdown';

import { WeeklyPropTile } from './weekly-prop-tile';

import './dashboard.css';

const SeasonalDashboard = ({ season, bets, players, events, teams, token }) => {
    const getBettingYears = () => {
        const years = [];

        Object.keys(bets).forEach(bettor => {
            Object.keys(bets[bettor]).forEach(week => {
                const year = week.split("#")[0]
                if(!years.includes(year)) {
                    years.push(year)
                }
            })
        });

        return years;
    }

    const YearDropdown = () => {
        const bettingYears = getBettingYears();

        return (
            <Dropdown>
                <Dropdown.Toggle variant="dark" id="dropdown-basic">
                    {season}
                </Dropdown.Toggle>
                <Dropdown.Menu>
                    {bettingYears.map(year => <Dropdown.Item key="year">{year}</Dropdown.Item>)}
                </Dropdown.Menu>
            </Dropdown>
        )
    }
    
    const Bettors = ({ season, bets, players, events, teams, token }) => {
        const calculateTotal = (winnings) => {
            return winnings.reduce((accumulator, currentValue) => parseFloat(accumulator) + parseFloat(currentValue), 0).toFixed(2);
        }

        const BettorTile = ({ bettor }) => {
            const total = calculateTotal(bets[bettor][season + "#TOTAL"]);
            //console.debug("[Dashboard/Bettors] - Bettor:", bets);

            return (
                <Accordion>
                    <Card>
                        <Card.Header>
                            <Container className="bettor-header">
                                <div className="bettor-name">{bets[bettor].Name.toLowerCase()} ({bettor.toLowerCase()})</div>
                                <div className={ total > 0 ? "bettor-total-pos" : "bettor-total-neg"}>
                                    ${Math.abs(total).toFixed(2)}
                                </div>
                            </Container>
                        </Card.Header>
                    </Card>
                    {bets[bettor][season + "#TOTAL"].map((val, idx) => (
                        <Accordion.Item key={idx} eventKey={idx}>
                            <Accordion.Header>
                                <Container className="bettor-week-text">
                                    <u>Week {idx+1}</u>
                                    <div className={parseFloat(val) > 0 ? "bettor-week-val-pos" : "bettor-week-val-neg"}>
                                        ${Math.abs(parseFloat(val)).toFixed(2)}
                                    </div>
                                </Container>
                            </Accordion.Header>
                            <Accordion.Body>
                                <WeeklyPropTile bets={bets} bettor={bettor} season={season} players={players} teams={teams} week={idx+1} token={token} />
                            </Accordion.Body>
                        </Accordion.Item>
                    ))}
                </Accordion>
            );
        };

        return (
            <Container className="bettors-container">
                {Object.keys(bets).map(bettor => <BettorTile key={bettor} bettor={bettor} />)}
            </Container>
        );
    }

    return (
        <Container className="seasonal-dashboard">
            <YearDropdown className="year-dropdown"/>
            <Bettors season={season} bets={bets} players={players} events={events} teams={teams} token={token} />
        </Container>
    );
}


// Organize props by year + week
const Dashboard = ({ bets, players, events, teams, token }) => {
    const [season, setSeason] = useState(events["season"]["year"]);

    return (
        <Container>
            <SeasonalDashboard season={season} bets={bets} players={players} events={events} teams={teams} token={token} />
        </Container>
    );
}

export default Dashboard;