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
import ListGroup from 'react-bootstrap/ListGroup';
import ListGroupItem from 'react-bootstrap/ListGroupItem';

import '../../styles/wapit.css';

// Setup Amplify for Cognito
Amplify.configure(awsExports);

/*
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
*/

const Home = ({ schools, userGroups, token }) => {
    //console.log("[Home] - Schools:", schools);
    //console.log("[Home] - Token:", token);

    const { user, signOut } = useAuthenticator((context) => [context.user]);
    //const [ userAttributes, setUserAttributes ] = useState({});
    const [ userLeagues, setUserLeagues ] = useState(userGroups.filter(group => group.startsWith("wapit_")));
    const [ selectedLeague, setSelectedLeague ] = useState(null);

    console.log("User Groups: ", userGroups);
    console.log("User Leagues: ", userLeagues);

    const fetchLeague = async () => {
        // Extract league name and year
        const year = selectedLeague.slice(-4);
        const name = selectedLeague.slice(0,-4);
        console.log("Fetching league: " + name, year);
        const response = await ncaa.getWapitLeague(name, year, awsExports["Auth"]["Cognito"]["userPoolId"], token);
        return response.result;
    }

    const fetchPlayers = async () => {
        console.log("Fetching players for " + league["year"]);
        const response = await ncaa.getWapitPlayers(league['year'], token)
        return response.result;
    }

    const fetchAllWapitStats = async () => {
        console.log("Fetching Wapit stats for " + league["year"]);
        const response = await ncaa.getAllWapitStats(league['year'], token);
        return response.result;
    }

    const { data: league, isPending: leaguePending } = useQuery({
        queryKey: ["league"],
        queryFn: () => fetchLeague(),
        gcTime: Infinity,
        enabled: !!selectedLeague
    });

    const { data: players, isPending: playersPending } = useQuery({
        queryKey: ["players"],
        queryFn: () => fetchPlayers(),
        gcTime: Infinity,
        enabled: !!league
    });

    const { data: wapitStats, isPending: wapitPending } = useQuery({
        queryKey: ["wapit"],
        queryFn: () => fetchAllWapitStats(),
        gcTime: Infinity,
        enabled: !!league
    });

    //console.log("[Home] - User Attributes:", userAttributes);
    //console.log("[Home] - User Groups:", userGroups);
    //console.log("[Home] - User:", user);
    //console.log("[Home] - League:", league);
    //console.log("[Home] - Players:", players);
    //console.log("[Home] - Wapit Stats:", wapitStats);

    /*
    return (
        <Container fluid>
            <h1 className="text-center my-3">How many underdogs won this weekend?</h1>
            <h3 className="text-center my-3">0</h3>
        </Container>
    );
    */

    if (userGroups.length == 0) {
        return (
            <Container fluid>
                <p>Looks like you aren't part of any WAPIT leagues. Check with your league manager to be added.</p>
            </Container>
        );
    }

    if (league == null) {
        return (
            <Container fluid>
                <h2>Select a League:</h2>
                <ListGroup>
                    {userGroups.filter(group => group.startsWith("wapit_")).map((g, index) => {
                        return (
                            <ListGroupItem key={index} action onClick={() => setSelectedLeague(g.slice("wapit_".length))}>
                                {g.slice("wapit_".length, -4)} {g.slice(-4)}
                            </ListGroupItem>
                        );
                    })}
                </ListGroup>
            </Container>
        );
    } else {
        return (
            <Container fluid>
                { leaguePending || playersPending || wapitPending 
                    ? <Spinner as="span" animation="border" size="lg" role="status" aria-hidden="true" />
                    : league["draft"].length === 0 ?
                    <Draft league={league} players={players} schools={schools} token={token} /> : <Dashboard league={league} players={players} schools={schools} wapitStats={wapitStats} token={token} />
                }
            </Container>
        );
    }
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
        console.log("[fetchToken] - Cognito Groups:", response.accessToken.payload["cognito:groups"]);
        if (response.accessToken.payload["cognito:groups"]) {
            setUserGroups(response.accessToken.payload["cognito:groups"]);
        }
        return response.accessToken.toString();
    };

    console.log("[App] - userGroups: ", userGroups);

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

    return (
        <Layout>
            <SEO title="WAPIT" />
            { authStatus === 'configuring' && 'Loading...'}
            { authStatus !== 'authenticated' ?
                <Authenticator loginMechanisms={['username']} signUpAttributes={['name', 'email', 'nickname', 'phone_number']} className="mt-5" />
                : isPendingSchools
                    ? <Spinner as="span" animation="border" size="lg" role="status" aria-hidden="true" />
                    : <Home schools={schools} userGroups={userGroups} token={token} />
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
