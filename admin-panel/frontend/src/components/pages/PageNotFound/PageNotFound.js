import React from 'react';
import './PageNotFound.css';
import { Link } from 'react-router-dom';

function PageNotFound() {
  return (
    <div className='page-not-found-container'>
    <div className="page-not-found">
      <h1>404 Page Not Found</h1>
      <p>The page you are looking for does not exist.</p>
      <Link to="/" className="button">Go to the homepage</Link>
    </div>
    </div>
  );
}

export default PageNotFound;
