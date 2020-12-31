import React from "react";
import { useStaticQuery, graphql } from 'gatsby';
import Img from 'gatsby-image';
import { FaGithub, FaLinkedin } from 'react-icons/fa';
import { GoMail } from 'react-icons/go';

import Layout from "../components/layout";
import SEO from "../components/seo";

import "../styles/page.css";

export const ProfilePic = () => {
  const data = useStaticQuery(graphql`
    query {
      file(relativePath: { eq: "varun-climbing.jpg" }) {
        childImageSharp {
          fixed {
            base64
            width
            height
            src
            srcSet
          }
        }
      }
    }
  `);

  return <Img fixed={data.file.childImageSharp.fixed} style={{ borderRadius: 1000, width: "13rem", height: "13rem", marginBottom: "1rem" }} />
}

const Home = () => (
  <main className="page">
    {/*<header className="top-header">Welcome!</header>*/}
    <ProfilePic />
    <ul className="social-list">
      <li className="social-list-item"><a href="https://github.com/vsnandy" style={{ color: "maroon" }} aria-label="GitHub"><FaGithub size={"2rem"} /></a></li>
      <li className="social-list-item"><a href="mailto:varun.nandyal@gmail.com" style={{ color: "maroon" }} aria-label="Email"><GoMail size={"2rem"} /></a></li>
      <li className="social-list-item"><a href="https://www.linkedin.com/in/varun-nandyal-606946125/" style={{ color: "maroon" }} aria-label="LinkedIn"><FaLinkedin size={"2rem"} /></a></li>
    </ul>
    <div className="body-text">
      <header>Hi, I'm Varun. Welcome to my site!</header>
      <p>
        I'm a software engineer, currently working as a consultant.
        My current area of focus is in data science and visualization,
        but I enjoy learning about new technologies.
      </p>
      <p>
        I'll be using this site to showcase the projects I've been working on.
        I hope you like it!
      </p>
    </div>
  </main>
);

const IndexPage = () => (
  <Layout>
    <SEO title="Varun Nandyal" />
    <Home />
  </Layout>
);

export default IndexPage;
