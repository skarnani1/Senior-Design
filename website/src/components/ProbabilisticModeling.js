import React, { useState } from "react";
import axios from "axios";
import { Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, Box, CircularProgress } from "@mui/material";

const API_URL = "http://127.0.0.1:5000"; // Ensure this matches your backend URL

function ProbabilisticModeling() {
  const [mispricedBets, setMispricedBets] = useState([]);
  const [loading, setLoading] = useState(false);

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

      {mispricedBets.length === 0 ? (
        <Typography variant="body1" sx={{ marginTop: "10px", color: "gray" }}>
          No mispriced odds found.
        </Typography>
      ) : (
        <TableContainer component={Paper} sx={{ maxWidth: "80%", boxShadow: 3, borderRadius: "8px", overflow: "hidden" }}>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: "#1976d2" }}>
                {["Team 1", "Team 2", "Sport", "Sportsbook", "Odds", "Odd-Based Win Probability", "Intrinsic Win Probability", "Difference"].map((header, index) => (
                  <TableCell key={index} sx={{ fontWeight: "bold", color: "white", textAlign: "center" }}>
                    {header}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {mispricedBets.map((bet, index) => (
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