import React from "react";

import Layout from "../components/layout";
import Image from "../components/image";
import SEO from "../components/seo";

import "../styles/page.css";

const Home = () => (
  <main style={{margin: "5rem 1rem"}}>
    <header className="top-header">Welcome!</header>
    <div className="medium-text">
      <p>
        Hi! I'm Varun. I'm putting together this site to showcase the projects I've been working on.
      </p>
      <p>
        Take some time to check out the site.
      </p>
    </div>
  </main>
);

const IndexPage = () => (
  <Layout>
    <SEO title="Home" />
    <Home />
  </Layout>
);

export default IndexPage;
