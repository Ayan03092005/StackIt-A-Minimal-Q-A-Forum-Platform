import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav style={{ padding: '10px', background: '#f2f2f2' }}>
      <Link to="/" style={{ marginRight: '10px' }}>Home</Link>
      <Link to="/ask" style={{ marginRight: '10px' }}>Ask Question</Link>
      <Link to="/login" style={{ marginRight: '10px' }}>Login</Link>
      <Link to="/register">Register</Link>
    </nav>
  );
};

export default Navbar;
