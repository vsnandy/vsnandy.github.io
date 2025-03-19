import React, { useState } from 'react';
import Card from 'react-bootstrap/Card';

import { SlipWeeklyPropTile } from '../dashboard/weekly-prop-tile'; 

import './bet-slip.css';

const BetSlip = ({ slip, setSlip, week, userAttributes }) => {
    console.debug("SLIP:", slip);
    return ( slip.length === 0
        ? <Card.Body>No props in bet slip. Add some props before you can submit the bet slip.</Card.Body>
        : <SlipWeeklyPropTile slip={slip}  setSlip={setSlip} userAttributes={userAttributes} week={week} />
    );
}

export default BetSlip;