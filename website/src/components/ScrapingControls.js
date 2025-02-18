import React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';

function ScrapingControls({ onStart, onStop }) {
  return (
    <div>
      <TextField label="Scraping Interval (seconds)" type="number" />
      <Button variant="contained" color="primary" onClick={onStart}>
        Start Scraping
      </Button>
      <Button variant="contained" color="secondary" onClick={onStop}>
        Stop Scraping
      </Button>
    </div>
  );
}

export default ScrapingControls;