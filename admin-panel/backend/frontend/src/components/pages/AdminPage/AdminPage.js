/* eslint-disable jsx-a11y/anchor-is-valid */
import React from "react";
import { Link, useLocation } from "react-router-dom";
import "./AdminPage.css";

function AdminPage() {
  const location = useLocation();

  const generateLinks = () => {
    if (location.pathname === "/pcn-generator") {
      return (
        <>
          <div className="admin-links">
            <a id="disablebtn">Generate Token</a>
            <Link to="/verify-pcn">Verify Token</Link>
            <Link to="/remove-pcn">Remove PCN</Link>
            <Link to="/get-all-pcn">PCN List</Link>
            <Link onClick={handleSignOut} to="/">
              Sign Out
            </Link>
          </div>
        </>
      );
    } else if (location.pathname === "/remove-pcn") {
      return (
        <>
          <div className="admin-links">
            <Link to="/pcn-generator">Generate Token</Link>
            <Link to="/verify-pcn">Verify Token</Link>
            <a id="disablebtn">Remove PCN</a>
            <Link to="/get-all-pcn">PCN List</Link>
            <Link onClick={handleSignOut} to="/">
              Sign Out
            </Link>
          </div>
        </>
      );
    } else if (location.pathname === "/verify-pcn") {
      return (
        <>
          <div className="admin-links">
            <Link to="/pcn-generator">Generate Token</Link>
            <a id="disablebtn">Verify Token</a>
            <Link to="/remove-pcn">Remove PCN</Link>
            <Link to="/get-all-pcn">PCN List</Link>
            <Link onClick={handleSignOut} to="/">
              Sign Out
            </Link>
          </div>
        </>
      );
    } else if (location.pathname === "/get-all-pcn") {
      return (
        <>
          <div className="admin-links">
            <Link to="/pcn-generator">Generate Token</Link>
            <Link to="/verify-pcn">Verify Token</Link>
            <Link to="/remove-pcn">Remove PCN</Link>
            <a id="disablebtn">PCN List</a>
            <Link onClick={handleSignOut} to="/">
              Sign Out
            </Link>
          </div>
        </>
      );
    } else {
      return (
        <>
          <div className="admin-links">
            <Link to="/verify-pcn">Verify Token</Link>
            <Link to="/pcn-generator">Generate Token</Link>
            <Link to="/remove-pcn">Remove PCN</Link>
            <Link to="/get-all-pcn">PCN List</Link>
          </div>
        </>
      );
    }
  };

  const handleSignOut = () => {
    localStorage.removeItem("token");
    console.log("token removed");
    // Code to sign out the user and redirect to login page
    window.location.replace("/");
  };

  return (
    <div className="admin-panel">
      <h3>Admin Panel</h3>
      {generateLinks()}
    </div>
  );
}

export default AdminPage;
