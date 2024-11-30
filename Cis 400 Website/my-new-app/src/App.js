import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import Home from './components/Home';
import Dashboard from './components/Dashboard';
import Profile from './components/Profile';
import About from './components/About';
import Contact from './components/Contact';
import Footer from './components/Footer';

/* more About and contant to footer, make profile into classic SVG
 make a live odds, arbitrage oppurtunities and probabilistic bets page
 change start / stops scraping to Scrape Now button (add filter toggle to 
 choose which sports / sportsbook/ date to scrape etc)
  make user see profile immediately after login
  make user able to see their past bets and favorite sports adn filter their live odds by sport
  left align in about us section
  Add logo to header
  Add a footer with contact us, about us, privacy policy, terms of service, and social media links
*/
function App() {
  return (
    <Router>
      <div className="App">
        <Header />
        <div className="content">
          <Routes>
            <Route exact path="/" element={<Home />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
          </Routes>
        </div>
        <Footer />
      </div>
      
    </Router>
  );
}

export default App;