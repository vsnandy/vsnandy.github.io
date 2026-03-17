const baseURL = process.env.VSNANDY_API_GW_URL;

// ESPN Endpoints
export const getAthletes = async (sport, league, limit=100, page=1, token) => {
    const headers = constructHeaders(token);
    const endpoint = `${baseURL}/espn/athletes?sport=${sport}&league=${league}&limit=${limit}&page=${page}`;
    const loggingPrefix = "[getAthletes]";
    console.log(`${loggingPrefix} -> Calling GET Athletes --> ${endpoint} !!!`);
    try {
        const response = await fetch(endpoint, {
            method: 'GET',
            headers: headers,
            mode: "cors"
        });
    
        if (response.status === 200) {
            const result = await response.json();
            console.log(result);
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
        console.log(`${loggingPrefix} -> Error in api layer!`);
        console.log(`${loggingPrefix} -> \n${err}`)
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
    const endpoint = `${baseURL}/espn/teams?sport=${sport}&league=${league}`;
    const loggingPrefix = "[getTeams]";
    console.log(`${loggingPrefix} -> Calling GET Teams -> ${endpoint} !!!`);

    try {
        const response = await fetch(endpoint, {
            method: 'GET',
            headers: headers,
            mode: "cors"
        });
    
        if (response.status === 200) {
            const result = await response.json();
            console.log(result);
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
        console.log(`${loggingPrefix} -> Error in api layer!`);
        console.log(`${loggingPrefix} -> \n${err}`)
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

export const getSiteTeam = async (sport, league, team_id, token) => {
    const headers = constructHeaders(token);
    const endpoint = `${baseURL}/espn/site/team?sport=${sport}&league=${league}&id=${team_id}`;
    const loggingPrefix = "[getSiteTeam]";
    console.log(`${loggingPrefix} -> Calling GET Teams -> ${endpoint} !!!`);

    try {
        const response = await fetch(endpoint, {
            method: 'GET',
            headers: headers,
            mode: "cors"
        });

        if (response.status === 200) {
            const result = await response.json();
            console.log(result);
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
        console.log(`${loggingPrefix} -> Error in api layer!`);
        console.log(`${loggingPrefix} -> \n${err}`);
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

export const getCoreTeam = async (sport, league, year, team_id, token) => {
    const headers = constructHeaders(token);
    const endpoint = `${baseURL}/espn/core/team?sport=${sport}&league=${league}&year=${year}&id=${team_id}`;
    const loggingPrefix = "[getCoreTeam]";
    console.log(`${loggingPrefix} -> Calling GET Core Team -> ${endpoint} !!!`);

    try {
        const response = await fetch(endpoint, {
            method: 'GET',
            headers: headers,
            mode: "cors"
        });

        if (response.status === 200) {
            const result = await response.json();
            console.log(result);
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
        console.log(`${loggingPrefix} -> Error in api layer!`);
        console.log(`${loggingPrefix} -> \n${err}`);
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

export const getSiteScoreboard = async (sport, league, week, token) => {
    const headers = constructHeaders(token);
    const endpoint = `${baseURL}/espn/site/scoreboard?sport=${sport}&league=${league}&week=${week}`;
    const loggingPrefix = "[getSiteScoreboard]";
    console.log(`${loggingPrefix} -> Getting Site Scoreboard -> ${endpoint} !!!`);

    try {
        const response = await fetch(endpoint, {
            method: 'GET',
            headers: headers,
            mode: "cors"
        });

        if (response.status === 200) {
            const result = await response.json();
            console.log(result);
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
        console.log(`${loggingPrefix} -> Error in api layer!`);
        console.log(`${loggingPrefix} -> \n${err}`);
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

export const getCdnScoreboard = async (league, limit, token) => {
    const headers = constructHeaders(token);
    const endpoint = `${baseURL}/espn/cdn/scoreboard?league=${league}&limit=${limit}`;
    const loggingPrefix = "[getCdnScoreboard]";

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
                result: {}
            };
        }
    } catch(err) {
        console.log(`${loggingPrefix} -> Error in api layer!`);
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

export const getAthlete = async (sport, league, athlete_id, token) => {
    const headers = constructHeaders(token);
    const endpoint = `${baseURL}/espn/athlete?sport=${sport}&league=${league}&id=${athlete_id}`;
    const loggingPrefix = "[getAthlete]";

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
                result: {}
            };
        }
    } catch(err) {
        console.log(`${loggingPrefix} -> Error in api layer!`);
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

export const getCdnSchedule = async (year, week, token) => {
    const headers = constructHeaders(token);
    const endpoint = `${baseURL}/espn/cdn/schedule?year=${year}&week=${week}`;

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

export const getSiteStandings = async (sport, league, season, token) => {
    const headers = constructHeaders(token);
    const endpoint = `${baseURL}/espn/site/standings?sport=${sport}&league=${league}&season=${season}`;

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

export const getCdnStandings = async (token) => {
    const headers = constructHeaders(token);
    const endpoint = `${baseURL}/espn/cdn/standings`;

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

export const getConferenceStandings = async (sport, league, season, season_type, conference_id, token) => {
    const headers = constructHeaders(token);
    const endpoint = `${baseURL}/espn/conference-standings?sport=${sport}&league=${league}&season=${season}&season_type=${season_type}&id=${conference_id}`;

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

export const getTeamRoster = async (sport, league, team_id, token) => {
    const headers = constructHeaders(token);
    const endpoint = `${baseURL}/espn/team/roster?sport=${sport}&league=${league}&id=${team_id}`;

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

export const getTeamSchedule = async (sport, league, team_id, token) => {
    const headers = constructHeaders(token);
    const endpoint = `${baseURL}/espn/team/schedule?sport=${sport}&league=${league}&id=${team_id}`;

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

export const getTeamInjuries = async (sport, league, team_id, token) => {
    const headers = constructHeaders(token);
    const endpoint = `${baseURL}/espn/team/injuries?sport=${sport}&league=${league}&id=${team_id}`;

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

export const getTeamDepthChart = async (sport, league, year, team_id, token) => {
    const headers = constructHeaders(token);
    const endpoint = `${baseURL}/espn/team/depth-chart?sport=${sport}&league=${league}&year=${year}&id=${team_id}`;

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

export const getAthleteOverview = async (sport, league, athlete_id, token) => {
    const headers = constructHeaders(token);
    const endpoint = `${baseURL}/espn/athlete/overview?sport=f${sport}&league=${league}&ath_id=${athlete_id}`;

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

export const getAthleteGamelog = async (sport, league, athlete_id, token) => {
    const headers = constructHeaders(token);
    const endpoint = `${baseURL}/espn/athlete/gamelog?sport=f${sport}&league=${league}&ath_id=${athlete_id}`;

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

export const getAthleteEventlog = async (sport, league, season, athlete_id, token) => {
    const headers = constructHeaders(token);
    const endpoint = `${baseURL}/espn/athlete/eventlog?sport=${sport}&league=${league}&year=${season}&ath_id=${athlete_id}`;

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

export const getAthleteSplits = async (sport, league, athlete_id, token) => {
    const headers = constructHeaders(token);
    const endpoint = `${baseURL}/espn/athlete/splits?sport=${sport}&league=${league}&ath_id=${athlete_id}`;

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

export const getGameSummary = async (sport, league, event_id, token) => {
    const headers = constructHeaders(token);
    const endpoint = `${baseURL}/espn/game/summary?sport=${sport}&league=${league}&event_id=${event_id}`;

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

export const getGameBoxscore = async (event_id, token) => {
    const headers = constructHeaders(token);
    const endpoint = `${baseURL}/espn/game/boxscore?event_id=${event_id}`;

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

export const getGamePlaybyplay = async (event_id, league, token) => {
    const headers = constructHeaders(token);
    const endpoint = `${baseURL}/espn/game/playbyplay?event_id=${event_id}&league=${league}`;

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

export const getGamePlays = async (sport, league, event_id, limit, token) => {
    const headers = constructHeaders(token);
    const endpoint = `${baseURL}/espn/game/plays?sport=${sport}&league=${league}&event_id=${event_id}&limit=${limit}`;

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

export const getGameDrives = async (sport, league, event_id, limit, token) => {
    const headers = constructHeaders(token);
    const endpoint = `${baseURL}/espn/game/drives?sport=${sport}&league=${league}&event_id=${event_id}&limit=${limit}`;

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

export const getSiteLeaders = async (sport, league, event_id, season, season_type, token) => {
    const headers = constructHeaders(token);
    const endpoint = `${baseURL}/espn/site/leaders?sport=${sport}&league=${league}&event_id=${event_id}&season=${season}&season_type=${season_type}`;

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

export const getCoreLeaders = async (sport, league, event_id, season, season_type, token) => {
    const headers = constructHeaders(token);
    const endpoint = `${baseURL}/espn/core/leaders?sport=${sport}&league=${league}&event_id=${event_id}&season=${season}&season_type=${season_type}`;

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

export const getDraft = async (sport, league, season, token) => {
    const headers = constructHeaders(token);
    const endpoint = `${baseURL}/espn/draft?sport=${sport}&league=${league}&season=${season}`;

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

export const getTeamNews = async (sport, league, team_id, token) => {
    const headers = constructHeaders(token);
    const endpoint = `${baseURL}/espn/team/news?sport=${sport}&league=${league}&team_id=${team_id}`;

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

export const getSpecificNights = async (night, token) => {
    const headers = constructHeaders(token);
    const endpoint = `${baseURL}/espn/specific/nights?night=${night}`;

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

// Pick Poolr Endpoint
export const getBets = async (year, token) => {
    const headers = constructHeaders(token);
    const endpoint = `${baseURL}/pick-poolr/bets?year=${year}`;
    const loggingPrefix = "[getBets]";
    console.log(`${loggingPrefix} -> Get Bets for Year ${year}`);

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