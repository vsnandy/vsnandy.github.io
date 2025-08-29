import React, { useState } from 'react';
import { Authenticator, useAuthenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import { Amplify } from 'aws-amplify';
import Spinner from 'react-bootstrap/Spinner';
import awsExports from '../../../aws-exports';
import { fetchAuthSession } from 'aws-amplify/auth';
import { useQuery } from '@tanstack/react-query';
import { navigate } from 'gatsby';

import Container from 'react-bootstrap/Container';
import ListGroup from 'react-bootstrap/ListGroup';
import ListGroupItem from 'react-bootstrap/ListGroupItem';

import Layout from '../../../components/layout';
import Seo from '../../../components/seo';

import * as ncaa from '../../../api/vsnandy-lambda-api/ncaa';

import '../../../styles/wapit.css';

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
    const { user, signOut } = useAuthenticator((context) => [context.user]);

    const navigateToLeague = (league) => {
        console.log(league);
        navigate(`/projects/wapit/dashboard?leagueId=${league}`);
    }

    console.log("[Home] - User Groups:", userGroups);
    console.log("[Home] - User:", user);

    const toPascalCase = (phrase) => {
        return phrase.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ');
    };

    if (userGroups.length === 0) {
        return (
            <Container fluid>
                <p>Looks like you aren't part of any WAPIT leagues. Check with your league manager to be added.</p>
            </Container>
        );
    }

    return (
        <Container className="my-4 d-flex flex-column align-items-center" style={{ width: '75%' }} fluid>
            <h1>Hi, {user.username}!</h1>
            <div className="my-3 d-flex flex-column select-league-div w-50">
                <h4>Select a League:</h4>
                <ListGroup>
                    {userGroups.filter(group => group.startsWith("wapit_")).map((g, index) => {
                        return (
                            <ListGroupItem key={index} action onClick={() => navigateToLeague(g.slice("wapit_".length))}>
                                {toPascalCase(g.slice("wapit_".length, -4))} {g.slice(-4)}
                            </ListGroupItem>
                        );
                    })}
                </ListGroup>
            </div>
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
            <Seo title="WAPIT" />
            { authStatus === 'configuring' && <Spinner as="span" animation="border" size="lg" role="status" aria-hidden="true" /> }
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
