import React, { useMemo } from 'react';
import { graphql, useStaticQuery } from 'gatsby';
import Img from 'gatsby-image';
import Container from 'react-bootstrap/Container';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/row';

import SEO from '../components/seo';
import Layout from '../components/layout';

import { work, education } from '../db/about-db';

// GraphQL query to grab logos
const Image = ({ src, alt, ...rest }) => {
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
    return <img src={publicURL} {...rest} alt={alt} />;
  }

  return <Img fluid={childImageSharp.fluid} {...rest} />;
}

const Work = ({ item }) => {
  return (
    <Row className="justify-content-start  border-bottom border-dark py-2">
      <Col xs="auto">
        <Image src={item.icon} style={{ width: '4.9rem' }} className="mr-2" alt="Logo" />
      </Col>
      <Col className="px-0">
        <header style={{ fontWeight: 500, fontSize: '1rem' }}>{item.title}</header>
        <p style={{ fontSize: '0.9rem' }} className="m-0">{item.company}</p>
        <p style={{ fontSize: '0.9rem' }} className="m-0 text-muted">{item.start_date} &ndash; {item.end_date}</p>
        <p style={{ fontSize: '0.9rem' }} className="m-0 text-muted">{item.location}</p>
      </Col>
    </Row>
  );
}

const Education = ({ item }) => {
  return (
    <Row className="justify-content-start border-bottom border-dark py-2">
      <Col xs="auto">
        <Image src={item.icon} style={{ width: '4.9rem' }} className="mr-2" alt="Logo" />
      </Col>
      <Col className="px-0">
        <header style={{ fontWeight: 500, fontSize: '1rem' }}>{item.institution}</header>
        <p style={{ fontSize: '0.9rem' }} className="m-0">{item.degree}, {item.major}</p>
        <p style={{ fontSize: '0.9rem' }} className="m-0 text-muted">{item.start_date} &ndash; {item.end_date}</p>
        <p style={{ fontSize: '0.9rem' }} className="m-0 text-muted">{item.location}</p>
      </Col>
    </Row>
  );
}

const About = () => {
  return (
    <Container>
      <h1 className="text-center my-3">About Me</h1>
      <Image src={"varun-bitmoji.png"} style={{ width: '10rem' }} className="mx-auto" alt="Bitmoji" />
      <Col sm="10" md="8" lg="6" className="mx-auto mb-4">
        <p>
          I entered the work force in August 2019 after graduating from the University of Minnesota &mdash; Twin Cities. I majored in Computer Engineering,
          but I am currently working in the software field. 
        </p>
        <p>
          Specifically, I have gained expertise in <b>Cloud</b> technologies (Microsoft Azure), <b>Data Visualization</b> (Power BI), <b>Agile</b>, and <b>DevOps</b>.
          I'm always eager to learn new things and I'll be using this site to document my side projects.
        </p>
        <p>
          Please reach out to me through <a href="mailto:varun.nandyal@gmail.com" style={{ textDecoration: "none" }}>Email</a> or 
          on <a href="https://www.linkedin.com/in/varun-nandyal-606946125/" style={{ textDecoration: "none" }}>LinkedIn</a> if you would like to get in touch.
          Additionally, check out my <a href="https://github.com/vsnandy" style={{ textDecoration: "none" }}>GitHub</a> if you're interested in seeing the code behind my projects!
        </p>
        <p>
          Here's a brief overview of my work experience and educational background:
        </p>
      </Col>
      <h3 className="border-top border-dark pt-3">Work</h3>
      <Container className="d-flex flex-column-reverse">
        {work.map((w) => <Work key={w.id} item={w} /> )}
      </Container>
      <h3 className="pt-3">Education</h3>
      <Container className="d-flex flex-column-reverse">
        {education.map((e) => <Education key={e.id} item={e} /> )}
      </Container>
    </Container>
  );
}

const App = () => (
  <Layout>
    <SEO title="About" />
    <About />
  </Layout>
)

export default App;