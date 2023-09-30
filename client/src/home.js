import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import App from './App';
import PinLook from './pinlook';

function Home() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/next" element={<PinLook />} />
      </Routes>
    </Router>
  );
}

export default Home;