import React from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Typography,
} from '@mui/material';

function ResultsTable({ data, title }) {
    return (
        <TableContainer
            component={Paper}
            style={{
                marginTop: '20px',
                boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
            }}
        >
            <Typography
                variant="h6"
                style={{
                    textAlign: 'center',
                    padding: '10px',
                    fontWeight: 'bold',
                    backgroundColor: '#f5f5f5',
                }}
            >
                {title}
            </Typography>
            <Table>
                <TableHead>
                    <TableRow style={{ backgroundColor: '#e0e0e0' }}>
                        <TableCell style={{ fontWeight: 'bold' }}>Team 1</TableCell>
                        <TableCell style={{ fontWeight: 'bold' }}>Team 2</TableCell>
                        <TableCell style={{ fontWeight: 'bold' }}>Bet Type</TableCell>
                        <TableCell style={{ fontWeight: 'bold' }}>Bet Info</TableCell>
                        <TableCell style={{ fontWeight: 'bold' }}>Odds</TableCell>
                        <TableCell style={{ fontWeight: 'bold' }}>Date of Game</TableCell>
                        <TableCell style={{ fontWeight: 'bold' }}>Sportsbook Name</TableCell>
                        <TableCell style={{ fontWeight: 'bold' }}>Sport</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {data.length > 0 ? (
                        data.map((row, index) => (
                            <TableRow
                                key={index}
                                style={
                                    index % 2 === 0
                                        ? { backgroundColor: '#fafafa' }
                                        : { backgroundColor: '#ffffff' }
                                }
                            >
                                <TableCell>{row.team1}</TableCell>
                                <TableCell>{row.team2}</TableCell>
                                <TableCell>{row.betType}</TableCell>
                                <TableCell>{row.betInfo}</TableCell>
                                <TableCell>{row.odds}</TableCell>
                                <TableCell>{row.dateOfGame}</TableCell>
                                <TableCell>{row.sportsbookName}</TableCell>
                                <TableCell>{row.sport}</TableCell>
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell
                                colSpan={8}
                                style={{
                                    textAlign: 'center',
                                    fontStyle: 'italic',
                                    color: '#757575',
                                }}
                            >
                                No data available
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </TableContainer>
    );
}

export default ResultsTable;
