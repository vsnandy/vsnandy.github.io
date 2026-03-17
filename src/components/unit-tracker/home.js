import React, { useState, useEffect } from 'react';
import Container from 'react-bootstrap/Container';
import { useAuthenticator } from '@aws-amplify/ui-react';
import { fetchUserAttributes } from 'aws-amplify/auth';

import SEO from '../../components/seo';
import Dashboard from './dashboard/dashboard';
import Widget from './bet-widget/bet-widget';
import Navbar from '../../components/unit-tracker/navbar';


const Home = ({ players, teams, events, bets, userGroups, token }) => {
    const { user, signOut } = useAuthenticator((context) => [context.user]);
    const [ page, setPage ] = useState('dashboard')
    const [ userAttributes, setUserAttributes ] = useState({});
    const [ slip, setSlip ] = useState([]);

    useEffect(() => {
        const getAttributes = async () => {
            const attributes = await fetchUserAttributes();
            setUserAttributes({"username": user.username, ...attributes});
        }

        getAttributes();
    }, [page, user]);

    console.log("[Home] - User Attributes:", userAttributes);
    console.log("[Home] - User Groups:", userGroups);

    const switchPage = (page) => setPage(page);

    const renderPage = (page) => {
        switch(page) {
            case 'dashboard': return <Dashboard bets={bets} players={players} events={events} teams={teams} userAttributes={userAttributes} token={token} />;
            case 'bet-slip': return <Widget players={players} events={events} teams={teams} slip={slip} setSlip={setSlip} userAttributes={userAttributes} token={token} />;
            default: return <h1>TBD</h1>
        }
    }

    return (
        <Container fluid>
            <SEO title="Unit Tracker" description="Unit Tracker Project" />
            { user &&
                <Container fluid>
                    <Navbar switchPage={switchPage} userAttributes={userAttributes} signOut={signOut} />
                    { renderPage(page) }
                </Container>
            }
        </Container>
    );
}

export default Home;