import React, { useState, useEffect } from 'react';
import { Authenticator, useAuthenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import { Amplify } from 'aws-amplify';
import Spinner from 'react-bootstrap/Spinner';
import awsExports from '../../aws-exports';
import { fetchAuthSession, fetchUserAttributes } from 'aws-amplify/auth';
import { useQuery } from '@tanstack/react-query';

import Container from 'react-bootstrap/Container';

import Layout from '../../components/layout';
import SEO from '../../components/seo';

import * as ncaa from '../../api/vsnandy-lambda-api/ncaa';
import Draft from '../../components/wapit/draft';
import Dashboard from '../../components/wapit/dashboard';

// Setup Amplify for Cognito
Amplify.configure(awsExports);

const formFields = {
    setupTotp: {
        QR: {
            totpIssuer: 'AWSCognito',
            totpUsername: 'vsnandy_cognito_user'
        },
        confirmation_code: {
            label: 'Code',
            placeholder: 'Enter your Confirmation Code',
            isRequired: true
        }
    }
}

const Home = ({ schools, league, userGroups, players, wapitStats, token }) => {
    //console.log("[Home] - Schools:", schools);
    //console.log("[Home] - Token:", token);

    const { user, signOut } = useAuthenticator((context) => [context.user]);
    const [ userAttributes, setUserAttributes ] = useState({});

    useEffect(() => {
        const getAttributes = async () => {
            const attributes = await fetchUserAttributes();
            setUserAttributes(attributes);
        };

        getAttributes();
    }, [user]);

    //console.log("[Home] - User Attributes:", userAttributes);
    //console.log("[Home] - User Groups:", userGroups);
    //console.log("[Home] - User:", user);
    console.log("[Home] - League:", league);
    console.log("[Home] - Players:", players);
    console.log("[Home] - Wapit Stats:", wapitStats);

    /*
    return (
        <Container fluid>
            <h1 className="text-center my-3">How many underdogs won this weekend?</h1>
            <h3 className="text-center my-3">0</h3>
        </Container>
    );
    */

    return (
        <Container fluid>
            { league["draft"].length === 0 ?
                <Draft league={league} players={players} schools={schools} token={token} /> : <Dashboard league={league} players={players} schools={schools} wapitStats={wapitStats} token={token} />
            }
            {/*
            <ListGroup>
                { user && players.players.map((player, idx) => 
                    <ListGroup.Item key={idx}>
                        {player["firstName"]} {player["lastName"]} - {player["school"]} - {player.seasonAverage?.points ?? "0.0"} PPG
                    </ListGroup.Item>
                )}
            </ListGroup>*/}
        </Container>
    );
}

const App = () => {
    const { authStatus } = useAuthenticator((context) => [context.authStatus]);
    const [ userGroups, setUserGroups] = useState([]);
    
    //console.log("[App] - Auth Status: " + authStatus);

    const fetchToken = async () => {
        //console.log("[fetchToken] - Fetching token...");
        const response = (await fetchAuthSession({ forceRefresh: true })).tokens;
        //console.log("[fetchToken] - Session:", response);
        console.log("[fetchToken] - Token:", response.accessToken.toString());
        //console.log("[fetchToken] - Cognito Groups:", response.accessToken.payload["cognito:groups"]);
        setUserGroups(response.accessToken.payload["cognito:groups"]);
        return response.accessToken.toString();
    };

    const fetchSchools = async () => {
        if (authStatus === "authenticated") {
            const response = await ncaa.getAllSchools(token);
            //console.log("[wapit.js] - fetchSchools() response:", response.result.schools);
            return response.result.schools;
        } else {
            console.log("[fetchSchools] - Not authenticated yet...");
            return null;
        }
    }

    const fetchLeague = async () => {
        if (authStatus === 'authenticated') {
            // Extract leagueName & year from User Groups
            const leagues = userGroups.filter(group => group.startsWith("wapit_"))
            var latest_league_name = null;
            var latest_league_year = 0;

            // Loop through leagues and extract latest year
            leagues.forEach(league => {
                //console.log("League:", league);
                const year = league.slice(-4);
                const isLater = Number(year) > latest_league_year ? true : false;
                //console.log(`${latest_league_year} > ${year}? ${isLater}`);

                if (isLater) {
                    latest_league_year = year;
                    latest_league_name = league.slice("wapit_".length, -4);
                    //console.log("Updating latest league to " + latest_league_name);
                }
            });

            //console.log("Latest League: " + latest_league_name + " in Year " + latest_league_year);
            
            if (latest_league_name === null || latest_league_year === 0) {
                return null;
            }

            const response = await ncaa.getWapitLeague(latest_league_name, latest_league_year, awsExports["Auth"]["Cognito"]["userPoolId"], token);
            return response.result;
        } else {
            console.log("[fetchLeague] - Not authenticated yet...")
            return null;
        }
    }

    const fetchPlayers = async () => {
        if (authStatus === 'authenticated') {
            const response = await ncaa.getWapitPlayers(league['year'], token)
            return response.result;
        } else {
            console.log("[fetchPlayers] - Not authenticated yet...");
            return null;
        }
    }

    const fetchAllWapitStats = async () => {
        if (authStatus === 'authenticated') {
            const response = await ncaa.getAllWapitStats(league['year'], token);
            return response.result;
        } else {
            console.log("[fetchAllWapitStats] - Not authenticated yet...");
            return null;
        }
    }

    const { data: token } = useQuery({
        queryKey: ["token"],
        queryFn: fetchToken,
    });

    const { data: schools, isPending: isPendingSchools } = useQuery({
        queryKey: ["schools"],
        queryFn: () => fetchSchools(),
        gcTime: Infinity,
        enabled: authStatus === "authenticated" && !!token
    });

    const { data: league, isPending: pendingLeague } = useQuery({
        queryKey: ["league"],
        queryFn: () => fetchLeague(),
        gcTime: Infinity,
        enabled: authStatus === 'authenticated' && !!token
    });

    const { data: players, isPending: playersPending } = useQuery({
        queryKey: ["players"],
        queryFn: () => fetchPlayers(),
        gcTime: Infinity,
        enabled: authStatus === 'authenticated' && !!token && !!league
    });

    const { data: wapitStats, isPending: wapitPending } = useQuery({
        queryKey: ["wapit"],
        queryFn: () => fetchAllWapitStats(),
        gcTime: Infinity,
        enabled: authStatus === 'authenticated' && !!token && !!league
    });

    return (
        <Layout>
            <SEO title="WAPIT" />
            { authStatus === 'configuring' && 'Loading...'}
            { authStatus !== 'authenticated' ?
                <Authenticator loginMechanisms={['email']} hideSignUp formFields={formFields} className="mt-5" />
                : isPendingSchools || pendingLeague || playersPending || wapitPending
                    ? <Spinner as="span" animation="border" size="lg" role="status" aria-hidden="true" />
                    : <Home schools={schools} userGroups={userGroups} league={league} players={players} wapitStats={wapitStats} token={token} />
            }
        </Layout>
    );
}

const Default = () => (
    <Authenticator.Provider>
        <App />
    </Authenticator.Provider>
);

export default Default;
