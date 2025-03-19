import React from 'react';
import { GiAmericanFootballHelmet, GiSyringe, GiDiscGolfBasket, GiBasketballJersey, GiAirplaneDeparture } from 'react-icons/gi';
import { AiOutlineStock } from 'react-icons/ai';

import '../styles/page.css';

const svg_size = "36";
const svg_color = "maroon";
const svg_class = "mb-2";

export const projects = [
  {
    id: 1,
    category: "Sports",
    title: "ESPN Fantasy Football",
    description: "Explore your ESPN league's fantasy football data all in one place.",
    icon: <GiAmericanFootballHelmet size={svg_size} color={svg_color} className={svg_class} />,
    link: "/projects/fantasy-football/",
    active: true
  },
  {
    id: 2,
    category: "Finance",
    title: "Stock Market Analysis",
    description: "Check out various stock charts for stocks on the US stock exchange.",
    icon: <AiOutlineStock size={svg_size} color={svg_color} className={svg_class} />,
    link: "/projects/stock-market-analysis/",
    active: false
  },
  {
    id: 3,
    category: "Health",
    title: "MN COVID Vaccine",
    description: "Look for available vaccine appointments in Minnesota",
    icon: <GiSyringe size={svg_size} color={svg_color} className={svg_class} />,
    link: "/projects/mn-covid/",
    active: false
  },
  {
    id: 4,
    category: "Sports",
    title: "Disc Golf Tracker",
    description: "Keep track of your disc golf courses, scores, discs, and more.",
    icon: <GiDiscGolfBasket size={svg_size} color={svg_color} className={svg_class} />,
    link: "/projects/disc-golf",
    active: false
  },
  {
    id: 5,
    category: "Sports",
    title: "NBA Analytics",
    description: "Explore NBA data.",
    icon: <GiBasketballJersey size={svg_size} color={svg_color} className={svg_class} />,
    link: "/projects/nba-analytics",
    active: false
  },
  {
    id: 6,
    category: "Sports",
    title: "Unit Tracker",
    description: "Unit tracker for NFL",
    icon: <GiAmericanFootballHelmet size={svg_size} color={svg_color} className={svg_class} />,
    link: "/projects/unit-tracker",
    active: true
  },
  {
    id: 7,
    category: "Travel",
    title: "Trip Tracker",
    description: "Analyze your flight patterns",
    icon: <GiAirplaneDeparture size={svg_size} color={svg_color} className={svg_class} />,
    link: "/projects/trip-tracker",
    active: false
  }
];
