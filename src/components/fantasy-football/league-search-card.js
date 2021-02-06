import React, { useState } from 'react';
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Spinner from 'react-bootstrap/Spinner';

import * as espn from '../../api/espn';

import './league-search-card.css';

const LeagueSearchCard = ({ state, dispatch }) => {
  const [details, setDetails] = useState({ leagueId: state.leagueId, seasonId: state.seasonId });
  const [validated, setValidated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);

  const handleSubmit = async (event) => {
    setIsLoading(true);
    event.persist();
    event.preventDefault(); // prevent form from re-rendering

    // using built-in validity components, check if form is valid
    const form = event.currentTarget;
    if(form.checkValidity() === false) {
      event.stopPropagation();
      setValidated(true);
      setError(false);
      setIsLoading(false);
      return;
    }

    // if leagueId and seasonId are the same as previously submitted, skip the API call
    if(details.leagueId === state.leagueId && details.seasonId === state.seasonId) {
      setError(false);
      setIsLoading(false);
      setValidated(true);

      dispatch([{ field: 'page', value: 'leagueOverview' }]);
      return;
    }

    // make the API calls
    try {
      const leagueInfo = await espn.getLeagueSettings(details.leagueId, details.seasonId);
      const currentMpId = leagueInfo.result.data.status.currentMatchupPeriod;
      const teamInfo = await espn.getTeams(details.leagueId, details.seasonId);
      const currentTeam = await espn.getTeam(details.leagueId, details.seasonId, currentMpId, 1);
      const allScores = await espn.getAllScores(details.leagueId, details.seasonId);
      const constants = await espn.getFflConstants();

      console.log("After API calls");
      setError(false);
      setIsLoading(false);
      setValidated(true);

      dispatch([
        { field: 'leagueId', value: details.leagueId },
        { field: 'seasonId', value: details.seasonId },
        { field: 'leagueInfo', value: leagueInfo.result.data },
        { field: 'teamInfo', value: teamInfo.result.data },
        { field: 'constants', value: constants.result.data },
        { field: 'currentTeam', value: currentTeam.result.data.team },
        { field: 'currentMember', value: currentTeam.result.data.member },
        { field: 'currentMpId', value: currentMpId },
        { field: 'allScores', value: allScores.result.data },
        { field: 'page', value: 'leagueOverview' }
      ]);
      return;
    } catch (err) {
      setValidated(true);
      setError(true);
      setIsLoading(false);
      event.stopPropagation();
      return;
    }
  }

  return (
    <Form noValidate validated={validated} onSubmit={handleSubmit} className="d-flex flex-column justify-content-start" >
      <h3 style={{"fontWeight": '400'}} className="mb-3">Find your league:</h3>
      <Form.Group controlId="validationCustom01" className="mt-1 mb-1">
        <Form.Label>League ID</Form.Label>
        <Form.Control 
          required type="text" 
          name="leagueId" 
          placeholder="E.g., 48153503" 
          defaultValue={state.leagueId}
          onChange={(e) => setDetails({...details, leagueId: e.target.value})} 
        />
        <Form.Text className="text-muted">
          This can be found in the URL when you login to your league on ESPN.
        </Form.Text>
        <Form.Control.Feedback type="invalid">Please input League ID.</Form.Control.Feedback>
      </Form.Group>
      <Form.Group controlId="validationCustom02" className="mt-1 mb-2">
        <Form.Label>Season ID</Form.Label>
        <Form.Control 
          required type="text" 
          name="seasonId" 
          placeholder="E.g., 2019"
          defaultValue={state.seasonId}
          onChange={(e) => setDetails({...details, seasonId: e.target.value})}
        />
        <Form.Text className="text-muted">
          This is the fantasy football year.
        </Form.Text>
        <Form.Control.Feedback type="invalid">Please input Season ID.</Form.Control.Feedback>
      </Form.Group>
      <Form.Group className="d-flex flex-column align-items-stretch">
        {error && (
          <Form.Text className="text-danger text-center mb-2">
            Invalid combination of League ID and Season ID.
          </Form.Text>
        )}
        <Button variant="primary" type="submit">
          {isLoading ? (
            <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
          ) : (
            <Container>Submit</Container>
          )}
        </Button>
      </Form.Group>
    </Form>
  );
}

export default LeagueSearchCard;
