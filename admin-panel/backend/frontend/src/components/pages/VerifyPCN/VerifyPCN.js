import React, { useEffect, useState } from "react";
import axios from "axios";
import AdminPage from "../AdminPage/AdminPage";
import "./VerifyPCN.css";

function VerifyPCN() {
  const [pcn, setPcn] = useState("");
  const [token, setToken] = useState("");
  const [isValid, setIsValid] = useState(false);
  const [isNotValid, setIsNotValid] = useState(false);

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

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post("http://localhost:8000/verify-pcn", {
        Plexus_Customer_No: pcn,
        Token: token,
      });
      console.log(response.data);
      if (response.data.exists) {
        setIsValid("Verified Token");
        setIsNotValid("");
      } else {
        setIsNotValid("Invalid Token");
        setIsValid("");
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="container">
    <AdminPage />
      <form className="verifypcn-form" onSubmit={handleSubmit}>
        <div>
          <div>
            <label htmlFor="pcn">PCN:</label>
            <input
              className="verifypcn-input"
              type="text"
              id="pcn"
              value={pcn}
              onChange={(e) => setPcn(e.target.value)}
            />
          </div>
          <div className="Token-input">
            <label htmlFor="token">Token:</label>
            <input
              className="verifypcn-input"
              type="text"
              id="token"
              value={token}
              onChange={(e) => setToken(e.target.value)}
            />
          </div>
        </div>
        <p className="success-message">{isValid}</p>
        <p className="error-message">{isNotValid}</p>
        <div class="button-wrapper">
          <button className="verifypcn-button" type="submit">
            Verify
          </button>
        </div>
      </form>
    </div>
  );
}

export default VerifyPCN;
