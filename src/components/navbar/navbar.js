import React, { useMemo } from 'react';
import { Link, graphql, useStaticQuery } from 'gatsby';
import Img from 'gatsby-image';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';

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
  <Navbar style={{ "background": 'maroon' }} variant="dark" expand="sm" className="active">
    <Link to="/" className="text-decoration-none"><Navbar.Brand as="span">Varun Nandyal</Navbar.Brand></Link>
    {/*<Image src="varun-bitmoji.png" style={{ width: '35px' }} alt="Bitmoji" />*/}
    <Navbar.Toggle aria-controls="basic-navbar-nav" />
    <Navbar.Collapse id="basic-navbar-nav">
      <Nav className="ml-auto">
        <Link to="/" activeClassName="active" className="text-decoration-none"><Nav.Link as="span">Home</Nav.Link></Link>
        <Link to="/projects/" activeClassName="active" className="text-decoration-none"><Nav.Link as="span">Projects</Nav.Link></Link>
        <Link to="/about/" activeClassName="active" className="text-decoration-none"><Nav.Link as="span">About</Nav.Link></Link>
      </Nav>
    </Navbar.Collapse>
  </Navbar>
);

export default MyNavbar;