import React from 'react';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';

const FFLNavbar = ({ state, dispatch }) => {
  const setPage = (key) => {
    dispatch([{ field: 'page', value: key }]);
  }

  return (
    <Navbar bg="dark" variant="dark" expand="sm" className="sticky-top">
      <Navbar.Brand style={{ overflowX: 'hidden', maxWidth: '66%', textOverflow: 'ellipsis' }}>{state.leagueInfo.settings.name}</Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav activeKey={state.page} onSelect={(key) => setPage(key)} className="ml-auto">
          <Nav.Item>
            <Nav.Link eventKey="leagueSearch">League Search</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="leagueOverview">League Overview</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="teamInfo">Team Info</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="playerData">Player Data</Nav.Link>
          </Nav.Item>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
}

export default FFLNavbar;
