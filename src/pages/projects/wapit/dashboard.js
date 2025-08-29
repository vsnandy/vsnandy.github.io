import React, { useState, useEffect } from 'react';
import { useLocation } from "@reach/router";
import { Amplify } from 'aws-amplify';
import { Authenticator, useAuthenticator } from '@aws-amplify/ui-react';
import { fetchAuthSession } from 'aws-amplify/auth';
import Container from 'react-bootstrap/Container';
import Spinner from 'react-bootstrap/Spinner';
import { useQuery } from '@tanstack/react-query';

import Dashboard from '../../../components/wapit/dashboard';
import Layout from '../../../components/layout';

import * as ncaa from '../../../api/vsnandy-lambda-api/ncaa';
import awsExports from '../../../aws-exports';

// Setup Amplify for Cognito
Amplify.configure(awsExports);

const useQueryParams = () => {
    return new URLSearchParams(useLocation().search);
}

const App = () => {
    const query = useQueryParams();
    const { user, signOut } = useAuthenticator((context) => [context.user]);
    const [token, setToken] = useState(null);
    const [userGroups, setUserGroups] = useState([]);
    const [selectedLeague, setSelectedLeague] = useState(query.get("leagueId"));

    useEffect(() => {
        const fetchToken = async () => {
            try {
                const response = (await fetchAuthSession({ forceRefresh: true })).tokens;
                console.log("[dashboard/fetchToken] - Token:", response.accessToken.toString());
                console.log("[dashboard/fetchToken] - Cognito Groups:", response.accessToken.payload["cognito:groups"]);
                if (response.accessToken.payload["cognito:groups"]) {
                    setUserGroups(response.accessToken.payload["cognito:groups"]);
                }
                setToken(response.accessToken.toString());
            } catch (err) {
                console.error("[dashboard/fetchToken] - Error fetching token:", err);
                setToken(null);
            }
        };

        fetchToken();
    }, []);

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
        enabled: !!selectedLeague && !!token
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

    return (
        <Layout>
            <Container className="text-center"> 
                { leaguePending || playersPending || wapitPending
                    ? <Spinner as="span" animation="border" size="lg" role="status" aria-hidden="true" />
                    : <Dashboard league={league} players={players} wapitStats={wapitStats} token={token} />
                }
            </Container>
        </Layout>
    );
}

const Default = () => (
    <Authenticator.Provider>
        <App />
    </Authenticator.Provider>
);

export default Default;
