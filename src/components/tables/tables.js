import React from 'react';
import Table from 'react-bootstrap/Table';

import './tables.css';

export const convertToDictArray = (headers, rows) => {
  return rows.map(row => {
    let itemDict = {};
    headers.forEach((header, idx) => {
      itemDict[header] = row[idx];
    });
    return itemDict;
  });
}

export const convertToArrays = (itemDict) => {
  return [];
}

export const SimpleTable = ({ headers, rows }) => {
  return (
    <Table bordered hover striped style={{ overflow: 'auto' }}>
      <thead className="thead-dark">
        <tr>
          {headers.map((h, idx) => <th key={idx} className="sticky-top">{h}</th>)}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, idx) => {
          return (
            <tr key={idx}>
              {row.map((val, vidx) => <td key={vidx} className="align-middle">{val}</td>)}
            </tr> 
          );}
        )}
      </tbody>
    </Table>
  );
}

export const SmallSimpleTable = ({ headers, rows }) => {
  return (
    <Table size="sm" hover striped style={{ overflow: 'auto' }}>
      <thead className="thead-dark">
        <tr>
          {headers.map((h, idx) => <th key={idx} className="sticky-top">{h}</th>)}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, idx) => {
          return (
            <tr key={idx}>
              {row.map((val, vidx) => <td key={vidx} className="align-middle">{val}</td>)}
            </tr> 
          );}
        )}
      </tbody>
    </Table>
  );
}