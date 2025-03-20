import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './components/Home';
import Dashboard from './components/Dashboard';
import BonusBetsCalculator from './components/BonusBetsCalculator';
import BetGPT from './components/BetGPT';
import Profile from './components/Profile';
import About from './components/About';
import Contact from './components/Contact';
import TermsOfService from './components/TermsOfService';
import PrivacyPolicy from './components/PrivacyPolicy';
import ProbabilisticModeling from './components/ProbabilisticModeling'; // Import the new component

// Layout with both header and footer
const DefaultLayout = ({ children }) => (
  <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
    <Header />
    <main style={{ flex: 1, marginTop: '48px', padding: '24px 0' }}>
      {children}
    </main>
    <Footer />
  </div>
);

// Layout with only header (for pages like BetGPT)
const HeaderOnlyLayout = ({ children }) => (
  <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
    <Header />
    <main style={{ flex: 1, marginTop: '48px' }}>
      {children}
    </main>
  </div>
);

function App() {
  return (
    <Router>
      <Routes>
        {/* Routes that need both header and footer */}
        <Route path="/" element={<DefaultLayout><Home /></DefaultLayout>} />
        <Route path="/dashboard" element={<DefaultLayout><Dashboard /></DefaultLayout>} />
        <Route path="/bonus-bets-calculator" element={<DefaultLayout><BonusBetsCalculator /></DefaultLayout>} />
        <Route path="/profile" element={<DefaultLayout><Profile /></DefaultLayout>} />
        <Route path="/about" element={<DefaultLayout><About /></DefaultLayout>} />
        <Route path="/contact" element={<DefaultLayout><Contact /></DefaultLayout>} />
        <Route path="/terms-of-service" element={<DefaultLayout><TermsOfService /></DefaultLayout>} />
        <Route path="/privacy-policy" element={<DefaultLayout><PrivacyPolicy /></DefaultLayout>} />

        {/* New route for Probabilistic Modeling */}
        <Route path="/probabilistic-modeling" element={<HeaderOnlyLayout><ProbabilisticModeling /></HeaderOnlyLayout>} />

        {/* Routes that only need header */}
        <Route path="/betgpt" element={<HeaderOnlyLayout><BetGPT /></HeaderOnlyLayout>} />
      </Routes>
    </Router>
  );
}

export default App;