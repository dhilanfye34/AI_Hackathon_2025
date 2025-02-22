// App.js (example)
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import HomePage from "./HomePage";
import LeaderBoard from "./Leaderboard";
import FileUpload from "./FileUpload";
import RegistrationForm from "./RegistrationForm";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/leaderboard" element={<LeaderBoard />} />
        <Route path="/upload" element={<FileUpload />} />
        <Route path="/register" element={<RegistrationForm />} />
      </Routes>
    </Router>
  );
}

export default App;
