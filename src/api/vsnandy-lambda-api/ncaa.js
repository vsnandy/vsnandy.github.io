const baseUrl = process.env.VSNANDY_API_GW_URL;

// Gets school list
export const getAllSchools = async (token) => {
    //console.log("[NCAA API] - Getting all schools");
    const headers = constructHeaders(token);
    const endpoint = `${baseUrl}/ncaa/schools`;

    //console.log(`[NCAA API] - Hitting endpoint: ${endpoint}`);

    try {
        const response = await fetch(endpoint, {
            method: 'GET',
            mode: 'cors',
            headers: headers
        });

        //console.log("[NCAA API] - getAllSchools() response:");
        //console.log(response);

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
                    schools: {}
                }
            };
        }
    } catch (err) {
        console.log("Error in api layer!");
        return {
            status: 503,
            message: {
                "Message": "Internal Server Error"
            },
            result: {
                schools: {}
            }
        };
    }
}


export const getWapitPlayers = async (year, token) => {
    //console.log(`[NCAA API] - Getting WAPIT players for ${year}!!`);
    const headers = constructHeaders(token);
    const endpoint = `${baseUrl}/ncaa/wapit/players?year=${year}`;

    //console.log(`[NCAA API / getWapitPlayers()] - Hitting endpoint: ${endpoint}`);

    try {
        const response = await fetch(endpoint, {
            method: 'GET',
            mode: 'cors',
            headers: headers
        });

        //console.log("[NCAA API] - getWapitPlayers() response:");
        //console.log(response);

        if (response.status === 200) {
            const result = await response.json();
            console.log(result);

            // Sort the players by highest to lowest PPG
            result.players.sort((a, b) => parseFloat(b.seasonAverage?.points ?? "0.0") - parseFloat(a.seasonAverage?.points ?? "0.0"));

            return {
                status: response.status,
                message: {},
                result
            };
        } else {
            const result = await response.json();
            //console.log(result);
            return {
                status: response.status,
                message: result,
                result: {
                    players: {}
                }
            };
        }
    } catch (err) {
        console.log("Error in api layer!", err);
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

export const getWapitLeague = async (leagueName, year, userPoolId, token) => {
    //console.log("[NCAA API] - Getting league");
    const headers = constructHeaders(token);
    // Add custom userPoolId header
    console.log("USER POOL ID: " + userPoolId);
    const endpoint = `${baseUrl}/ncaa/wapit/league/${leagueName}/year/${year}?user_pool_id=${userPoolId}`;

    //console.log(`[NCAA API] - Hitting endpoint: ${endpoint}`);

    try {
        const response = await fetch(endpoint, {
            method: 'GET',
            mode: 'cors',
            headers: headers
        });

        //console.log("[NCAA API] - getLeague() response:");

        if (response.status === 200) {
            const result = await response.json();
            console.log(result);
            return {
                status: response.status,
                message: {},
                result
            };
        } else {
            const result = await response.json();
            //console.log(result);
            return {
                status: response.status,
                message: result,
                result: {
                    league: {}
                }
            };
        }
    } catch (err) {
        console.log("Error in api layer!");
        return {
            status: 503,
            message: {
                "Message": "Internal Server Error"
            },
            result: {
                league: {}
            }
        };
    }
}

export const postWapitDraft = async (leagueName, year, draftPicks, token) => {
    //console.log("[NCAA API] - Getting league");
    const headers = constructHeaders(token);
    const endpoint = `${baseUrl}/ncaa/wapit/league/${leagueName}/year/${year}`;

    //console.log(`[NCAA API] - Hitting endpoint: ${endpoint}`);

    try {
        const response = await fetch(endpoint, {
            method: 'POST',
            mode: 'cors',
            headers: headers,
            body: draftPicks,
        });

        //console.log("[NCAA API] - postDraft() response:");

        if (response.status === 200) {
            const result = await response.json();
            //console.log(result);
            return {
                status: response.status,
                message: {},
                result
            };
        } else {
            const result = await response.json();
            //console.log(result);
            return {
                status: response.status,
                message: result,
                result: {
                    league: {}
                }
            };
        }
    } catch (err) {
        console.log("Error in api layer!");
        return {
            status: 503,
            message: {
                "Message": "Internal Server Error"
            },
            result: {
                league: {}
            }
        };
    }
}

export const getAllWapitStats = async (year, token) => {
    //console.log("[NCAA API] - Getting All Wapit Stats!");
    const headers = constructHeaders(token);
    const endpoint = `${baseUrl}/ncaa/wapit/stats/league?year=${year}`;

    //console.log(`[NCAA API] - Hitting endpoint: ${endpoint}`);

    try {
        const response = await fetch(endpoint, {
            method: 'GET',
            mode: 'cors',
            headers: headers
        });

        //console.log("[NCAA API] - getAllWapitStats() response:");

        if (response.status === 200) {
            const result = await response.json();
            //console.log(result);
            return {
                status: response.status,
                message: {},
                result
            };
        } else {
            const result = await response.json();
            //console.log(result);
            return {
                status: response.status,
                message: result,
                result: {
                    league: {}
                }
            };
        }
    } catch (err) {
        console.log("Error in api layer!");
        return {
            status: 503,
            message: {
                "Message": "Internal Server Error"
            },
            result: {
                league: {}
            }
        };
    }
}

const constructHeaders = (token) => {
    const headers = new Headers()
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', `Bearer ${token}`);
    headers.append('Accept', 'application/json');

    return headers;
}