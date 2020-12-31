import React, { useMemo } from 'react';
import { graphql, useStaticQuery } from 'gatsby';
import Img from 'gatsby-image';

import SEO from '../components/seo';
import Layout from '../components/layout';

import { work, education } from '../db/about-db';

//import myPic from '../images/horsetooth-reservoir-cropped.jpg';
import '../styles/page.css';

// GraphQL query to grab logos
const Image = ({ src, ...rest }) => {
  const data = useStaticQuery(graphql`
    query {
      images: allFile(
        filter: { internal: { mediaType: { regex: "/image/" } } }
      ) {
        edges {
          node {
            relativePath
            extension
            publicURL
            childImageSharp {
              fluid {
                ...GatsbyImageSharpFluid
              }
            }
          }
        }
      }
    }
  `);

  const match = useMemo(
    () => data.images.edges.find(({ node }) => src === node.relativePath),
    [data, src]
  );

  if(!match) return null;

  const { node: { childImageSharp, publicURL, extension } = {} } = match;

  if(extension === 'svg' || !childImageSharp) {
    return <img src={publicURL} {...rest} />;
  }

  return <Img fluid={childImageSharp.fluid} {...rest} />;
}

const Work = ({ item, details_class }) => {
  const icon = require(`../images/${item.icon}`);

  return (
    <div className="about-card">
      {/*<img className="about-icon" src={icon} alt={`Couldn't find: ${item.icon}`} />*/}
      <Image src={item.icon} className="about-icon" alt="Logo" />
      <div className={details_class}>
        <div style={{ fontSize: "1rem", fontWeight: 500 }}>{item.title}</div>
        <div style={{ fontSize: "0.9rem" }}>{item.company}</div>
        <div style={{ fontSize: "0.9rem", color: "gray" }}>{item.start_date} &ndash; {item.end_date}</div>
        <div style={{ fontSize: "0.9rem", color: "gray" }}>{item.location}</div>
      </div>
    </div>
  );
}

const Education = ({ item, details_class }) => {
  const icon = require(`../images/${item.icon}`);

  return (
    <div className="about-card">
      <Image src={item.icon} className="about-icon" alt="Logo" />
      <div className={details_class}>
        <div style={{ fontSize: "1rem", fontWeight: 500 }}>{item.institution}</div>
        <div style={{ fontSize: "0.9rem" }}>{item.degree}, {item.major}</div>
        <div style={{ fontSize: "0.9rem", color: "gray" }}>{item.start_date} &ndash; {item.end_date}</div>
        <div style={{ fontSize: "0.9rem", color: "gray" }}>{item.location}</div>
      </div>
    </div>
  )
}

const About = () => {
  return (
    <Layout>
      <main className="page">
        <SEO title="About" />
        <header className="top-header">About Me</header>
        <div></div>
        <header className="about-section-header">Work</header>
        <div className="about-section">
          {work.map((w, idx) => {
            let details_class = "about-details";
            // if last item, change the className
            if(idx === 0) {
              details_class = "about-details-first";
            }
            return <Work key={w.id} item={w} details_class={details_class} />
          })}
        </div>
        <header className="about-section-header">Education</header>
        <div className="about-section">
          {education.map((e, idx) => {
            let details_class = "about-details";
            // if last item, change the className
            if(idx === 0) {
              details_class = "about-details-first";
            }
            return <Education key={e.id} item={e} details_class={details_class} />
          })}
        </div>
        {/*
        <div className="body-text">
          <p>
            Hi, I'm <b style={{fontWeight: "500"}}>Varun</b>.
            I'm a 23 year old guy from Minnesota, currently living in the Greater Chicago area.
          </p>
          <p>
            I created this site as a way for me to track all the projects and work I've been doing
            in my free time.
          </p>
        </div>
        */}
        {/*
        <div className="image">
          <img src={myPic} alt="My Pic" />
        </div>
        */}
      </main>
    </Layout>
  );
}

export default About;