import React, { useEffect, useState } from 'react';
import axios from 'axios';
import "./RemovePCN.css";
import AdminPage from '../AdminPage/AdminPage';

function RemovePCN() {
  const [Pcn, setPcn] = useState('');
const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      // If the token is not present, redirect to login page
      window.location.href = '/';
    } else {
      // Verify the token on the server
      axios
        .post('http://localhost:8000/api/auth/verify', { token })
        .then((res) => {
          const data = res.data.message;
          console.log(data);
        })
        .catch((error) => {
          console.log(error)
        });
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.get(`http://localhost:8000/remove-pcn?Plexus_Customer_No=${Pcn}`);
      if (res.data.success) {
        setSuccessMessage("PCN Removed successfully");
        setErrorMessage("");
      } else {
        setErrorMessage("PCN Does Not Exits");
        setSuccessMessage("");
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="container">
    <AdminPage />
        <form className="removepcn-form" onSubmit={handleSubmit}>
          <label>
            PCN:
            <input className="removepcn-input" type="text" value={Pcn} onChange={(e) => setPcn(e.target.value)} />
          </label>
          {successMessage && (
        <p className="success-message">{successMessage}</p>
      )}
      {errorMessage && (
        <p className="error-message">{errorMessage}</p>
      )}
          <button className="removepcn-button" type="submit">Remove</button>
        </form>
    </div>
  );
}

export default RemovePCN;
