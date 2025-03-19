import React, { useMemo } from 'react';
import { Link, graphql, useStaticQuery } from 'gatsby';
import Img from 'gatsby-image';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';

import './navbar.css';

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

const MyNavbar = () => (
  <Navbar style={{ "background": 'maroon' }} variant="dark" expand="sm" className="px-3">
    <Link to="/" className="text-decoration-none"><Navbar.Brand as="span">Varun Nandyal</Navbar.Brand></Link>
    {/*<Image src="varun-bitmoji.png" style={{ width: '35px' }} alt="Bitmoji" />*/}
    <Navbar.Toggle aria-controls="basic-navbar-nav" />
    <Navbar.Collapse id="basic-navbar-nav" className="justify-content-end">
      <Nav className="ml-auto" defaultActiveKey="/">
        <Nav.Link eventKey="/" as="span"><Link to="/" className="nav-link">Home</Link></Nav.Link>
        <Nav.Link eventKey="projects" as="span"><Link to="/projects/" className="nav-link">Projects</Link></Nav.Link>
        <Nav.Link eventKey="about" as="span"><Link to="/about/" className="nav-link">About</Link></Nav.Link>
      </Nav>
    </Navbar.Collapse>
  </Navbar>
);

export default MyNavbar;