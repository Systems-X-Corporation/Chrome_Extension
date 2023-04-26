import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './PCNList.css';
import AdminPage from '../../pages/AdminPage/AdminPage';

function PCNList() {
  const [pcns, setPcns] = useState([]);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      // If the token is not present, redirect to login page
      window.location.href = '/';
    } else {
      // Verify the token on the server
      axios
        .post('/api/auth/verify', { token })
        .then((res) => {
          const data = res.data.message;
          console.log(data);
        })
        .catch((error) => {
          console.log(error)
        });
    }
  }, []);

useEffect(() => {
    async function fetchData() {
      try {
        const response = await axios.get('/get-all-pcn');
        setPcns(response.data);
      } catch (error) {
        setError(error);
      }
    }
    fetchData();
  }, []);

  const filteredPcns = pcns.filter(pcn =>
    pcn.Pcn.toLowerCase().includes(searchQuery.toLowerCase())
  );
  console.log(filteredPcns);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredPcns.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(filteredPcns.length / itemsPerPage);

  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  const handlePageClick = e => {
    setCurrentPage(Number(e.target.textContent));
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
          onChange={e => setSearchQuery(e.target.value)}
        />
      </div>
      <table>
        <thead>
          <tr>
          <th>S.No.</th>
            <th>PCN</th>
            <th>TOKEN</th>
          </tr>
        </thead>
        <tbody>
        {currentItems.length === 0 ? (
          <tr>
            <td className="error">No Such PCN's found</td>
          </tr>
        )
          :
        (
        currentItems.map((pcn, index) => (
            <tr className="success" key={pcn._id}>
              <td>{index + 1}</td>
              <td>{pcn.Pcn}</td>
              <td>{pcn.Token}</td>
            </tr>
        )
          ))}
         </tbody>
      </table>
      {totalPages > 1 && (
        <ul className="pagination">
          {pageNumbers.map(number => (
            <li
              key={number}
              className={currentPage === number ? 'active' : ''}
              onClick={handlePageClick}
            >
              {number}
            </li>
          ))}
        </ul>
      )}
      {error && <p className="error">Server Error</p> }
    </div>
    </div>
  );
}

export default PCNList;
