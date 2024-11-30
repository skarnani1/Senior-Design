import React from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';

function ResultsTable({ data }) {
  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Team 1</TableCell>
            <TableCell>Team 2</TableCell>
            <TableCell>Bet Type</TableCell>
            <TableCell>Bet Info</TableCell>
            <TableCell>Odds</TableCell>
            <TableCell>Date of Game</TableCell>
            <TableCell>DateTime</TableCell>
            <TableCell>Sportsbook Name</TableCell>
            <TableCell>Sport</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((row, index) => (
            <TableRow key={index}>
              <TableCell>{row.team1}</TableCell>
              <TableCell>{row.team2}</TableCell>
              <TableCell>{row.betType}</TableCell>
              <TableCell>{row.betInfo}</TableCell>
              <TableCell>{row.odds}</TableCell>
              <TableCell>{row.dateOfGame}</TableCell>
              <TableCell>{row.dateTime}</TableCell>
              <TableCell>{row.sportsbookName}</TableCell>
              <TableCell>{row.sport}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default ResultsTable;