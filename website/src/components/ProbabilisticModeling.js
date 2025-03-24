// ProbabilisticModeling.js
import React, { useState, useMemo } from "react";
import axios from "axios";
import { Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, Box, CircularProgress, TableSortLabel, Tooltip, TextField } from "@mui/material";
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';

const API_URL = "http://127.0.0.1:5000"; // Ensure this matches your backend URL

function ProbabilisticModeling() {
  const [mispricedBets, setMispricedBets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sortBy, setSortBy] = useState(null);
  const [sortOrder, setSortOrder] = useState('asc'); // 'asc' or 'desc'
  const [tableFilter, setTableFilter] = useState(''); // State for table filter text


  const fetchMispricedOdds = async () => {
    setLoading(true);
    try {
      console.log("🔍 Fetching mispriced odds...");
      const response = await axios.get(`${API_URL}/find-mispriced-odds`);
      console.log("✅ API Response:", response.data);

      if (Array.isArray(response.data) && response.data.length > 0) {
        setMispricedBets(response.data);
      } else {
        console.warn("⚠ No mispriced odds received from API.");
        setMispricedBets([]);
      }
    } catch (error) {
      console.error("❌ Error fetching mispriced odds:", error);
    }
    setLoading(false);
  };

  const handleSort = (property) => {
    const isAsc = sortBy === property && sortOrder === 'asc';
    setSortOrder(isAsc ? 'desc' : 'asc');
    setSortBy(property);
  };

  const filteredMispricedBetsData = useMemo(() => { // Apply filter before sorting
    if (!tableFilter) {
      return mispricedBets;
    }

    const lowerFilterText = tableFilter.toLowerCase();
    return mispricedBets.filter(bet => {
      return Object.values(bet).some(value => {
        if (value === null || value === undefined) return false;
        return String(value).toLowerCase().includes(lowerFilterText);
      });
    });
  }, [mispricedBets, tableFilter]);


  const sortedMispricedBets = useMemo(() => {
    if (!sortBy) {
      return filteredMispricedBetsData; // Sort filtered data
    }

    return [...filteredMispricedBetsData].sort((a, b) => { // Sort filtered data
      let comparison = 0;

      if (sortBy === 'odd_win_prob' || sortBy === 'intrinsic_win_prob' || sortBy === 'difference' || sortBy === 'odds') {
        const valueA = typeof a[sortBy] === 'number' ? a[sortBy] : Number(a[sortBy]); // Handle cases where odds might be strings
        const valueB = typeof b[sortBy] === 'number' ? b[sortBy] : Number(b[sortBy]);
        if (valueA < valueB) comparison = -1;
        if (valueA > valueB) comparison = 1;
      } else {
        if (a[sortBy] < b[sortBy]) comparison = -1;
        if (a[sortBy] > b[sortBy]) comparison = 1;
      }

      return sortOrder === 'asc' ? comparison : comparison * -1;
    });
  }, [filteredMispricedBetsData, sortBy, sortOrder]); // Depend on filteredMispricedBetsData


  const headerCells = [
    { id: 'team1', label: 'Team 1', tooltip: 'Name of the first team in the match' },
    { id: 'team2', label: 'Team 2', tooltip: 'Name of the second team in the match' },
    { id: 'sport', label: 'Sport', tooltip: 'Sport of the event (e.g., NBA, NFL, Soccer)' },
    { id: 'sportsbook', label: 'Sportsbook', tooltip: 'Name of the Sportsbook offering the odds' },
    { id: 'odds', label: 'Odds', tooltip: 'Decimal odds offered by the sportsbook' },
    { id: 'odd_win_prob', label: 'Odd-Based Win Probability', tooltip: 'Win probability implied by the sportsbook odds' },
    { id: 'intrinsic_win_prob', label: 'Intrinsic Win Probability', tooltip: 'Win probability calculated by the probabilistic model' },
    { id: 'difference', label: 'Difference', tooltip: 'Difference between Intrinsic and Odd-Based Win Probabilities (Intrinsic - Odd-Based)' },
  ];

  return (
    <Box sx={{ marginTop: "80px", padding: "20px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
      <Typography variant="h4" sx={{ fontWeight: "bold", marginBottom: "20px" }}>
        Probabilistic Modeling - Find Mispriced Odds
      </Typography>

      <Button
        variant="contained"
        color="primary"
        onClick={fetchMispricedOdds}
        disabled={loading}
        sx={{ fontSize: "16px", fontWeight: "bold", padding: "10px 20px", borderRadius: "8px", marginBottom: "20px" }}
      >
        {loading ? <CircularProgress size={24} sx={{ color: "white" }} /> : "Find Mispriced Odds"}
      </Button>

      {/* Live Odds Data Filter Input */}
      <TextField
          fullWidth
          label="Filter Mispriced Odds Table"
          variant="outlined"
          margin="normal"
          value={tableFilter}
          onChange={(e) => setTableFilter(e.target.value)}
          placeholder="Enter text to filter table"
          sx={{ marginBottom: '20px' }} // Added marginBottom for spacing
      />

      {mispricedBets.length === 0 ? (
        <Typography variant="body1" sx={{ marginTop: "10px", color: "gray" }}>
          No mispriced odds found.
        </Typography>
      ) : (
        <TableContainer component={Paper} sx={{ maxWidth: "80%", boxShadow: 3, borderRadius: "8px", overflow: "hidden" }}>
          <Table>
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
                        sx={{ color: 'inherit', '&:focus': { color: 'inherit' } }}
                        IconComponent={({ direction }) => direction === 'desc' ? <ArrowDownwardIcon sx={{ color: 'white' }} /> : <ArrowUpwardIcon sx={{ color: 'white' }} />}
                      >
                        {header.label}
                      </TableSortLabel>
                    </Tooltip>
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {sortedMispricedBets.map((bet, index) => (
                <TableRow key={index} sx={{ "&:nth-of-type(odd)": { backgroundColor: "#f5f5f5" } }}>
                  <TableCell sx={{ textAlign: "center" }}>{bet.team1}</TableCell>
                  <TableCell sx={{ textAlign: "center" }}>{bet.team2}</TableCell>
                  <TableCell sx={{ textAlign: "center" }}>{bet.sport}</TableCell>
                  <TableCell sx={{ textAlign: "center" }}>{bet.sportsbook}</TableCell>
                  <TableCell sx={{ textAlign: "center" }}>{bet.odds}</TableCell>
                  <TableCell sx={{ textAlign: "center" }}>{(bet.odd_win_prob * 100).toFixed(2)}%</TableCell>
                  <TableCell sx={{ textAlign: "center" }}>{(bet.intrinsic_win_prob * 100).toFixed(2)}%</TableCell>
                  <TableCell sx={{ textAlign: "center", fontWeight: "bold", color: bet.difference > 0 ? "green" : "red" }}>
                    {(bet.difference * 100).toFixed(2)}%
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
}

export default ProbabilisticModeling;