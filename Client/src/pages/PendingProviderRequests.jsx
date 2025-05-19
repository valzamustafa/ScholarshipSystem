import React, { useState, useEffect } from 'react';


import axios from 'axios';

function PendingProviderRequests() {
  const [requests, setRequests] = useState([]);
  const [loadingRequests, setLoadingRequests] = useState(false);
  const [error, setError] = useState(null);

 
const fetchRequests = async () => {
  setLoadingRequests(true);
  setError(null);
  try {
   const response = await axios.get('/api/provider/unapproved');

    setRequests(response.data);
  } catch (err) {
    console.error(err);
    setError('Failed to fetch provider requests.');
  }
  setLoadingRequests(false);
};
useEffect(() => {
  fetchRequests();
}, []);

const approveRequest = async (id) => {
  try {
    await axios.put(`/api/provider/approve/${id}`);
    fetchRequests();
  } catch (err) {
    console.error(err);
    alert('Failed to approve provider.');
  }
};


const rejectRequest = async (id) => {
  if (!window.confirm('Are you sure you want to reject and delete this provider request?')) return;

  try {
    await axios.delete(`/api/provider/${id}`);
    fetchRequests();
  } catch (err) {
    console.error(err); 
    alert('Failed to reject provider.');
  }
};


  return (
    <div className="card mb-4">
      <div className="card-header">
        <h5 className="mb-0">Pending Provider Requests</h5>
      </div>
      <div className="card-body">
        {loadingRequests && <p>Loading requests...</p>}
        {error && <p className="text-danger">{error}</p>}
        {!loadingRequests && requests.length === 0 && <p>No pending requests.</p>}
        <ul className="list-group">
          {requests.map(req => (
            <li key={req.id} className="list-group-item d-flex justify-content-between align-items-center">
              <div>
                <strong>{req.fullName}</strong> <br />
                {req.email} <br />
                {req.organizationName}
              </div>
              <div>
                <button className="btn btn-success btn-sm me-2" onClick={() => approveRequest(req.id)}>Approve</button>
                <button className="btn btn-danger btn-sm" onClick={() => rejectRequest(req.id)}>Reject</button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default PendingProviderRequests;
