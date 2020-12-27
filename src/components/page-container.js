import React from 'react';

import Navbar from "../components/navbar/navbar";
import Sidebar from "../components/sidebar/sidebar";
import Backdrop from "../components/backdrop/backdrop";

import "../styles/page.css";

class PageContainer extends React.Component {
  state = {
    sideBarOpen: false,
  };

  drawerToggleClickHandler = () => {
    this.setState((prevState) => {
      return {
        sideBarOpen: !prevState.sideBarOpen
      };
    });
  };

  backdropClickHandler = () => {
    this.setState({
      sideBarOpen: false,
    });
  };

  render() {
    let backdrop;

    if(this.state.sideBarOpen) {
      backdrop = <Backdrop click={this.backdropClickHandler} />
    }

    return (
      <div style={{height: '100%'}}>
        <Navbar drawerClickHandler={this.drawerToggleClickHandler} />
        <Sidebar show={this.state.sideBarOpen} />
        {backdrop}
      </div>
    );
  }
}

export default PageContainer;