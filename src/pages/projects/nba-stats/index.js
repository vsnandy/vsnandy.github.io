import React, { useState } from 'react';
import { ApolloProvider, useQuery } from '@apollo/client';
import client from '../../../apollo-client';

import Layout from '../../../components/layout';
import Seo from '../../../components/seo';
import Container from 'react-bootstrap/Container';

import * as nba from '../../../api/nba-graph';
import { Spinner } from 'react-bootstrap';

const App = () => {
    const { loading, error, data } = useQuery(nba.GET_ALL_STATS_FOR_TEAM, {
        variables: {
            teamAbbr: 'LAL'
        }
    });

    console.log("NBA Stats - data:", data);
    console.log("NBA Stats - loading:", loading);
    console.log("NBA Stats - error:", error);

    return (
        <Layout>
            <Seo title="NBA Stats" />
            <Container className="my-4 d-flex flex-column align-items-center" style={{ width: '75%' }} fluid>
                <h1>NBA Stats</h1>
                <p>NBA Stats is a project that provides statistics and information about NBA teams.</p>
                <p>It uses the NBA GraphQL API to fetch data about teams, players, and games.</p>
                <p>NBA Stats is a great way to get insights into the performance of your favorite teams and players.</p>
                <p>It is built using React, Apollo Client, and GraphQL.</p>
                <p>NBA Stats is a work in progress and will be updated with more features and data in the future.</p>
                { loading 
                    ? <Spinner animation="border" role="status" />
                    : <h1>{data.team.teamName}</h1>
                }
            </Container>
        </Layout>
    );
}

const Default = () => (
    <ApolloProvider client={client}>
        <App />
    </ApolloProvider>
);

export default Default;