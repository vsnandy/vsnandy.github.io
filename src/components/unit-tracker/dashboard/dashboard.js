import React, { useState } from "react";
import Container from "react-bootstrap/Container";
import Card from 'react-bootstrap/Card';
import Accordion from 'react-bootstrap/Accordion';
import Dropdown from 'react-bootstrap/Dropdown';

import { WeeklyPropTile } from './weekly-prop-tile';

import './dashboard.css';

const SeasonalDashboard = ({ season, setSeason, bets, players, events, teams, token }) => {
    const getBettingYears = () => {
        const years = [events["season"]["year"].toString()];

        /*
        Object.keys(bets).forEach(bettor => {
            Object.keys(bets[bettor]).forEach(week => {
                const year = week.split("#")[0]
                if(!years.includes(year) && year !== "Name") {
                    years.push(year)
                }
            })
        });
        */

        console.log("[Dashboard] - Betting Years:", years);

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
                    {bettingYears.map(year => (
                        <Dropdown.Item 
                            key={year}
                            onClick={() => setSeason(year)}
                        >
                            {year}
                        </Dropdown.Item>
                    ))}
                </Dropdown.Menu>
            </Dropdown>
        )
    }

    const users = [...new Set(bets.map(bet => bet.bettor))];
    
    const Bettors = ({ season, bets, players, events, teams, token }) => {
        const calculateTotal = (winnings) => {
            return winnings.reduce((accumulator, currentValue) => parseFloat(accumulator) + parseFloat(currentValue), 0).toFixed(2);
        }

        const calculateWinnings = (odds) => {
            const oddsFloat = parseFloat(odds);
            if (oddsFloat > 0) {
                return (oddsFloat / 100) * 1;  // Bet $100 on positive odds
            } else {
                return (100 / Math.abs(oddsFloat)) * 1;  // Bet enough to win $100 on negative odds
            }
        }

        const BettorTile = ({ bettor }) => {
            console.debug("[Dashboard/Bettors] - Bettor:", bets);

            const hasTotal = bets[bettor][season + "#TOTAL"] && bets[bettor][season + "#TOTAL"].length > 0;

            /*
            if (!bets[bettor][season + "#TOTAL"]) {
                return (
                    <Card>
                        <Card.Header>
                            <Container className="bettor-header">
                                <div className="bettor-name">{bets[bettor].Name.toLowerCase()} ({bettor.toLowerCase()})</div>
                                <div className="bettor-total-zero">
                                    $0.00
                                </div>
                            </Container>
                        </Card.Header>
                    </Card>
                );
            }
            */
            
            const total = hasTotal
                ? calculateTotal(bets[bettor][season + "#TOTAL"])
                : 0.00;

            return (
                <Accordion>
                    <Card>
                        <Card.Header>
                            <Container className="bettor-header">
                                <div className="bettor-name">{bettor.name.toLowerCase()} ({bettor.bettor.toLowerCase()})</div>
                                <div className={ total > 0 ? "bettor-total-pos" : "bettor-total-neg"}>
                                    ${Math.abs(total).toFixed(2)}
                                </div>
                            </Container>
                        </Card.Header>
                    </Card>
                    {Object.keys(bets[bettor]).map((val, idx) => {
                        console.debug("Year:", val.split("#")[0], "Equal?", val.split("#")[0] === season.toString());
                        console.debug("Week:", val.split("#")[1], "Not Equal?", val.split("#")[1] !== "TOTAL");
                        console.debug("Odds:", bets[bettor][val]);
                        if (val.split("#")[0] === season.toString() && val.split("#")[1] !== "TOTAL") {
                            console.debug("Rendering week:", idx, "for bettor:", bettor);
                            const totalBet = bets[bettor][val].find(bet => bet["PROP_TYPE"] === "TOTAL");
                            const winnings = totalBet["OUTCOME"] !== "N" ? calculateWinnings(totalBet["ODDS"]) : 0.00;
                            return (
                                <Accordion.Item key={idx} eventKey={idx}>
                                    <Accordion.Header>
                                        <Container className="bettor-week-text">
                                            <u>Week {idx}</u>
                                            <div className={parseFloat(winnings) > 0 ? "bettor-week-val-pos" : "bettor-week-val-neg"}>
                                                ${Math.abs(parseFloat(winnings)).toFixed(2)}
                                            </div>
                                        </Container>
                                    </Accordion.Header>
                                    <Accordion.Body>
                                        <WeeklyPropTile bets={bets} bettor={bettor} season={season} players={players} teams={teams} week={idx} token={token} />
                                    </Accordion.Body>
                                </Accordion.Item>
                            );
                        } else { return null; }
            })}
                </Accordion>
            );
        };

        return (
            <Container className="bettors-container">
                {users.map(user => <BettorTile key={user} bettor={user} />)}
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
const Dashboard = ({ bets, players, events, teams, userAttributes, token }) => {
    const [season, setSeason] = useState(events["season"]["year"]);

    console.log("[Dashboard] - User:", userAttributes);
    console.log("[Dashboard] - Events:", events);
    console.log("[Dashboard] - Season:", season);
    console.log("[Dashboard] - Bets:", bets);

    const UserBets = () => (
        <Container fluid>
            <h1>{userAttributes.username.toUpperCase()}'s Bets</h1>
            {bets.filter(bet => bet.bettor === userAttributes.username).map(bet => (
                <Card>
                    <h3>{bet.week} - {bet.status} - {bet.total_odds}</h3>
                </Card>
            ))}
        </Container>
    )

    return (
        <Container>
            <UserBets />
            {/*<SeasonalDashboard season={season} setSeason={setSeason} bets={bets} players={players} events={events} teams={teams} token={token} />*/}
        </Container>
    );
}

export default Dashboard;