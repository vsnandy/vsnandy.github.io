import React from 'react';
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import NavDropdown from 'react-bootstrap/NavDropdown';

const MyNavbar = ({ switchPage, userAttributes, signOut }) => (
    <Navbar expand="lg" bg="dark" data-bs-theme="dark" className="px-3">
        <Container>
            <Navbar.Brand>Unit Tracker</Navbar.Brand>
            <Navbar.Toggle aria-controls="responsive-navbar-nav" />
            <Navbar.Collapse id="responsive-navbar-nav">
                <Nav className="me-auto" defaultActiveKey="dashboard">
                    <Nav.Link eventKey="dashboard" onClick={() => switchPage('dashboard')}>Dashboard</Nav.Link>
                    <Nav.Link eventKey="bet-slip" onClick={() => switchPage('bet-slip')}>Bet Slip</Nav.Link>
                </Nav>
                <Nav>
                    <NavDropdown title={userAttributes["nickname"]}>
                        <NavDropdown.Item onClick={() => signOut()}>Sign Out</NavDropdown.Item>
                    </NavDropdown>
                </Nav>
            </Navbar.Collapse>
        </Container>
    </Navbar>
  );
  
export default MyNavbar;