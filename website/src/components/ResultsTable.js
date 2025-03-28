// ResultsTable.js
import React, { useState, useMemo } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TableSortLabel, Box, Tooltip } from '@mui/material';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';

function ResultsTable({ data, title, filterText }) { // Added filterText prop
    const [sortBy, setSortBy] = useState(null);
    const [sortOrder, setSortOrder] = useState('asc');

    const handleSort = (property) => {
        const isAsc = sortBy === property && sortOrder === 'asc';
        setSortOrder(isAsc ? 'desc' : 'asc');
        setSortBy(property);
    };

    const filteredData = useMemo(() => { // Apply filter before sorting
        if (!filterText) {
            return data;
        }

        const lowerFilterText = filterText.toLowerCase();
        return data.filter(row => {
            return Object.values(row).some(value => {
                if (value === null || value === undefined) return false; // Handle null or undefined values
                return String(value).toLowerCase().includes(lowerFilterText);
            });
        });
    }, [data, filterText]);


    const sortedData = useMemo(() => {
        if (!sortBy) {
            return filteredData; // Sort filtered data
        }

        return [...filteredData].sort((a, b) => { // Sort filtered data
            let comparison = 0;

            const getValue = (row, path) => { // Helper function to get nested values
                return path.split('.').reduce((obj, key) => obj && obj[key], row);
            };

            const aValue = getValue(a, sortBy);
            const bValue = getValue(b, sortBy);

            if (sortBy === 'odds' || sortBy === 'dateOfGame') { // Numeric or Date fields
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
    }, [filteredData, sortBy, sortOrder]); // Depend on filteredData


    const headerCells = [
        { id: 'sport', label: 'Sport', tooltip: 'Sport of the event (e.g., NBA, NFL)' },
        { id: 'sportsbookName', label: 'Sportsbook', tooltip: 'Name of the Sportsbook providing the odds' },
        { id: 'dateOfGame', label: 'Date', tooltip: 'Date and Time of the game' },
        { id: 'team1', label: 'Team 1', tooltip: 'Name of the first team' },
        { id: 'team2', label: 'Team 2', tooltip: 'Name of the second team' },
        { id: 'betType', label: 'Bet Type', tooltip: 'Type of bet (e.g., Moneyline, Spread)' },
        { id: 'betInfo', label: 'Bet Info', tooltip: 'Specific details of the bet (e.g., Team to win, Point Spread)' },
        { id: 'odds', label: 'Odds', tooltip: 'Decimal odds for the bet' },
        // Add more headers as needed based on your data structure and tooltips
    ];

    if (!data || data.length === 0) {
        return <Box mt={2} textAlign="center">No data available.</Box>;
    }

    return (
        <TableContainer component={Paper} sx={{ overflowX: 'auto' }}>
            <Table aria-label={`${title} table`}>
                <TableHead>
                    <TableRow sx={{ backgroundColor: "#1976d2" }}>
                        {headerCells.map((header) => (
                            <TableCell
                                key={header.id}
                                sortDirection={sortBy === header.id ? sortOrder : false}
                                sx={{ fontWeight: "bold", color: "white", textAlign: "center" }}
                            >
                                <Tooltip title={header.tooltip} placement="top" arrow> {/* Added Tooltip here */}
                                    <TableSortLabel
                                        active={sortBy === header.id}
                                        direction={sortBy === header.id ? sortOrder : 'asc'}
                                        onClick={() => handleSort(header.id)}
                                        IconComponent={({ direction }) => direction === 'desc' ? <ArrowDownwardIcon sx={{ color: 'white' }} /> : <ArrowUpwardIcon sx={{ color: 'white' }} />}
                                        sx={{color: 'inherit', '&:focus': { color: 'inherit' }} }
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
                            sx={{ '&:nth-of-type(odd)': { backgroundColor: '#f5f5f5' } }}
                        >
                            <TableCell>{row.sport}</TableCell>
                            <TableCell>{row.sportsbookName}</TableCell>
                            <TableCell>{row.dateOfGame}</TableCell>
                            <TableCell>{row.team1}</TableCell>
                            <TableCell>{row.team2}</TableCell>
                            <TableCell>{row.betType}</TableCell>
                            <TableCell>{row.betInfo}</TableCell>
                            <TableCell>{row.odds}</TableCell>
                            {/* Render more cells based on your data structure */}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}

export default ResultsTable;