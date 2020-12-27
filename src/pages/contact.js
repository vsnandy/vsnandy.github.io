import React from 'react';

import SEO from '../components/seo';
import Layout from '../components/layout';

import '../styles/page.css';

const Contact = () => {
  return (
    <Layout>
      <main style={{margin: "6rem 1rem"}}>
        <SEO title="Contact" />
        <header className="top-header">Reach Me</header>
        <div className="medium-text">
          
        </div>
      </main>
    </Layout>
  );
}

export default Contact;