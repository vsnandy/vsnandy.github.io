import React from 'react';

import './league-search-card.css';

const LeagueSearchCard = props => {
  return (
    <div className="ffl-search-box">
      <div style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Enter League Information:</div>
      <div style={{ fontSize: '0.75rem', fontStyle: 'italic', color: 'red' }}>{props.errorMessage}</div>
      <div>
        League ID:
        <input title="League ID" placeholder="League ID..." className="ffl-input" onChange={props.onLeagueIdChange} />
      </div>
      <div>
        Season ID:
        <input title="Season ID" placeholder="Season ID..." className="ffl-input" onChange={props.onSeasonIdChange} />
      </div>
      <button className="ffl-submit" name="Submit" onClick={props.fetchFFLData}>Submit</button>
    </div>
  );
}

export default LeagueSearchCard;