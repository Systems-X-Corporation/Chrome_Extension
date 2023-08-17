import React, { useState } from 'react';
import axios from 'axios';
import "./Login.css";

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [successMessage, setSuccessMessage] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  

  const onSubmit = async (event) => {
    event.preventDefault();

    if (validateForm()) {
    try {
      console.log(email);
      console.log(password);
      const response = await axios.post('https://backend-adminchrome.azurewebsites.net/login', { email, password });
      console.log("response.data",response.data);
      if(response.data) {
        const token = response.data.token;
      localStorage.setItem('token', token);
        setTimeout(function(){
          window.location.replace('/pcn-generator');
        }, 1000);
        setSuccessMessage(true);
        setErrorMessage("");
      }
      else {
        setErrorMessage("Error While Generating Token");
        setSuccessMessage(false);
      }
      const token = localStorage.getItem('token');

    if (token) {
      console.log('JWT token in Local Storage:', token);
    } else {
      console.log('No JWT token found in local storage.');
    }

    } catch (error) {
      setErrorMessage(error.response.data.error);
      setSuccessMessage(false);
    }
  }
  };

  const validateForm = () => {
    let valid = true;
  
    if (email.trim() === "") {
      setEmailError("Email is required");
      valid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError("Invalid email address");
      valid = false;
    } else {
      setEmailError("");
    }
  
    if (password.trim() === "") {
      setPasswordError("Password is required");
      valid = false;
    } else if (password.length < 6) {
      setPasswordError("Password must be at least 6 characters");
      valid = false;
    } else {
      setPasswordError("");
    }
  
    return valid;
  };

return (
  <div className="container">
  <div className="login-page">
    <form className="login-form" onSubmit={onSubmit}>
      <h1 className="login-header">Login</h1>
      <div className="form-group">
        <label htmlFor="email" className="form-label">Email:</label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className="form-input"
          required
        />
        {emailError && <p className="error-message">{emailError}</p>}
      </div>
      <div className="form-group">
        <label htmlFor="password" className="form-label">Password:</label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          className="form-input"
          required
        />
        {passwordError && <p className="error-message">{passwordError}</p>}
      </div>
      <button type="submit" className="login-button">Login</button>
      {successMessage && (
        <div className="loading-container">
        <p className="success-message">LoggedIn successfully !</p>
        <p className="loading-text">Loading...</p>
    <div className="loading-spinner"></div>
        </div>
      )}
      {errorMessage && (
        <p className="error-message">{errorMessage}</p>
      )}
    </form>
  </div>
  </div>
);
};

export default Login;