import React, { useState } from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Typography,
    TableSortLabel,
    Box,
} from '@mui/material';

function ResultsTable({ data, title }) {
    const [sortOrder, setSortOrder] = useState('asc');
    const [sortBy, setSortBy] = useState(null);

    const handleSortRequest = (property) => (event) => { // handleSortRequest remains the same - it's the handler factory
        const isAsc = sortBy === property && sortOrder === 'asc';
        setSortOrder(isAsc ? 'desc' : 'asc');
        setSortBy(property);
    };

    const sortedData = React.useMemo(() => {
        if (!sortBy) {
            return data;
        }

        return [...data].sort((a, b) => {
            let aValue = a[sortBy];
            let bValue = b[sortBy];

            if (sortBy === 'odds') {
                const parseOdds = (oddStr) => {
                    if (!oddStr) return 0;
                    const num = parseInt(oddStr, 10);
                    return isNaN(num) ? 0 : num;
                };
                aValue = parseOdds(aValue);
                bValue = parseOdds(bValue);
            }

            if (aValue == null) return sortOrder === 'asc' ? 1 : -1;
            if (bValue == null) return sortOrder === 'asc' ? -1 : 1;

            if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
            if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
            return 0;
        });
    }, [data, sortOrder, sortBy]);

    return (
        <TableContainer
            component={Paper}
            sx={{
                marginTop: '20px',
                boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
            }}
        >
            <Typography
                variant="h6"
                sx={{
                    textAlign: 'center',
                    padding: '10px',
                    fontWeight: 'bold',
                    backgroundColor: 'grey.100',
                }}
            >
                {title}
            </Typography>
            <Table size="small">
                <TableHead>
                    <TableRow sx={{ backgroundColor: 'grey.200' }}>
                        <TableCellSortable
                            property="team1"
                            label="Team 1"
                            sortBy={sortBy}
                            sortOrder={sortOrder}
                            onRequestSort={handleSortRequest} // Correctly pass handleSortRequest down
                        />
                        <TableCellSortable
                            property="team2"
                            label="Team 2"
                            sortBy={sortBy}
                            sortOrder={sortOrder}
                            onRequestSort={handleSortRequest} // Correctly pass handleSortRequest down
                        />
                        <TableCellSortable
                            property="betType"
                            label="Bet Type"
                            sortBy={sortBy}
                            sortOrder={sortOrder}
                            onRequestSort={handleSortRequest} // Correctly pass handleSortRequest down
                        />
                        <TableCellSortable
                            property="betInfo"
                            label="Bet Info"
                            sortBy={sortBy}
                            sortOrder={sortOrder}
                            onRequestSort={handleSortRequest} // Correctly pass handleSortRequest down
                        />
                        <TableCellSortable
                            property="odds"
                            label="Odds"
                            sortBy={sortBy}
                            sortOrder={sortOrder}
                            onRequestSort={handleSortRequest} // Correctly pass handleSortRequest down
                            align="right"
                        />
                        <TableCellSortable
                            property="dateOfGame"
                            label="Date of Game"
                            sortBy={sortBy}
                            sortOrder={sortOrder}
                            onRequestSort={handleSortRequest} // Correctly pass handleSortRequest down
                        />
                        <TableCellSortable
                            property="sportsbookName"
                            label="Sportsbook Name"
                            sortBy={sortBy}
                            sortOrder={sortOrder}
                            onRequestSort={handleSortRequest} // Correctly pass handleSortRequest down
                        />
                        <TableCellSortable
                            property="sport"
                            label="Sport"
                            sortBy={sortBy}
                            sortOrder={sortOrder}
                            onRequestSort={handleSortRequest} // Correctly pass handleSortRequest down
                        />
                    </TableRow>
                </TableHead>
                <TableBody>
                    {sortedData.length > 0 ? (
                        sortedData.map((row, index) => (
                            <TableRow
                                key={index}
                                sx={{
                                    backgroundColor: index % 2 === 0 ? 'grey.50' : 'background.paper',
                                    '&:hover': { backgroundColor: 'grey.100' },
                                    ...(row.isArbitrageRow && {
                                        backgroundColor: 'success.light',
                                        fontWeight: 'bold',
                                    }),
                                }}
                            >
                                <TableCell>{row.team1}</TableCell>
                                <TableCell>{row.team2}</TableCell>
                                <TableCell>{row.betType}</TableCell>
                                <TableCell>{row.betInfo}</TableCell>
                                <TableCell align="right">{row.odds}</TableCell>
                                <TableCell>{row.dateOfGame}</TableCell>
                                <TableCell>{row.sportsbookName}</TableCell>
                                <TableCell>{row.sport}</TableCell>
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell
                                colSpan={8}
                                sx={{
                                    textAlign: 'center',
                                    fontStyle: 'italic',
                                    color: 'text.secondary',
                                    padding: '20px',
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

// Separate component for sortable table cells
function TableCellSortable({ property, label, sortBy, sortOrder, onRequestSort, align = 'left', children }) {
    // **Corrected `createSortHandler` - now calls `onRequestSort` correctly**
    const createSortHandler = () => onRequestSort(property); // Returns a function that calls onRequestSort with property

    return (
        <TableCell
            sortDirection={sortBy === property ? sortOrder : false}
            align={align}
            sx={{ fontWeight: 'bold' }}
        >
            <TableSortLabel
                active={sortBy === property}
                direction={sortBy === property ? sortOrder : 'asc'}
                onClick={createSortHandler} // Use the corrected `createSortHandler`
            >
                {label}
                {children}
                <Box component="span" sx={{ display: 'inline-block', ml: 0.5 }} />
            </TableSortLabel>
        </TableCell>
    );
}

export default ResultsTable;