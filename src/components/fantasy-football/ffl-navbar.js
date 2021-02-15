import React from 'react';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Nav from 'react-bootstrap/Nav';
import DropdownButton from 'react-bootstrap/DropdownButton';

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
            <Nav.Link eventKey="leagueOverview">League</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="teamInfo">Team</Nav.Link>
          </Nav.Item>
          <NavDropdown title="Player" id="player-data-dropdown" alignRight>
            <NavDropdown.Item eventKey="playerData">
              Scoring Leaders
            </NavDropdown.Item>
          </NavDropdown>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
}

export default FFLNavbar;
