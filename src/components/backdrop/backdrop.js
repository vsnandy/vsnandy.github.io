import React from 'react';

import './backdrop.css';

const Backdrop = props => (
  <div aria-hidden="true" className="backdrop" onClick={props.click} onKeyDown={props.click} />
);

export default Backdrop;