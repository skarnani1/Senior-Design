// ArbitrageResultsTable.js
import React, { useState, useMemo } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TableSortLabel, Box, Tooltip } from '@mui/material';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';

function ArbitrageResultsTable({ data, title }) {
    const [sortBy, setSortBy] = useState(null);
    const [sortOrder, setSortOrder] = useState('asc');

    const handleSort = (property) => {
        const isAsc = sortBy === property && sortOrder === 'asc';
        setSortOrder(isAsc ? 'desc' : 'asc');
        setSortBy(property);
    };

    const sortedData = useMemo(() => {
        if (!sortBy) {
            return data;
        }

        return [...data].sort((a, b) => {
            let comparison = 0;

            const getValue = (row, path) => { // Helper function to get nested values
                return path.split('.').reduce((obj, key) => obj && obj[key], row);
            };

            const aValue = getValue(a, sortBy);
            const bValue = getValue(b, sortBy);

            if (sortBy === 'percent' || sortBy === 'row1.odds' || sortBy === 'row2.odds') { // Numeric fields
                const numA = Number(aValue);
                const numB = Number(bValue);

                if (!isNaN(numA) && !isNaN(numB)) {
                    comparison = numA - numB;
                } else if (aValue && bValue) {
                    if (String(aValue) < String(bValue)) comparison = -1;
                    if (String(aValue) > String(bValue)) comparison = 1;
                } else if (aValue) {
                    comparison = -1;
                } else if (bValue) {
                    comparison = 1;
                } else {
                    comparison = 0;
                }
            } else if (typeof aValue === 'string' && typeof bValue === 'string') { // String fields
                comparison = aValue.localeCompare(bValue);
            } else if (aValue < bValue) { // Default comparison
                comparison = -1;
            } else if (aValue > bValue) {
                comparison = 1;
            }

            return sortOrder === 'asc' ? comparison : comparison * -1;
        });
    }, [data, sortBy, sortOrder]);

    const headerCells = [
        { id: 'percent', label: 'Percent', tooltip: 'Percentage return from the arbitrage opportunity' },
        { id: 'row1.team1', label: 'Team 1 (Row 1)', tooltip: 'Team 1 for the first bet in the arbitrage' },
        { id: 'row1.team2', label: 'Team 2 (Row 1)', tooltip: 'Team 2 for the first bet in the arbitrage' },
        { id: 'row1.betType', label: 'Bet Type (Row 1)', tooltip: 'Bet type for the first bet (e.g., Moneyline, Spread)' },
        { id: 'row1.betInfo', label: 'Bet Info (Row 1)', tooltip: 'Specific bet information for the first bet' },
        { id: 'row1.odds', label: 'Odds (Row 1)', tooltip: 'Odds for the first bet' },
        { id: 'row1.sportsbookName', label: 'Sportsbook (Row 1)', tooltip: 'Sportsbook for the first bet' },
        { id: 'row1.sport', label: 'Sport (Row 1)', tooltip: 'Sport for the first bet' },
        { id: 'row2.team1', label: 'Team 1 (Row 2)', tooltip: 'Team 1 for the second bet in the arbitrage' },
        { id: 'row2.team2', label: 'Team 2 (Row 2)', tooltip: 'Team 2 for the second bet in the arbitrage' },
        { id: 'row2.betType', label: 'Bet Type (Row 2)', tooltip: 'Bet type for the second bet' },
        { id: 'row2.betInfo', label: 'Bet Info (Row 2)', tooltip: 'Specific bet information for the second bet' },
        { id: 'row2.odds', label: 'Odds (Row 2)', tooltip: 'Odds for the second bet' },
        { id: 'row2.sportsbookName', label: 'Sportsbook (Row 2)', tooltip: 'Sportsbook for the second bet' },
        { id: 'row2.sport', label: 'Sport (Row 2)', tooltip: 'Sport for the second bet' },
    ];

    if (!data || data.length === 0) {
        return <Box mt={2} textAlign="center">No arbitrage opportunities detected.</Box>;
    }

    return (
        <TableContainer component={Paper} sx={{ overflowX: 'auto' }}>
            <Table aria-label={`${title} table`}>
                <TableHead>
                    <TableRow>
                        {headerCells.map((header) => (
                            <TableCell
                                key={header.id}
                                sortDirection={sortBy === header.id ? sortOrder : false}
                            >
                                <Tooltip title={header.tooltip} placement="top" arrow> {/* Added Tooltip here */}
                                    <TableSortLabel
                                        active={sortBy === header.id}
                                        direction={sortBy === header.id ? sortOrder : 'asc'}
                                        onClick={() => handleSort(header.id)}
                                        IconComponent={({ direction }) => direction === 'desc' ? <ArrowDownwardIcon /> : <ArrowUpwardIcon />}
                                    >
                                        {header.label}
                                    </TableSortLabel>
                                </Tooltip>
                            </TableCell>
                        ))}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {sortedData.map((row, index) => (
                        <TableRow
                            key={index}
                            sx={{ '&:nth-of-type(odd)': { backgroundColor: 'rgba(0, 0, 0, 0.04)' } }}
                        >
                            <TableCell>{row.percent.toFixed(2)}%</TableCell>
                            <TableCell>{row.row1.team1}</TableCell>
                            <TableCell>{row.row1.team2}</TableCell>
                            <TableCell>{row.row1.betType}</TableCell>
                            <TableCell>{row.row1.betInfo}</TableCell>
                            <TableCell>{row.row1.odds}</TableCell>
                            <TableCell>{row.row1.sportsbookName}</TableCell>
                            <TableCell>{row.row1.sport}</TableCell>
                            <TableCell>{row.row2.team1}</TableCell>
                            <TableCell>{row.row2.team2}</TableCell>
                            <TableCell>{row.row2.betType}</TableCell>
                            <TableCell>{row.row2.betInfo}</TableCell>
                            <TableCell>{row.row2.odds}</TableCell>
                            <TableCell>{row.row2.sportsbookName}</TableCell>
                            <TableCell>{row.row2.sport}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}

export default ArbitrageResultsTable;