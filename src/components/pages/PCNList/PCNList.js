import React, { useState, useEffect } from "react";
import axios from "axios";
import "./PCNList.css";
import AdminPage from "../AdminPage/AdminPage";
import { TbCopy } from "react-icons/tb";
import ClipboardJS from "clipboard";
new ClipboardJS(".copy-text");
function PCNList() {
  const [pcns, setPcns] = useState([]);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [switchValue, setSwitchValue] = useState("");
  const itemsPerPage = 20;

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      // If the token is not present, redirect to login page
      window.location.href = "/";
    } else {
      // Verify the token on the server
      axios
        .post("https://backendphase2.azurewebsites.net/api/auth/verify", { token })
        .then((res) => {
          const data = res.data.message;
          console.log(data);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, []);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axios.get("https://backendphase2.azurewebsites.net/get-all-pcn");
        setPcns(response.data.recordset);
      } catch (error) {
        setError(error);
      }
    }
    fetchData();
  }, []);

  // const filteredPcns = pcns.filter(pcn =>
  //   pcn.Plex_PCN.toLowerCase().includes(searchQuery.toLowerCase())
  // );
  console.log(pcns);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = pcns.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(pcns.length / itemsPerPage);

  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  const handlePageClick = (e) => {
    setCurrentPage(Number(e.target.textContent));
  };

  // Function to update the pin by index
  const updatePinByIndex = (e, index) => {
    e.preventDefault();

    // Make a copy of the original data array
    const updatedData = [...pcns];

    // Update the pin at the specified index
    updatedData[index].Pin = e.target.value;

    console.log("updatedData =>", updatedData);

    // Update the state with the modified data
    setPcns(updatedData);
  };

  const resetPin = (e, index) => {
    console.log("pcns =>", pcns[index]);
    // Reset Pin
    axios
      .post("https://backendphase2.azurewebsites.net/reset-pin", { data: pcns[index] })
      .then((res) => {
        const data = res.data.message;
        console.log(data);
        window.location.reload();
      })
      .catch((error) => {
        console.log("error =>", error.response.data.error);
        alert(error.response.data.error);
      });
  };

  return (
    <div>
      <AdminPage />
      <div className="pcn-list">
        <h1>List of PCNs</h1>
        <div className="search">
          <input
            type="text"
            placeholder="Search by PCN"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <table>
          <thead>
            <tr>
              <th>S.No.</th>
              <th>PCN</th>
              <th>PCN Name</th>
              <th>TOKEN</th>
              <th>PIN</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.length === 0 ? (
              <tr>
                <td className="error">No Such PCN's found</td>
              </tr>
            ) : (
              currentItems.map((pcn, index) => (
                <tr className="success" key={index}>
                  <td>{index + 1}</td>
                  <td>{pcn.Plexus_Customer_No}</td>
                  <td>{pcn.Plexus_Customer_Name}</td>
                  <td id={`input-${index + 1}`}>
                    <div style={{ display: "flex" }}>
                      {pcn.Token}
                      <button
                        data-clipboard-action="copy"
                        data-clipboard-target={`#input-${index + 1}`}
                        className="copy-text"
                      >
                        <TbCopy style={{ cursor: "pointer" }} />
                      </button>
                    </div>
                  </td>
                  {switchValue === `reset${index}` ? (
                    <td>
                      <input
                        required
                        className="generatepcn-input"
                        type="number"
                        value={pcn.Pin}
                        onChange={(event) => updatePinByIndex(event, index)}
                      />
                      <button
                        onClick={(e) => resetPin(e, index)}
                        class="generatepcn-button"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => {
                          setSwitchValue(``);
                          window.location.reload(true);
                        }}
                        class="generatepcn-button"
                      >
                        Cancel
                      </button>
                    </td>
                  ) : (
                    <td>
                      {pcn.Pin}
                      <button
                        onClick={() => setSwitchValue(`reset${index}`)}
                        class="generatepcn-button"
                      >
                        Reset Pin
                      </button>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
        {totalPages > 1 && (
          <ul className="pagination">
            {pageNumbers.map((number) => (
              <li
                key={number}
                className={currentPage === number ? "active" : ""}
                onClick={handlePageClick}
              >
                {number}
              </li>
            ))}
          </ul>
        )}
        {error && <p className="error">Server Error</p>}
      </div>
    </div>
  );
}

export default PCNList;
