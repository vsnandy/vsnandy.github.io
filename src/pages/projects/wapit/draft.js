import React, { useState } from 'react';

/*
const Draft = () => (
    <Container className="text-center"> 
        { leaguePending || playersPending || wapitPending
            ? <Spinner as="span" animation="border" size="lg" role="status" aria-hidden="true" />
            : league["draft"].length === 0 ?
            <Draft league={league} players={players} schools={schools} token={token} /> : <Dashboard league={league} players={players} schools={schools} wapitStats={wapitStats} token={token} />
        }
    </Container>
);
*/

const Draft = () => {
    return (
        <div>
            <h1>WAPIT Draft</h1>
            <p>This is the WAPIT draft.</p>
        </div>
    );
}

export default Draft;