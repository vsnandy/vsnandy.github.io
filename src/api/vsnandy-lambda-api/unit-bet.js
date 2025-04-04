const baseURL = process.env.VSNANDY_API_GW_URL;

export const getPlayers = async (sport, league, limit, page, token) => {
    const headers = constructHeaders(token);
    const endpoint = `${baseURL}/athletes?sport=${sport}&league=${league}&limit=${limit}&page=${page}`;
    //console.log("Calling GET Players!!!");
    try {
        const response = await fetch(endpoint, {
            method: 'GET',
            headers: headers,
            mode: "cors"
        });
    
        if (response.status === 200) {
            const result = await response.json();
            return {
                status: response.status,
                message: {},
                result
            };
        } else if (response.status === 401) {
            const result = await response.json();
            return {
                status: response.status,
                message: result,
                result: {
                    players: {}
                }
            };
        }
    } catch(err) {
        console.log("Error in api layer!");
        return {
            status: 503,
            message: {
                "Message": "Internal Server Error"
            },
            result: {
                players: {}
            }
        };
    }
}

export const getTeams = async (sport, league, token) => {
    const headers = constructHeaders(token);
    const endpoint = `${baseURL}/teams?sport=${sport}&league=${league}`;
    //console.log("Calling GET Teams!!!");

    try {
        const response = await fetch(endpoint, {
            method: 'GET',
            headers: headers,
            mode: "cors"
        });
    
        if (response.status === 200) {
            const result = await response.json();
            return {
                status: response.status,
                message: {},
                result
            };
        } else if (response.status === 401) {
            const result = await response.json();
            return {
                status: response.status,
                message: result,
                result: {
                    teams: {}
                }
            };
        }
    } catch(err) {
        console.log("Error in api layer!");
        return {
            status: 503,
            message: {
                "Message": "Internal Server Error"
            },
            result: {
                teams: {}
            }
        };
    }
}

export const getEvents = async (sport, league, week, token) => {
    const headers = constructHeaders(token);
    const endpoint = `${baseURL}/events?sport=${sport}&league=${league}&week=${week}`;
    //console.log("Calling GET Events!!!");

    try {
        const response = await fetch(endpoint, {
            method: 'GET',
            headers: headers,
            mode: "cors"
        });

        if (response.status === 200) {
            const result = await response.json();
            //console.log("EVENTS RESULT:", result);
            return {
                status: response.status,
                message: {},
                result
            };
        } else if (response.status === 401) {
            const result = await response.json();
            return {
                status: response.status,
                message: result,
                result: {}
            };
        }
    } catch(err) {
        console.log("Error in api layer!");
        return {
            status: 503,
            message: {
                "Message": "Internal Server Error"
            },
            result: {
                events: {}
            }
        };
    }
}

export const getBets = async (token) => {
    const headers = constructHeaders(token);
    const endpoint = `${baseURL}/bets`;
    //console.log("Calling GET Bets!!!");

    try {
        const response = await fetch(endpoint, {
            method: 'GET',
            headers: headers,
            mode: "cors"
        });
    
        if (response.status === 200) {
            const result = await response.json();

            // Structure bets as needed
            // dictionary with key: BETTOR, subkeys: YEAR#WEEK

            const parsedBets = {}

            result["bets"].forEach(bet => {
                //console.log(bet);
                if(Object.keys(parsedBets).includes(bet["Bettor"])) {
                    parsedBets[bet["Bettor"]][bet["Week"]] = bet["Bets"]
                } else {
                    parsedBets[bet["Bettor"]] = {
                        "Name": bet["Name"],
                        [bet["Week"]]: bet["Bets"]
                    }
                }
            });

            //console.log("PARSED BETS:", parsedBets);

            return {
                status: response.status,
                message: {},
                result: parsedBets
            };
        } else if (response.status === 401) {
            const result = await response.json();
            return {
                status: response.status,
                message: result,
                result: {}
            };
        }
    } catch(err) {
        console.log("Error in api layer!");
        return {
            status: 503,
            message: {
                "Message": "Internal Server Error"
            },
            result: {
                bets: {}
            }
        };
    }
}

