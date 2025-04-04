import React, { useState, useEffect, useReducer } from 'react';
import Container from 'react-bootstrap/Container';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';

import './dashboard.css';


const Leaderboard = ({ league, players, schools, wapitStats, token }) => {
    // Structure:
    // Rank | Team | Points | Players Alive | Games Played (PPG)

    const [rankings, setRankings] = useState([]);

    useEffect(() => {
        const calculateStats = (teams) => {
            const teamsList = [];

            // For each team in league, construct rankings columns & loop through players collecting stats
            Object.entries(teams).forEach(([teamId, teamPlayers]) => {
                const teamStats = { "TeamID": teamId, "Points": 0, "PlayersAlive": (league.draft.length / Object.keys(teams).length), "GamesPlayed": 0 };
                teamPlayers.forEach((player, index) => {
                    // Using wapitStats, lookup stats
                    const stats = wapitStats.stats[player["PlayerID"]];
                    stats.boxscores.forEach(score => {
                        teamStats["Points"] += Number(score["pts"]);
                        teamStats["GamesPlayed"] += 1;
                        score["isWinner"] === false && (teamStats["PlayersAlive"] -= 1);
                    });
                });

                teamsList.push(teamStats);
            });

            // Sort list by "Points"
            teamsList.sort((a, b) => b.Points - a.Points);

            return(teamsList);
        }

        setRankings(calculateStats(league.teams));
    }, []);

    return (
        <Container className="mt-3 d-flex flex-column align-items-center">
            <h2>Leaderboard</h2>
            <Table striped bordered variant="light" className="mt-3">
                <thead>
                    <tr>
                        <th>Rank</th>
                        <th>Team</th>
                        <th>Points</th>
                        <th>Players Alive</th>
                        <th>Games Played (PPG)</th>
                    </tr>
                </thead>
                <tbody>
                    { rankings.map((team, index) => {

                        return (
                            <tr key={index}>
                                <td>{index + 1}</td>
                                <td>{team["TeamID"]}</td>
                                <td>{team["Points"]}</td>
                                <td>{team["PlayersAlive"]}</td>
                                <td>{team["GamesPlayed"]} ({(team["Points"] / team["GamesPlayed"]).toFixed(1)})</td>
                            </tr>
                        )
                    })}
                </tbody>
            </Table>
        </Container>
    );
}

const TopScorers = ({ league, players, schools, wapitStats, token }) => {
    // Structure:
    // Rank | Player | Points | School | Games Played (PPG) | Team
    const [topScorers, setTopScorers] = useState([]);

    useEffect(() => {
        const fetchTopScorers = () => {
            const playersList = [];

            Object.entries(wapitStats.stats).map(([playerId, player]) => {
                const playerData = {
                    leagueTeam: "Undrafted",
                    pointsScored: 0,
                    gamesPlayed: 0,
                    isAlive: true,
                    eliminatedRound: "N/A"
                }

                // Loop through league teams to find team w/ current player
                Object.entries(league.teams).forEach(([teamId, team]) => {
                    const onTeam = team.find(player => player.PlayerID === playerId);
                    if (onTeam) {
                        //console.log(player.firstName + " " + player.lastName + " is on " + teamId);
                        playerData["leagueTeam"] = teamId;
                        return;
                    }
                });

                // Loop through player boxscores to aggregate stats
                player.boxscores.forEach((game, index) => {
                    playerData["pointsScored"] += Number(game["pts"]);
                    playerData["gamesPlayed"] += 1;
                    if (game["isWinner"] === false) {
                        playerData["isAlive"] = false;
                        playerData["eliminatedRound"] = index + 1
                    }
                });

                playersList.push({
                    firstName: player["firstName"],
                    lastName: player["lastName"],
                    schoolNameShort: player["schoolNameShort"],
                    schoolNickname: player["schoolNickname"],
                    ...playerData,
                });
            });

            console.log("Players List:", playersList);
            playersList.sort((a, b) => b.pointsScored - a.pointsScored);

            return playersList;
        }

        setTopScorers(fetchTopScorers());
    }, [])

    return (
        <Container className="mt-3 d-flex flex-column align-items-center">
            <h2>Top Scorers</h2>
            <Table striped bordered variant="light" className="mt-3">
                <thead>
                    <tr>
                        <th>Rank</th>
                        <th>Player</th>
                        <th>School</th>
                        <th>Points</th>
                        <th>Games Played (PPG)</th>
                        <th>Team</th>
                    </tr>
                </thead>
                <tbody>
                    {topScorers.slice(0,25).map((player, index) => (
                        <tr 
                            key={index}
                            className={player.isAlive ? "active-player" : "inactive-player"}
                        >
                            <td>{index + 1}</td>
                            <td>{player["firstName"] + " " + player["lastName"]}</td>
                            <td>{player["schoolNameShort"] + " " + player["schoolNickname"]}</td>
                            <td>{player["pointsScored"]}</td>
                            <td>{player["gamesPlayed"]} ({(player["pointsScored"] / player["gamesPlayed"]).toFixed(1)})</td>
                            <td>{player["leagueTeam"]}</td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </Container>
    );
}


const Dashboard = ({ league, players, schools, wapitStats, token }) => (
    <Container className="mt-3 d-flex flex-column align-items-center">
        <h1>WAPIT Challenge - {league.leagueName} {league.year}</h1>
        <p>(Updated as of {(new Date()).toLocaleDateString("en-US")})</p>
        <div style={{ borderBottom: '2px solid black', width: '100%' }}></div>
        {/* Leaderboard */ }
        <Leaderboard league={league} players={players} schools={schools} wapitStats={wapitStats} token={token} />

        {/* Top Scorers */}
        <TopScorers league={league} players={players} schools={schools} wapitStats={wapitStats} token={token} />
    </Container>
)

export default Dashboard;