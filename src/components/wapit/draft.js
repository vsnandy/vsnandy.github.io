import React, { useState, useRef, useEffect, useReducer } from 'react';
import { create } from 'zustand';

import { postWapitDraft } from '../../api/vsnandy-lambda-api/ncaa';

import './draft.css';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';

// Global State Management of Draft
const createDraftStore = (initialState) => 
    create((set) => ({
        ...initialState,
        //draftOrder: [],
        draftedPlayers: [],
        currentTeamIndex: 0,
        rounds: 10,
        draftPlayer: (player) => {
            //console.log("Drafting Player: ", player);
            set((state) => ({
                draftedPlayers: [...state.draftedPlayers, { ...player, pickNumber: state.draftedPlayers.length + 1, team: state.teams[state.currentTeamIndex] }],
                availablePlayers: state.availablePlayers.filter((p) => p.id !== player.id),
                currentTeamIndex: calculateCurrentPick(state.draftedPlayers.length + 1, state.teams.length),
            })
        )},
    }));

// submit draft picks
const submitDraftPicks = (leagueId, year, draftPicks) => {
    // Hit Post Wapit Draft endpoint
    const filteredPicks = draftPicks.map((pick, index) => {
        //{"LeagueID": "NBA2024", "PickNumber": 1, "TeamID": "TeamA", "PlayerID": "123", "PlayerName": "LeBron James", "Position": "SF"},
        return {
            LeagueID: leagueId + year,
            PickNumber: pick["pickNumber"],
            TeamID: pick["team"]["id"],
            PlayerID: pick["id"],
            PlayerName: pick["firstName"] + " " + pick["lastName"],
            Position: pick["position"]
        };
    });

    //console.log(filteredPicks);

    return null;
}

const calculateCurrentPick = (pickNumber, numTeams) => {
    // Calc round first
    const roundNum = ((pickNumber / numTeams) | 0) + 1;
    var currentTeamIndex = (roundNum % 2) === 0 ? numTeams - ((pickNumber % numTeams)) - 1: (pickNumber % numTeams);
    //console.log("Calculating Current Pick: " + roundNum + "." + currentTeamIndex);
    return currentTeamIndex;
}