// GET Player By ID
export const getPlayerById = async (sport, league, id, token) => {
    const headers = constructHeaders(token);
    const endpoint = `${baseURL}/athlete?sport=${sport}&league=${league}&id=${id}`;
    //console.log("Calling GET Player By ID!!!");
    try {
        const response = await fetch(endpoint, {
            method: 'GET',
            headers: headers,
            mode: "cors"
        });
    
        if (response.status === 200) {
            const result = await response.json();
            return {
                status: response.status,
                message: {},
                result
            };
        } else if (response.status === 401) {
            const result = await response.json();
            return {
                status: response.status,
                message: result,
                result: {
                    athlete: {}
                }
            };
        }
    } catch(err) {
        console.log("Error in api layer!");
        return {
            status: 503,
            message: {
                "Message": "Internal Server Error"
            },
            result: {
                athlete: {}
            }
        };
    }
}

// Football Betting Constants
export const footballPlayerStatConstants = {
    "ATTD": "Anytime TD Scorer",
    "REC YDS": "Receiving Yards",
    "PASS YDS": "Passing Yards",
    "RUSH YDS": "Rushing Yards",
    "PASS TDS": "Passing Touchdowns",
    "PASS INT": "Interceptions Thrown",
    "FIRST TD": "First TD Scorer",
    "REC": "Receptions",
    "PASS ATT": "Pass Attempts",
    "PASS COMP": "Pass Completions",
    "PASS + RUSH YDS": "Passing + Rushing Yards",
    "LONG REC": "Longest Reception",
    "RUSH + REC YDS": "Rushing + Receiving Yards",
    "RUSH ATT": "Rush Attempts",
    "LONG RUSH": "Longest Rush",
    "SACK": "Sacks",
    "TKL + AST": "Tackles + Assists",
    "SOLO TKL": "Solo Tackles",
    "AST": "Assists",
    "SFTY": "Safety",
    "TO": "Turnovers Forced",
    "FGS MADE": "Field Goals Made",
    "FGS MISS": "Field Goals Missed",
}

export const footballGameStatConstants = {
    "SPREAD": "Spread",
    "ML": "Moneyline",
    "TOTAL": "Total"
}

// Football Props By Type
export const footballProps = {
    "WR": [
        "ATTD",
        "REC YDS",
        "RUSH YDS",
        "FIRST TD",
        "REC",
        "LONG REC",
        "RUSH + REC YDS",
        "RUSH ATT",
        "RUSH ATT",
        "LONG RUSH",
    ],
    "QB": [
        "ATTD",
        "PASS YDS",
        "RUSH YDS",
        "PASS TDS",
        "PASS INT",
        "FIRST TD",
        "PASS ATT",
        "PASS COMP",
        "PASS + RUSH YDS",
        "RUSH ATT",
        "LONG RUSH",
    ],
    "RB": [
        "ATTD",
        "REC YDS",
        "RUSH YDS",
        "FIRST TD",
        "REC",
        "LONG REC",
        "RUSH + REC YDS",
        "RUSH ATT",
        "LONG RUSH",
    ],
    "TE": [
        "ATTD",
        "REC YDS",
        "RUSH YDS",
        "FIRST TD",
        "REC",
        "LONG REC",
        "RUSH + REC YDS",
        "RUSH ATT",
        "RUSH ATT",
        "LONG RUSH",
    ],
    "K": [
        "FGS MADE",
        "FGS MISS"
    ],
    "DEF": [
        "SACK",
        "TKL + AST",
        "SOLO TKL",
        "AST",
        "SFTY",
        "TO",
    ],
    "TEAM": [
        "ML",
        "SPREAD",
    ],
    "GAME": [
        "O/U"
    ]
}

// Boolean Props
export const footballBooleanProps = [ "ATTD" ]

export const footballPositions = {
    "OFF": [ "WR", "LT", "LG", "C", "RG", "RT", "TE", "QB", "RB", "FB", "OL", "OT", "OG", "G", "ATH", "T", "NG", "HB", "TB" ],
    "DEF": [ "LDE", "NT", "RDE",  "LB", "LOLB", "LILB", "RILB", "ROLB", "LCB", "RCB", "SS", "FS", "LDT", "RDT", "WLB", "MLB", "SLB", "CB", "LB", "DE", "DT", "UT", "NB", "DB", "S", "DL", "ATH", "ILB", "OLB", "EDGE" ],
    "ST": [ "PK", "P", "LS", "ATH", "PR", "KR", "H" ]
}

const constructHeaders = (token) => {
    const headers = new Headers()
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', `Bearer ${token}`);
    headers.append('Accept', 'application/json');

    return headers;
}