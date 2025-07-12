import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import AskQuestion from './pages/AskQuestion';
import QuestionDetail from './pages/QuestionDetail';
import Notifications from './pages/Notifications';
import './App.css'; // ✅ Make sure App.css is imported

function App() {
  return (
    <div className="App"> {/* This uses .App from App.css */}
      <Router>
        <Navbar />
        <header className="App-header"> {/* This uses .App-header from App.css */}
          <div className="container">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/ask" element={<AskQuestion />} />
              <Route path="/questions/:id" element={<QuestionDetail />} />
              <Route path="/notifications" element={<Notifications />} />
            </Routes>
          </div>
        </header>
      </Router>
    </div>
  );
}

export default App;
