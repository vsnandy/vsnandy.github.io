import React from 'react';
import { GiAmericanFootballHelmet } from 'react-icons/gi';
import { AiOutlineStock } from 'react-icons/ai';

import '../styles/page.css';

export const projects = [
  {
    id: 1,
    category: "Sports",
    title: "ESPN Fantasy Football",
    description: "Explore your ESPN league's fantasy football data all in one place.",
    icon: <GiAmericanFootballHelmet size="3rem" color="maroon" />,
    link: "/projects/fantasy-football/"
  },
  /*
  {
    id: 2,
    category: "Sports",
    title: "Fantasy Football Analysis",
    description: "The purpose of this project is to collect, clean, transform, and analyze various ESPN Fantasy Football data.",
    icon: <GiAmericanFootballHelmet size={"3rem"} className="card-icon" />,
    link: "/projects/fantasy-football"
  },
  {
    id: 3,
    category: "Finance",
    title: "Stock Market Analysis",
    description: "Analyze the stock market trends.",
    icon: <AiOutlineStock size="3rem" color="green" />,
    link: "/"
  },
  {
    id: 4,
    category: "Finance",
    title: "Stock Market Analysis",
    description: "Analyze the stock market trends.",
    icon: <AiOutlineStock size="3rem" color="green" />,
    link: "/"
  },
  {
    id: 5,
    category: "Finance",
    title: "Stock Market Analysis",
    description: "Analyze the stock market trends.",
    icon: <AiOutlineStock size="3rem" color="green" />,
    link: "/"
  }
  */
];