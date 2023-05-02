import { useEffect, useState } from "react";
import axios from "axios";
import "./GeneratePCN.css";
import AdminPage from "../AdminPage/AdminPage";

function GeneratePCNForm() {
  const [pcn, setPcn] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);



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
      const response = await axios.post("http://localhost:8000/generate-pcn", {
        Plexus_Customer_No: pcn,
      });
      const data = response.data;
      console.log("DATAAA",data);
      if (data) {
        setShowPopup(true);
        setSuccessMessage(data.Token);
        setErrorMessage("");
      } else {
        setErrorMessage(data.error);
        setSuccessMessage("");
      }
    } catch (error) {
      console.error(error.response.data.error);
      setErrorMessage(error.response.data.error);
      setSuccessMessage("");
    }
  };

  const handleGenerateToken = () => {
    setCopySuccess(false);
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(successMessage);
      setCopySuccess(true);
    } catch (error) {
      console.error(error);
      setCopySuccess(false);
    }
  };

  return (
    <div className="container">
        <div>
      <AdminPage />
      <form className="generatepcn-form" onSubmit={handleSubmit}>
        <label>
          PCN:
          <input
            className="generatepcn-input"
            type="text"
            value={pcn}
            onChange={(event) => setPcn(event.target.value)}
          />
        </label>
        <button onClick={handleGenerateToken} type="submit" class="generatepcn-button">
          Generate PCN
        </button>
        {errorMessage && (
          <p className="error-message">{errorMessage}</p>
        )}
      </form>
      </div>
      {showPopup && (
        <div className="popup">
          <div className="popup-content">
            <h2>Token:</h2>
            <p className="success-message">{successMessage}</p>
            <button onClick={handleCopy}>Copy to Clipboard</button>
            <br />
            {copySuccess && <p className="copy-success-message">Text copied to clipboard!</p>}
            <button onClick={() => setShowPopup(false)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}
export default GeneratePCNForm;