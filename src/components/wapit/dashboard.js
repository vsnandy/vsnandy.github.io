import React, { useState, useEffect, useReducer } from 'react';
import Container from 'react-bootstrap/Container';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import Spinner from 'react-bootstrap/Spinner';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, Rectangle, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

import './dashboard.css';

const lineColors = [
    "#1f77b4", // blue
    "#ff7f0e", // orange
    "#2ca02c", // green
    "#d62728", // red
    "#9467bd", // purple
    "#8c564b", // brown
    "#e377c2", // pink
    "#7f7f7f", // gray
    "#bcbd22", // yellow-green
    "#17becf", // cyan
    "#f2a900", // golden
    "#ff1493", // deep pink
    "#a2d4f7", // light blue
    "#ff6f61", // coral
    "#6b8e23", // olive green
    "#b3b3cc", // lavender gray
    "#ffb6c1", // light pink
    "#20b2aa", // light sea green
    "#8a2be2", // blue violet
    "#7cfc00", // lawn green
    "#f0e68c", // khaki
    "#ffd700", // gold
    "#dc143c", // crimson
    "#d3d3d3", // light gray
    "#f5fffa", // mint cream
    "#ff6347", // tomato
    "#ff4500", // orange red
    "#ff00ff", // magenta
    "#000080", // navy
    "#dda0dd", // plum
    "#adff2f", // green yellow
    "#ff1493", // deep pink
    "#f08080", // light coral
    "#b0c4de", // light steel blue
    "#dcdcdc", // gainsboro
    "#cd5c5c", // indian red
    "#ff8c00", // dark orange
    "#c71585", // medium violet red
    "#9acd32", // yellow green
    "#48d1cc", // medium turquoise
    "#7f00ff"  // violet
  ];


const Leaderboard = ({ league, players, schools, wapitStats, token }) => {
    // Leaderboard Table Structure:
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
        rankings.length === 0
            ? <Spinner as="span" animation="border" size="lg" role="status" aria-hidden="true" />
            : (
                <Container className="d-flex flex-column align-items-center">
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
            )
    );
}

const WowBreakdown = ({ league, wapitStats }) => {
    //Leaderboard Line Graph Structure:
    // [{ name: Round of 64, team1: 10, team2: 12, ...}, ...]
    //const [pointsByRound, setPointsByRound] = useState([]);
    const [pointsByTeam, setPointsByTeam] = useState([]);

    useEffect(() => {
        const calculateTeamStats = (teams) => {
            // [{name: 'TEAM_1', 'First Round': 120, 'Second Round': 83, 'Sweet 16': 52, ...}, {...}, ...]
            var teamsList = [];

            Object.entries(teams).forEach(([teamId, teamPlayers]) => {
                // teamStats will be like -> {name: 'TEAM_1', 'First Round': 120, 'Second Round': 83, 'Sweet 16': 52, ...}
                const teamStats = {};
                let totalTeamPoints = 0; // Keep track of total team points for sorting later
                teamPlayers.forEach((player, index) => {
                    // Using wapitStats, lookup player stats to add to week total
                    const stats = wapitStats.stats[player["PlayerID"]];
                    stats.boxscores.forEach(score => {
                        if (score["roundName"] in teamStats) {
                            teamStats[score["roundName"]] += Number(score["pts"]);
                            totalTeamPoints += Number(score["pts"]);
                        } else {
                            teamStats[score["roundName"]] = Number(score["pts"]);
                            totalTeamPoints += Number(score["pts"]);
                        }
                    });
                });

                teamsList.push({name: teamId, "currentPoints": totalTeamPoints, ...teamStats});
            });

            // Fill any teams with missing round due to no players alive
            const maxRoundTeam = teamsList.reduce((maxObj, currentObj) => {
                return Object.keys(currentObj).length > Object.keys(maxObj).length
                ? currentObj
                : maxObj;
            });

            teamsList = teamsList.map((team, index) => {
                const filledTeam = team;
                Object.keys(maxRoundTeam).forEach((key, index) => {
                    if (!(key in filledTeam)) {
                        filledTeam[key] = 0;
                    }
                });

                return filledTeam;
            });
            
            // Sort the teamsList by latest round rankings
            teamsList.sort((a, b) => b["currentPoints"] - a["currentPoints"])

            console.log("Teams List: ", teamsList);

            return teamsList;
        }

        //setPointsByRound(calculateRoundStats(league.teams));
        setPointsByTeam(calculateTeamStats(league.teams));
    }, []);



    const WowBarChart = () => (
        <div style={{ width: "100%", height: 700}}>
            <ResponsiveContainer>
                <BarChart
                    data={pointsByTeam}
                    margin={{
                        top: 5,
                        right: 30,
                        left: 20,
                        bottom: 5,
                    }}
                    layout="vertical" 
                    barSize="35"
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis dataKey="name" type="category" minTickGap={25}/>
                    <Tooltip />
                    <Legend />
                    { Object.keys(pointsByTeam[0]).map((key, index) => {
                        if (key !== "name" && key !== "currentPoints") {
                            return <Bar key={index} dataKey={key} stackId="a" fill={lineColors[index]} activeBar={<Rectangle stroke="black" strokeWidth={3} />} />;
                        } else {
                            return null;
                        }
                    })}
                </BarChart>
            </ResponsiveContainer>
        </div>
    );

    return (
        pointsByTeam.length === 0
            ? <Spinner as="span" animation="border" size="lg" role="status" aria-hidden="true" />
            : (
                <Container className="d-flex flex-column align-items-center">
                    <h2>Week over Week Breakdown</h2>
                    <WowBarChart />
                </Container>
            )
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
        topScorers.length === 0
            ?  <Spinner as="span" animation="border" size="lg" role="status" aria-hidden="true" />
            : (
                <Container className="d-flex flex-column align-items-center">
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
            )
    );
}

