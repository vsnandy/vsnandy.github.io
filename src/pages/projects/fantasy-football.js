import React from 'react';
import { Bar } from 'react-chartjs-2';

import Layout from '../../components/layout';
import SEO from '../../components/seo';
import * as ffl from '../../api/football';
import LeagueSearchCard from '../../components/fantasy-football/league-search-card';
import FFLNavbar from '../../components/fantasy-football/ffl-navbar';

import '../../styles/page.css';

class TeamInfo extends React.Component {
  state = {
    classes: {
      "Home": "ffl-navbar-button",
      "League Info": "ffl-navbar-button",
      "Team Info": "ffl-navbar-button-selected"
    }
  }

  // render wins chart by owner
  renderWinsChart = () => {
    const teams = this.props.currentTeamsInfo;

    // get the labels
    let data = {}
    const labels = [];
    const datasets = []
    const dataPoints = [];
    teams.forEach((team) => {
      labels.push(team.name);
      dataPoints.push(team.wins);
    });
    datasets.push({
      label: "Wins",
      backgroundColor: 'red',
      borderColor: 'black',
      borderWidth: 1,
      data: dataPoints,
    });
    data = {labels, datasets};

    return (
      <Bar
        data={data}
        width={500}
        height={250}
        options={{
          maintainAspectRatio: false,
          scales: {
            yAxes: [{
              ticks: {
                beginAtZero: true
              }
            }]
          }
        }}
      />
    );
  }

  render() {
    return (
      <div className="ffl-container">
        <FFLNavbar classes={this.state.classes} changeView={this.props.changeView}/>
        <header className="chart-title">Regular Season Wins by Team</header>
        {this.renderWinsChart()}
      </div>
    );
  }
}

class LeagueInfo extends React.Component {
  state = {
    classes: {
      "Home": "ffl-navbar-button",
      "League Info": "ffl-navbar-button-selected",
      "Team Info": "ffl-navbar-button"
    }
  }

  // render lineup chart
  renderLineupsChart = () => {
    const lineupPositionCount = this.props.leagueInfo.rosterSettings.lineupPositionCount;

    // get the labels
    let data = {}
    const labels = [];
    const datasets = []
    const dataPoints = [];
    for(var key in lineupPositionCount) {
      labels.push(key);
      dataPoints.push(lineupPositionCount[key]);
    }
    datasets.push({
      label: "Counts",
      backgroundColor: 'blue',
      borderColor: 'black',
      borderWidth: 1,
      data: dataPoints,
    });
    data = {labels, datasets};

    return (
      <Bar
        data={data}
        width={500}
        height={250}
        options={{
          maintainAspectRatio: false
        }}
      />
    );
  }

  render() {
    return (
      <div className="ffl-container">
        <FFLNavbar classes={this.state.classes} changeView={this.props.changeView}/>
        <header className="chart-title">Lineup Counts by Position</header>
        {this.renderLineupsChart()}
      </div>
    );
  }
}

class FFLHome extends React.Component {
  state = {
    leagueId: "",
    seasonId: "",
    leagueInfo: null,
    currentTeamsInfo: null,
    errorMessage: null,
    selectedView: "Home",
    classes: {
      "Home": "ffl-navbar-button-selected",
      "League Info": "ffl-navbar-button",
      "Team Info": "ffl-navbar-button"
    }
  }

  onLeagueIdChange = (e) => {
    this.setState({
      leagueId: e.target.value
    });
  }

  onSeasonIdChange = (e) => {
    this.setState({
      seasonId: e.target.value
    });
  }

  // Get the League info data
  fetchLeagueInfo = async () => {
    console.log("Fetching League Info for:\nLeagueId: " + this.state.leagueId + "\nSeasonId: " + this.state.seasonId);
    const result = await ffl.getLeagueInfo(this.state.leagueId, this.state.seasonId);

    if(result.status === 200) {
      this.setState({
        leagueInfo: result.result.data,
        errorMessage: null
      });
    } else {
      this.setState({
        leagueInfo: null,
        errorMessage: "The entered combination of League ID & Season ID did not match any leagues. Please try again."
      });
    }
  }

  // Get the Teams info
  fetchCurrentTeamsInfo = async () => {
    console.log("Fetching current teams");
    const result = await ffl.getCurrentTeamsInfo(this.state.leagueId, this.state.seasonId);

    if(result.status === 200) {
      this.setState({
        currentTeamsInfo: result.result.data,
      });
    } else {
      this.setState({
        currentTeamsInfo: null
      });
    }
  }

  // Make API calls
  fetchFFLData = async () => {
    await this.fetchLeagueInfo();
    await this.fetchCurrentTeamsInfo();

    // set page to LeagueInfo to start
    if(this.state.errorMessage === null) {
      this.changeView("League Info");
    }
  }

  // Change the view
  changeView = view => {
    this.setState({
      selectedView: view
    });
  }

  // render the selected page
  renderPage = () => {
    if(this.state.selectedView === "Home") {
      return (
        <LeagueSearchCard 
          errorMessage={this.state.errorMessage} 
          onLeagueIdChange={this.onLeagueIdChange}
          onSeasonIdChange={this.onSeasonIdChange}
          fetchFFLData={this.fetchFFLData}
        />
      );
    } else if(this.state.selectedView === "League Info") {
      return (
        <LeagueInfo changeView={this.changeView} leagueInfo={this.state.leagueInfo} />
      );
    } else if(this.state.selectedView === "Team Info") {
      return (
        <TeamInfo changeView={this.changeView} currentTeamsInfo={this.state.currentTeamsInfo} />
      );
    }
  }

  render() {
    return (
      <Layout>
        <div className="page">
          <SEO title="Fantasy Football" />
          <header className="top-header">Fantasy Football Analysis</header>
          <div className="ffl-container">
            {this.renderPage()}
          </div>
        </div>
      </Layout>
    );
  }
}

export default FFLHome;