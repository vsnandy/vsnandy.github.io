import React from 'react';
import { GiAmericanFootballHelmet } from 'react-icons/gi';

import '../styles/page.css';

export const projects = [
  {
    id: 1,
    title: "Fantasy Football Analysis",
    description: "The purpose of this project is to collect, clean, transform, and analyze various ESPN Fantasy Football data.",
    icon: <GiAmericanFootballHelmet size={"3rem"} className="card-icon" />,
    link: "/projects/fantasy-football"
  }
];