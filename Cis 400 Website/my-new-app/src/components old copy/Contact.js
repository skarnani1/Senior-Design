import React from 'react';
import { Container, TextField, Button, Typography } from '@mui/material';

function Contact() {
  const handleSubmit = (event) => {
    event.preventDefault();
    // Logic to handle form submission
  };

  return (
    <Container component="main" maxWidth="sm" style={{ marginTop: '20px' }}>
      <Typography component="h1" variant="h4" gutterBottom>
        Contact Us
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          variant="outlined"
          margin="normal"
          required
          fullWidth
          id="name"
          label="Name"
          name="name"
          autoComplete="name"
          autoFocus
        />
        <TextField
          variant="outlined"
          margin="normal"
          required
          fullWidth
          id="email"
          label="Email Address"
          name="email"
          autoComplete="email"
        />
        <TextField
          variant="outlined"
          margin="normal"
          required
          fullWidth
          name="message"
          label="Message"
          id="message"
          multiline
          rows={4}
        />
        <Button
          type="submit"
          fullWidth
          variant="contained"
          color="primary"
          style={{ marginTop: '20px' }}
        >
          Send Message
        </Button>
      </form>
    </Container>
  );
}

export default Contact;