const Draft = ({ league, useDraftStore, schools, token }) => {
    const { teams, draftedPlayers, availablePlayers, draftPlayer, currentTeamIndex, rounds } = useDraftStore();
    const [ search, setSearch ] = useState("");
    const [ timeLeft, setTimeLeft ] = useState(30);

    //console.log("Teams: ", teams);
    //console.log("Available Players: ", availablePlayers);
    //console.log("Current Team Index: ", currentTeamIndex);
    console.log("DraftedPlayers: ", draftedPlayers);

    /*
    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft((prev) => (prev > 0 ? prev - 1 : 30));
        }, 1000);

        return () => clearInterval(timer);
    }, [draftedPlayers]);
    */

    return (
        <div className="max-w-4xl mx-auto p-4 space-y-4">
            <h1 className="text-2xl font-bold">WAPIT March Madness Draft - {league.leagueName.toUpperCase()} {league.year}</h1>

            {/* Draft Board */}
            <div className="p-4 border rounded-lg bg-gray-100">
                <h2 className="text-xl font-semibold mb-3">Draft Board</h2>
                {/* Current Pick & Timer Table */}
                <Table striped bordered>
                    <thead>
                        <tr>
                            <th>Current Pick</th>
                            <th>Picks Remaining</th>
                            <th>On the Clock</th>
                            <th>Draft Clock (Seconds)</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>{((draftedPlayers.length / teams.length) | 0) + 1}.{(draftedPlayers.length % teams.length) + 1} ({draftedPlayers.length + 1})</td>
                            <td>{teams.length * rounds - draftedPlayers.length}</td>
                            <td>{teams[currentTeamIndex]["Attributes"].find(a => a["Name"] === "nickname")["Value"]}</td>
                            <td>{timeLeft}</td>
                        </tr>
                    </tbody>
                </Table>
                {teams.length * rounds - draftedPlayers.length === 0 ? <Button variant="primary" onClick={() => submitDraftPicks(league.leagueName, league.year, draftedPlayers)}>Submit Draft</Button> : <></>}
                <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                    <Table striped bordered hover>
                        <thead className="table-light" style={{ position: "sticky", top: "0", zIndex: 2 }}>
                            <tr>
                                <th>Pick</th>
                                <th>Player</th>
                                <th>Team</th>
                            </tr>
                        </thead>
                        <tbody>
                            {draftedPlayers.slice().reverse().map((player, index) => (
                                <tr key={index}>
                                    <td>{((player.pickNumber / teams.length) | 0) + 1}.{(player.pickNumber % teams.length)} ({player["pickNumber"]})</td>
                                    <td>{player["firstName"] + " " + player["lastName"]}</td>
                                    <td>{player["team"]["Name"]}</td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </div>
            </div>

            {/* Player List */}
            <div className="p-4 border rounded-lg bg-gray-50">
                <h2 className="text-xl font-semibold">Available Players</h2>
                <div className="d-flex justify-content-start">
                    <input
                        type="text"
                        placeholder="Search Players..."
                        className="w-40 p-2 border rounded my-2"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                <div style={{ maxHeight: '500px', overflowY: 'auto' }}>
                    <Table striped bordered hover variant="light">
                        <thead style={{ position: "sticky", top: "0", zIndex: 2 }}>
                            <tr>
                                <th>Rank</th>
                                <th>Player</th>
                                <th>Position</th>
                                <th>Points Per Game</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            { availablePlayers
                                .filter((p) => {
                                    const fullName = p.firstName.toLowerCase() + " " + p.lastName.toLowerCase();
                                    return fullName.includes(search.toLowerCase());
                                })
                                .map((player, index) => (
                                    <tr key={index}>
                                        <td>{index + 1}</td>
                                        <td>{player["firstName"] + " " + player["lastName"]}</td>
                                        <td>{player["position"]}</td>
                                        <td>{player.seasonAverage ? player.seasonAverage.points : 0}</td>
                                        <td><Button className="w-100" variant="primary" onClick={() => draftPlayer(player)}>Draft</Button></td>
                                    </tr>
                                )
                            )}
                        </tbody>
                    </Table>
                </div>
                {/*
                <ul className="space-y-2 no-bullets">
                    { availablePlayers
                        .filter((p) => {
                            const fullName = p.firstName.toLowerCase() + " " + p.lastName.toLowerCase();
                            return fullName.includes(search.toLowerCase());
                        })
                        .map((player) => {
                            return ( 
                                <li 
                                    key={player.id}
                                    className="p-2 border flex justify-between bg-white rounded-lg cursor-pointer hover:bg-blue-100"
                                    onClick={() => draftPlayer(player)}
                                >
                                    <span>{player.firstName} {player.lastName} ({player.position})</span>
                                    <button className="bg-blue-500 text-white px-3 py-1 rounded">Draft</button>
                                </li>
                            );
                        })
                    }
                </ul>
                */}
            </div>

            {/* Team Rosters */}
            <div className="p-4 border rounded-lg bg-gray-100">
                <h2 className="text-xl font-semibold">Team Rosters</h2>
                { teams.map((team) => (
                    <div key={team["Username"]} className="p-2 border rounded-lg my-2 bg-white">
                        {team["Attributes"].find(a => a["Name"] === "nickname")["Value"]}
                        <ul>
                            { draftedPlayers
                                .filter((player) => player.team["Username"] === team["Username"])
                                .map((p, index) => (
                                    <li key={index} className="p-1">
                                        {`${p.firstName} ${p.lastName} (${p.position})`}
                                    </li>
                                ))
                            }
                        </ul>
                    </div>
                ))}
            </div>
        </div>
    )
}

const App = ({ league, players, schools, token }) => {
    /*
    const useDraftStore = createDraftStore({
        teams: league.teams,
        availablePlayers: players.players,
    });
    */
    const useDraftStore = createDraftStore({
        teams: league.users,
        draftOrder: [],
        availablePlayers: players.players,
    });


    return <Draft 
        league={league} 
        useDraftStore={useDraftStore}
        schools={schools} 
        token={token} 
    />;
};

export default App;