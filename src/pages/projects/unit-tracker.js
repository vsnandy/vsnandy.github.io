import React, { useState, useCallback } from 'react';
import { Authenticator, useAuthenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import { Amplify } from 'aws-amplify';
import Spinner from 'react-bootstrap/Spinner';
import awsExports from '../../aws-exports';
import Home from '../../components/unit-tracker/home';
import { useQuery, useQueries } from '@tanstack/react-query';
import { fetchAuthSession } from 'aws-amplify/auth';
import * as api from '../../api/vsnandy-lambda-api';
import Layout from '../../components/layout';

import '../../styles/page.css';

// Setup Amplify for Cognito
Amplify.configure(awsExports);

const formFields = {
    setupTotp: {
        QR: {
            totpIssuer: 'AWSCognito',
            totpUsername: 'vsnandy_cognito_user',
        },
        confirmation_code: {
            label: 'Code',
            placeholder: 'Enter your Confirmation Code',
            isRequired: true
        }
    }
}

const playerLimit = 5000;

const App = () => {
    const { authStatus } = useAuthenticator((context) => [context.authStatus]);
    const [ userGroups, setUserGroups ] = useState([]);
    const [ token, setToken ] = useState('');

    console.log("[App] - Auth Status: " + authStatus);

    const fetchToken = async () => {
        console.log("[fetchToken] - Fetching token...");
        const response = (await fetchAuthSession({ forceRefresh: true })).tokens;
        console.log("[fetchToken] - Session:", response);
        console.log("[fetchToken] - Token:", response.accessToken.toString());
        setUserGroups(response.accessToken.payload["cognito:groups"]);
        setToken(response.accessToken.toString());
        return response.accessToken.toString();
    };
    
    const fetchPlayerQueryList = async () => {
        if (authStatus === 'authenticated') {
            console.log("[fetchPlayerQueryList] - Getting Player Count!!");
            const new_token = await fetchToken();
            const response = await api.getPlayers("football", "nfl", 1, 1, new_token);
        
            // Create Query Page List --> [1, 2, 3]
            let queryList = [];
            for(let i = 0; i < (response.result.count / playerLimit); i++) {
                queryList.push(i+1);
            }
        
            console.log("[fetchPlayerQueryList] - Query List:", queryList);
        
            return queryList;
        } else {
            console.log("[fetchPlayerQueryList] - Not authenticated yet...");
            return null;
        }
    }
    
    const fetchPlayers = async (page = 1) => {
        if (authStatus === 'authenticated') {
            const new_token = await fetchToken();
            const response = await api.getPlayers("football", "nfl", playerLimit, page, new_token);
            
            // If first page, omit first 6, 7? entries
            if (page === 1) {
                return response.result.players.slice(6);
            }
            return response.result.players;
        } else {
            console.log("[fetchPlayers] - Not authenticated yet...");
            return null;
        }
    };

    const fetchTeams = async () => {
        if (authStatus === 'authenticated') {
            const new_token = await fetchToken();
            const response = await api.getTeams("football", "nfl", new_token);

            //console.log("TEAMS:", response);

            return response.result.teams
        } else {
            console.log("[fetchTeams] - Not authenticated yet...");
            return null;
        }
    }

    const fetchEvents = async () => {
        if (authStatus === 'authenticated') {
            const new_token = await fetchToken();
            const response = await api.getEvents("football", "nfl", "", new_token);

            //console.log("#UNIT TRACKER# EVENTS:", response.result);

            return response.result
        } else {
            console.log("[fetchEvents] - Not authenticated yet...");
            return null;
        }
    }

    const fetchBets = async () => {
        if (authStatus === 'authenticated') {
            const new_token = await fetchToken();
            const response = await api.getBets(new_token);

            //console.log("BETS:", response);

            return response.result
        } else {
            console.log("[fetchBets] - Not authenticated yet...");
            return null;
        }
    }

    // Get the player count first
    const { data: playerQueryList, isPending: isPendingPlayerList } = useQuery({
        queryKey: ["playerQueryList"],
        queryFn: () => fetchPlayerQueryList(),
        gcTime: Infinity,
        enabled: authStatus === 'authenticated'
    });

    const combinePlayers = useCallback((results) => {
        return {
            data: results.map((result) => result.data).flat(),
            pending: results.some((result) => result.isPending)
        };
    });

    // Now, in parallel, call the get players api split into several even calls, and combine them
    const { data: players, isPending: isPendingPlayers } = useQueries({
        queries: playerQueryList
        ? playerQueryList.map((page) => {
            return {
                queryKey: ["players", page],
                queryFn: () => fetchPlayers(page),
                gcTime: Infinity,
            }
        })
        : [],
        combine: combinePlayers
    });

    // Get the teams
    const { data: teams, isPending: isPendingTeams } = useQuery({
        queryKey: ["teams"],
        queryFn: () => fetchTeams(),
        gcTime: Infinity,
        enabled: authStatus === 'authenticated'
    });

    // Get the events
    const { data: events, isPending: isPendingEvents } = useQuery({
        queryKey: ["events"],
        queryFn: () => fetchEvents(),
        gcTime: Infinity,
        enabled: authStatus === 'authenticated'
    });

    // Get bets
    const { data: bets, isPending: isPendingBets } = useQuery({
        queryKey: ["bets"],
        queryFn: () => fetchBets(),
        gcTime: Infinity,
        enabled: authStatus === 'authenticated'
    });


    // Use the value of authStatus to decide which page to render
    return (
        <Layout>
            {authStatus === 'configuring' && 'Loading...'}
            { authStatus !== 'authenticated' ? 
                <Authenticator loginMechanisms={['email']} hideSignUp formFields={formFields} className="mt-5" /> 
                : isPendingPlayerList || isPendingPlayers || isPendingTeams || isPendingEvents || isPendingBets || players.length === 0 
                    ? <Spinner as="span" animation="border" size="lg" role="status" aria-hidden="true" />
                    : <Home players={players} teams={teams} events={events} bets={bets} userGroups={userGroups} token={token} />
            }
        </Layout>
    )
}

const Default = () => (
    <Authenticator.Provider>
        <App />
    </Authenticator.Provider>
);

export default Default;