const HorizontalBorder = () => (
    <div className="my-4" style={{ borderBottom: '2px solid black', width: '100%' }}></div>
);


const Dashboard = ({ league, players, schools, wapitStats, token }) => (
    <Container className="mt-3 d-flex flex-column align-items-center">
        <h1>WAPIT Challenge - {league.leagueName} {league.year}</h1>
        <p>(Updated as of {(new Date()).toLocaleDateString("en-US")})</p>
        <HorizontalBorder />
        {/* Leaderboard */ }
        <Leaderboard league={league} players={players} schools={schools} wapitStats={wapitStats} token={token} />
        <HorizontalBorder />
        {/* Week over Week Breakdown */}
        <WowBreakdown league={league} wapitStats={wapitStats} />
        <HorizontalBorder />
        {/* Top Scorers */}
        <TopScorers league={league} players={players} schools={schools} wapitStats={wapitStats} token={token} />
    </Container>
)

export default Dashboard;





/* ***

NOT IN USE

//////
Wow Breakdown
//////

const calculateRoundStats = (teams) => {
    // List of dictionaries (1 dict per round)
    // [{ name: "Round of 64", team1: 10, team2: 12, team3: 25, ..}, { name: "Round of 32", ...}]
    var roundsList = [];

    Object.entries(teams).forEach(([teamId, teamPlayers]) => {
        //console.log("Calculating Round by Round Stats for " + teamId);
        const teamStats = {};
        teamPlayers.forEach((player, index) => {
            // Using wapitStats, lookup player stats to add to week total
            const stats = wapitStats.stats[player["PlayerID"]];
            stats.boxscores.forEach(score => {
                if (score["roundName"] in teamStats) {
                    teamStats[score["roundName"]] += Number(score["pts"]);
                } else {
                    teamStats[score["roundName"]] = Number(score["pts"]);
                }
            });
        });

        // Place points in roundsList
        Object.entries(teamStats).forEach(([key, value]) => {
            // If [{ name: round, team1: 10, ...}, ...]
            if (roundsList.find(round => round.name === key)) {
                roundsList = roundsList.map(round => 
                    round.name === key
                        ? { ...round, [teamId]: value }
                        : round
                );
            } else {
                roundsList.push({ name: key, [teamId]: value });
            }
        });
    });

    // Use the first round list to get all the teams and make sure every round has all the teams
    var prevRound = roundsList[0];
    roundsList = roundsList.map((round, index) => {
        var curRound = round;
        //console.log("Checking round ", index, " : ", round);
        if (index > 0) {
            Object.keys(prevRound).forEach(key => {
                if(key !== 'name') {
                    if (!(key in round)) {
                        curRound = { ...curRound, [key]: prevRound[key] };
                    } else {
                        curRound = { ...curRound, [key]: prevRound[key] + round[key] }
                    }
                }
            })
        }
        
        // Set prevRound to currentRound
        prevRound = curRound;

        return curRound;
    });

    console.log("Rounds List:", roundsList);

    return roundsList;
}

const WowLineChart = () => (
    <div style={{ width: "80%", height: 500 }}>
        <ResponsiveContainer>
            <LineChart 
                data={pointsByRound}
                margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                    }}
            >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                { Object.keys(pointsByRound[0]).map((key, index) => {
                    if (key !== "name") {
                        return <Line key={index} type="linear" dataKey={key} stroke={lineColors[index]} />
                    } else {
                        return null;
                    }
                })}
            </LineChart>
        </ResponsiveContainer>
    </div>
);
*/