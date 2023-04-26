import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './AdminPage.css';

function AdminPage() {
  const location = useLocation();

  const generateLinks = () => {
    if (location.pathname === '/pcn-generator') {
      return (
        <>
          <Link to="/verify-pcn">Verify PCN</Link>
          <Link to="/remove-pcn">Remove PCN</Link>
          <Link to="/get-all-pcn">Get All PCN</Link>
          <Link onClick={handleSignOut} to="/">Sign Out</Link>
        </>
      );
    } else if (location.pathname === '/remove-pcn') {
      return (
        <>
          <Link to="/verify-pcn">Verify PCN</Link>
          <Link to="/pcn-generator">Generate PCN</Link>
          <Link to="/get-all-pcn">Get All PCN</Link>
          <Link onClick={handleSignOut} to="/">Sign Out</Link>
        </>
      );
    } else if (location.pathname === '/verify-pcn') {
      return (
        <>
          <Link to="/pcn-generator">Generate PCN</Link>
          <Link to="/remove-pcn">Remove PCN</Link>
          <Link to="/get-all-pcn">Get All PCN</Link>
          <Link onClick={handleSignOut} to="/">Sign Out</Link>
        </>
      );
    } else if (location.pathname === '/get-all-pcn') {
      return (
        <>
          <Link to="/verify-pcn">Verify PCN</Link>
          <Link to="/remove-pcn">Remove PCN</Link>
          <Link to="/pcn-generator">Generate PCN</Link>
          <Link onClick={handleSignOut} to="/">Sign Out</Link>
        </>
      );
    } else {
      return (
        <>
          <Link to="/verify-pcn">Verify PCN</Link>
          <Link to="/pcn-generator">Generate PCN</Link>
          <Link to="/remove-pcn">Remove PCN</Link>
          <Link to="/get-all-pcn">Get All PCN</Link>
        </>
      );
    }
  };

  const handleSignOut = () => {
    localStorage.removeItem('token');
    console.log("token removed");
    // Code to sign out the user and redirect to login page
    window.location.replace('/')
  };

  return (
    <div className="admin-panel">
      <h3>Admin Panel</h3>
      <div className="admin-links">
        {generateLinks()}
      </div>
    </div>
  );
}

export default AdminPage;
