import React from 'react';

import SEO from '../components/seo';
import Layout from '../components/layout';

import myPic from '../images/horsetooth-reservoir-cropped.jpg';
import '../styles/page.css';

const About = () => {
  return (
    <Layout>
      <main className="page">
        <SEO title="About Me" />
        <header className="top-header">About Me</header>
        <div style={{display: "flex", justifyContent: "center"}}>
          <div className="medium-text">
            {/*
            <p>
              Hi, I'm <b style={{fontWeight: "500"}}>Varun</b>.
              I'm a 23 year old guy from Minnesota, currently living in the Greater Chicago area.
            </p>
            <p>
              I created this site as a way for me to track all the projects and work I've been doing
              in my free time.
            </p>
            */}
          </div>
          {/*
          <div className="image">
            <img src={myPic} alt="My Pic" />
          </div>
          */}
        </div>
      </main>
    </Layout>
  );
}

export default About;