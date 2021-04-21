import React from 'react';
import { GiAmericanFootballHelmet, GiSyringe, GiDiscGolfBasket, GiBasketballJersey } from 'react-icons/gi';

import '../styles/page.css';

export const projects = [
  {
    id: 1,
    category: "Sports",
    title: "ESPN Fantasy Football",
    description: "Explore your ESPN league's fantasy football data all in one place.",
    icon: <GiAmericanFootballHelmet size="3rem" color="maroon" className="mb-2" />,
    link: "/projects/fantasy-football/"
  },
  {
    id: 2,
    category: "Health",
    title: "MN COVID Vaccine",
    description: "Look for available vaccine appointments in Minnesota",
    icon: <GiSyringe size="3rem" color="maroon" className="mb-2" />,
    link: "/projects/mn-covid/"
  },
  {
    id: 3,
    category: "Sports",
    title: "Disc Golf Tracker",
    description: "Keep track of your disc golf courses, scores, discs, and more.",
    icon: <GiDiscGolfBasket size="3rem" color="maroon" className="mb-2" />,
    link: "/projects/disc-golf"
  },
  {
    id: 4,
    category: "Sports",
    title: "NBA Analytics",
    description: "Explore NBA data.",
    icon: <GiBasketballJersey size="3rem" color="maroon" className="mb-2" />,
    link: "/projects/nba-analytics"
  },
];
