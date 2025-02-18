import React from 'react';
import './Footer.css'; // Import the CSS file
import { Link } from 'react-router-dom'; // Import Link

function Footer() {
  return (
    <footer className="footer">
      <ul className="footer-links">
        <li><Link to="/contact">Contact Us</Link></li>
        <li><Link to="/about">About Us</Link></li>
        <li><Link to="/privacy-policy">Privacy Policy</Link></li> {/* Add Privacy Policy Link */}
        <li><Link to="/terms-of-service">Terms of Service</Link></li> {/* Add TOS Link */}
      </ul>
      <div className="social-media">
        <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">Facebook</a>
        <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">Twitter</a>
        <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">Instagram</a>
      </div>
    </footer>
  );
}

export default Footer;