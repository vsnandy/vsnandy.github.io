import React from "react";
import { useStaticQuery, graphql } from 'gatsby';
import Img from 'gatsby-image';
import { FaGithub, FaLinkedin, FaEnvelope } from 'react-icons/fa';

// Bootstrap
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import Layout from "../components/layout";
import SEO from "../components/seo";

import 'bootstrap/dist/css/bootstrap.min.css';

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

  return <Img fixed={data.file.childImageSharp.fixed} style={{ borderRadius: 1000, width: "13rem", height: "13rem", marginBottom: "1rem", maxWidth: '100%' }} />
}

const Home = () => (
  <Container className="d-flex flex-column">
    <Row xs={1} className="justify-content-center mt-4">
      <Col xs="auto"><ProfilePic /></Col>
    </Row>
    <Row xs={3} className="justify-content-center">
      <Col xs="auto">
        <a href="https://github.com/vsnandy" aria-label="GitHub">
          <FaGithub size="2em" color="maroon" />
        </a>
      </Col>
      <Col xs="auto">
        <a href="mailto:varun.nandyal@gmail.com" aria-label="Email">
          <FaEnvelope size="2em" color="maroon" />
        </a>
      </Col>
      <Col xs="auto">
        <a href="https://www.linkedin.com/in/varun-nandyal-606946125/" aria-label="LinkedIn">
          <FaLinkedin size="2em" color="maroon" />
        </a>
      </Col>
    </Row>
    <Row xs={1} className="justify-content-center mt-4">
      <Col xs={10} md={8} lg={6} className="text-wrap">
        <p>Hi, I'm Varun. Welcome to my site!</p>
        <p>
          I'm a software engineer, currently working at a large consulting firm.
          My current area of focus is in data science and visualization,
          but I enjoy learning about new technologies.
        </p>
        <p>
          I'll be using this site to showcase the projects I've been working on.
          I hope you like it!
        </p>
      </Col>
    </Row>
  </Container>
)

const IndexPage = () => (
  <Layout>
    <SEO title="Varun Nandyal" />
    <Home />
  </Layout>
);

export default IndexPage;
