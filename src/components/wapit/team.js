import React, { useState, useEffect } from 'react';
import Container from 'react-bootstrap/Container';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import Spinner from 'react-bootstrap/Spinner';
import Image from 'react-bootstrap/Image';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, Rectangle, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Label, LabelList } from 'recharts';
import { FaMoneyBill, FaBeer, FaRunning, FaPoop, FaRegSmile } from 'react-icons/fa';

import './dashboard.css';

const SCHOOL_URI_LIGHT = "https://i.turner.ncaa.com/sites/default/files/images/logos/schools/bgl/";
const SCHOOL_URI_DARK = "https://i.turner.ncaa.com/sites/default/files/images/logos/schools/bgd/";

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
                        (score["isWinner"] === false && score["gameState"] === "F") && (teamStats["PlayersAlive"] -= 1);
                    });
                });

                teamsList.push(teamStats);
            });

            // Sort list by "Points"
            teamsList.sort((a, b) => b.Points - a.Points);

            return(teamsList);
        }

        setRankings(calculateStats(league.teams));
    }, [league.draft.length, league.teams, wapitStats.stats]);

    const calculateMedian = (points) => {
        points.sort((a, b) => a - b);
         let median;
         const mid = Math.floor(points.length / 2);

         if (points.length % 2 === 0) {
            median = (points[mid - 1] + points[mid]) / 2;
         } else {
            median = points[mid];
         }

         return median;
    }

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
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            { rankings.map((team, index) => {
                                return (
                                    <tr key={index}>
                                        <td className="d-flex flex-row justify-content-start align-items-center">
                                            <div className="w-25">{index + 1}</div>
                                            {team["Points"] === rankings[0]["Points"] 
                                                ?   <div>
                                                        <FaMoneyBill size={20} color={"green"} />
                                                    </div> 
                                                : team["Points"] === rankings[rankings.length - 1]["Points"] 
                                                    ? 
                                                        <div>
                                                            <FaBeer size={20} color="red" />
                                                            <FaRunning size={20} color="red" />
                                                        </div>
                                                    : team["Points"] <= calculateMedian(rankings.map(team => team["Points"]))
                                                        ?
                                                            <div>
                                                                <FaPoop size={20} color="brown" />
                                                            </div>
                                                        :
                                                            <div>
                                                                <FaRegSmile size={20} color="black" />
                                                            </div>
                                            }
                                        </td>
                                        <td>{team["TeamID"]}</td>
                                        <td>{team["Points"]}</td>
                                        <td>{team["PlayersAlive"]}</td>
                                        <td>{team["GamesPlayed"]} ({(team["Points"] / team["GamesPlayed"]).toFixed(1)})</td>
                                        <td><Button onClick={() => console.log(team["TeamID"] + " clicked!!!")}>Click for Details</Button></td>
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
    const [sortKey, setSortKey] = useState("Total");

    //console.log("Sort Key: " + sortKey);

    const sortedPointsByTeam = [...pointsByTeam].sort((a, b) => {
        return b["aggregatedTotals"].find(total => total.name === sortKey)["value"] - a["aggregatedTotals"].find(total => total.name === sortKey)["value"];
    })

    useEffect(() => {
        const calculateTeamStats = (teams) => {
            // [{name: 'TEAM_1', 'First Round': 120, 'Second Round': 83, 'Sweet 16': 52, ...}, {...}, ...]
            var teamsList = [];

            Object.entries(teams).forEach(([teamId, teamPlayers]) => {
                // teamStats will be like -> {name: 'TEAM_1', 'First Round': 120, 'Second Round': 83, 'Sweet 16': 52, ...}
                const teamStats = { aggregatedTotals: [] };
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

                teamsList.push({name: teamId,...teamStats});
            });

            // Fill any teams with missing round due to no players alive
            const maxRoundTeam = teamsList.reduce((maxObj, currentObj) => {
                return Object.keys(currentObj).length > Object.keys(maxObj).length
                ? currentObj
                : maxObj;
            });

            // 1. Fill in any missing rounds for each team
            // 2. Create the aggregatedTotals list of round aggregates
            teamsList = teamsList.map((team, index) => {
                const filledTeam = team;
                let curRoundPoints = 0;
                Object.keys(maxRoundTeam).forEach((key, index) => {
                    // Fill in missing rounds
                    if (!(key in filledTeam)) {
                        filledTeam[key] = 0;
                    }

                    if (key !== "name" && key !== "aggregatedTotals") {
                        curRoundPoints += filledTeam[key];
                        // Calculate round aggregates
                        filledTeam["aggregatedTotals"].push({
                            name: key,
                            value: curRoundPoints,
                        });
                    }
                });

                // Add Total record in aggregatedTotals
                filledTeam["aggregatedTotals"].push({
                    name: "Total",
                    value: curRoundPoints,
                });

                return filledTeam;
            });
            
            // Sort the teamsList by latest round rankings
            teamsList.sort((a, b) => b["aggregatedTotals"].find(total => total.name === "Total")["value"] - a["aggregatedTotals"].find(total => total.name === "Total")["value"]);

            console.log("Teams List: ", teamsList);

            return teamsList;
        }

        //setPointsByRound(calculateRoundStats(league.teams));
        setPointsByTeam(calculateTeamStats(league.teams));
    }, [league.teams, wapitStats.stats]);


    const CustomLegend = ({ payload, sortKey, onClick }) => {
        //console.log("Payload:", payload);
        return (
            <ul 
                style={{ 
                    listStyle: "none", 
                    display: "flex", 
                    flexDirection: 'column',
                    padding: 0,
                    alignItems: "flex-start",
                }}
            >
            {payload.map((entry, index) => (
                <li
                    key={`item-${index}`}
                    style={{
                        marginRight: 20,
                        cursor: "pointer",
                        fontWeight: sortKey === entry.value ? "bold" : "normal",
                        color: entry.color,
                        background: sortKey === entry.value ? "blanchedalmond" : "transparent",
                        padding: "4px 8px",
                        borderRadius: "4px"
                    }}
                    onClick={() => onClick(entry.value)}
                >
                {entry.value}
                </li>
            ))}
            </ul>
        );
    };

    const calculateLegendAttributes = () => {
        //console.log("Calculating Legend Attributes...");
        const attributes = [];
        Object.keys(pointsByTeam[0]).forEach((key, index) => {
            if (key !== "name" && key !== "aggregatedTotals") {
                attributes.push({
                    value: key,
                    color: lineColors[index]
                });
            }
        });

        return attributes;
    }


    const WowBarChart = () => (
        <div className="mt-3" style={{ display: "flex", alignItems: "center", justifyContent: 'space-between', width: "100%", height: 700}}>
            <ResponsiveContainer width="80%">
                <BarChart
                    data={sortedPointsByTeam}
                    margin={{
                        top: 5,
                        right: 0,
                        left: 20,
                        bottom: 5,
                    }}
                    layout="vertical" 
                    barSize="35"
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number">
                        <Label value="Points" offset={-5} position="insideBottom" />
                    </XAxis>
                    <YAxis dataKey="name" type="category" minTickGap={25}/>
                    <Tooltip />
                    { Object.keys(pointsByTeam[0]).map((key, index) => {
                        if (key !== "name" && key !== "aggregatedTotals") {
                            return (
                                <Bar 
                                    key={index} 
                                    dataKey={key} 
                                    stackId="a" 
                                    fill={lineColors[index]} 
                                    activeBar={<Rectangle stroke="black" strokeWidth={3} />} 
                                />
                            );
                        } else {
                            return null;
                        }
                    })}
                </BarChart>
            </ResponsiveContainer>

            {/* Custom Legend to the Right */}
            <div style={{ marginLeft: 20 }}>
                <CustomLegend 
                    payload={calculateLegendAttributes()}
                    sortKey={sortKey} 
                    onClick={(val) => setSortKey(val)} 
                />
            </div>
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

const Jersey = ({ color, number, name, ratio }) => {
    const scaledWidth = 512 * Number(ratio);
    const scaledHeight = 512 * Number(ratio);
    const path = "M183.3 27.47l-13.9 3.47c1.3 46.77 4.4 95.66 2.5 138.36-2 45.3-8.9 84.5-32.9 106.7v211h234V276c-24-22.2-30.9-61.4-32.9-106.7-1.9-42.7 1.2-91.59 2.5-138.36l-13.9-3.47c-1.1 22.08-5.3 46.02-14.5 66.25C303.4 117.5 284 137 256 137c-28 0-47.4-19.5-58.2-43.28-9.2-20.23-13.4-44.17-14.5-66.25zm18.2 3.33c1.4 19.18 5.4 39.48 12.7 55.48C223.4 106.5 236 119 256 119c20 0 32.6-12.5 41.8-32.72 7.3-16 11.3-36.3 12.7-55.48C286.9 42.47 272 49 256 49s-30.9-6.53-54.5-18.2zm-50 4.59l-14.4 3.6c.4 37.62 3.8 78.91 1.9 117.41-2 39.5-9.8 76.6-34 102.9V487h16V267.7l3.4-2.7c18.8-15.2 27.5-50.8 29.5-96.5 1.8-40.1-1-87.14-2.4-133.11zm209 0c-1.4 45.97-4.2 93.01-2.4 133.11 2 45.7 10.7 81.3 29.5 96.5l3.4 2.7V487h16V259.3c-24.2-26.3-32-63.4-34-102.9-1.9-38.5 1.5-79.79 1.9-117.41z";//M295.4 224c9.4 0 16.8 2.8 22.3 8.4 5.5 5.6 8.2 13.1 8.2 22.4 0 6.2-1.5 12.2-4.4 18-2.9 5.8-7.4 11.7-13.3 17.7-8.3 8.5-14 14.5-16.9 18.2-2.9 3.7-5 7.4-6.3 11.3h42.4v19.5h-63.9v-16.4c2.1-6.2 5.2-12.4 9.2-18.6 4-6.3 9.8-13.4 17.5-21.5 5.9-6.3 9.8-10.7 11.6-13.2 1.8-2.4 3.2-4.7 4.2-7s1.5-4.6 1.5-6.9c0-4.1-1-7.2-3-9.5-2.1-2.3-5.1-3.5-9-3.5-3.9 0-6.8 1.4-8.9 4.1-2.1 2.7-3.4 6.7-4 12.2l-18.3-1.3c1-11.1 4.2-19.5 9.5-25.2 5.3-5.8 12.5-8.7 21.6-8.7zm-76.3 1.8h20.4v71.9h12.2v17.6h-12.2v24.2h-17.3v-24.2h-41.6v-17.8zm3.6 20.6c-1.1 3.1-3.1 7.6-6.1 13.6l-20.7 37.7h26.3V263c0-3 0-6.3.1-9.8.2-3.5.3-5.8.4-6.8z";
    return (
        <svg width={scaledWidth} height={scaledHeight} viewBox={`0 0 ${scaledWidth} ${scaledHeight}`}>
            <g transform={`scale(${ratio}) translate(25, 20)`}>
                {/* Jersey Shape */}
                <path 
                    d={path}
                    fill={color}
                >
                </path>
                
                {/* Number */}
                <text
                    x="256"
                    y="310"
                    fontSize="120"
                    fontWeight="bold"
                    fill="white"
                    textAnchor="middle"
                >
                    {number}
                </text>

                {/* Name */}
                <text
                    x="256"
                    y="200"
                    fontSize="20"
                    fontWeight="bold"
                    fill="white"
                    textAnchor="middle"
                    letterSpacing="2"
                >
                    {name.toUpperCase()}
                </text>
            </g>
        </svg>
    );
}

const TopScorers = ({ league, players, schools, wapitStats, token }) => {
    // Structure:
    // Rank | Player | Points | School | Games Played (PPG) | Team
    const [topScorers, setTopScorers] = useState([]);

    useEffect(() => {
        const fetchTopScorers = () => {
            const playersList = [];

            Object.entries(wapitStats.stats).forEach(([playerId, player]) => {
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
                    if (game["isWinner"] === false && game["gameState"] === "F") {
                        playerData["isAlive"] = false;
                        playerData["eliminatedRound"] = index + 1
                    }
                });

                playersList.push({
                    firstName: player["firstName"],
                    lastName: player["lastName"],
                    schoolNameShort: player["schoolNameShort"],
                    schoolNickname: player["schoolNickname"],
                    schoolSeoName: player["schoolSeoName"],
                    schoolColor: player["schoolColor"],
                    schoolSeed: player["seed"],
                    jerseyNumber: player["jerseyNumber"],
                    ...playerData,
                });
            });

            console.log("Players List:", playersList);
            playersList.sort((a, b) => b.pointsScored - a.pointsScored);

            return playersList;
        }

        setTopScorers(fetchTopScorers());
    }, [league.teams, wapitStats.stats])

    return (
        topScorers.length === 0
            ?  <Spinner as="span" animation="border" size="lg" role="status" aria-hidden="true" />
            : (
                <Container className="d-flex flex-column align-items-center mb-3">
                    <h2>Top Scorers</h2>
                    <div style={{ width: '100%', maxHeight: '700px', overflowY: 'auto' }}>
                        <Table bordered variant="light" className="mt-3">
                            <thead style={{ position: "sticky", top: "0", zIndex: 2 }}>
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
                                {topScorers.map((player, index) => (
                                    <tr 
                                        key={index}
                                        className={player.isAlive ? "active-player align-middle" : "inactive-player align-middle"}
                                    >
                                        <td>{index + 1}</td>
                                        <td>
                                            <Jersey color={player["schoolColor"]} number={player["jerseyNumber"]} name={player["lastName"]} ratio="0.1" />
                                            {player["firstName"] + " " + player["lastName"]}
                                        </td>
                                        <td>
                                            <Image className="mx-2" src={SCHOOL_URI_LIGHT + player["schoolSeoName"] +".svg"} width="50px;" rounded fluid />
                                            {player["schoolNameShort"] + " " + player["schoolNickname"]}
                                        </td>
                                        <td>{player["pointsScored"]}</td>
                                        <td>{player["gamesPlayed"]} ({(player["pointsScored"] / player["gamesPlayed"]).toFixed(1)})</td>
                                        <td>{player["leagueTeam"]}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    </div>
                </Container>
            )
    );
}

const HorizontalBorder = () => (
    <div className="my-4" style={{ borderBottom: '2px solid black', width: '100%' }}></div>
);

const toPascalCase = (phrase) => {
    return phrase.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ');
};


const Team = ({ league, players, wapitStats, rankings, topScorers, currentTeam, setPage, token }) => {
    const [selectedTeam, setSelectedTeam] = useState(currentTeam);

    return (
        <Container className="mt-3 d-flex flex-column align-items-center">
            <h2>{selectedTeam["TeamID"]} - {selectedTeam["Points"]}</h2>
        </Container>
    );
}

export default Team;





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