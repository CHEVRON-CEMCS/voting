import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '@/services/AuthContext';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';

function Candidates() {
  const { user } = useAuth();
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);

  const userToken = user?.token;
        const userEmail = user?.email;

  const deleteCandidate = async (empno) => {
    try {
      const userToken = user?.token;
      const userEmail = user?.email;

      const response = await axios.delete(`https://virtual.chevroncemcs.com/voting/eligible/${empno}`, {
        params: {
          email: userEmail,
        },
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      });

      if (response.status === 200) {
        // Candidate deleted successfully, remove it from the list
        const updatedCandidates = candidates.filter((candidate) => candidate.empno !== empno);
        setCandidates(updatedCandidates);

        console.log(response);
      } else {
        console.error('API request failed with status:', response.status);
      }
    } catch (error) {
      console.error('Error deleting candidate:', error);
    }
  };

  const fetchData = async () => {
    try {
      if (!userToken || !userEmail) {
        setLoading(false); // User is not logged in, set loading to false
        return;
      }

      // Fetch candidates data from your API
      const headers = {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userToken}`,
      };

      const response = await axios.get('https://virtual.chevroncemcs.com/voting/eligible', {
        params: {
          email: userEmail,
        },
        headers,
      });

      console.log(response);

      if (response.status === 200) {
        const fetchedCandidates = response.data.data;
        setCandidates(fetchedCandidates);
      } else {
        console.error('API request failed with status:', response.status);
      }

      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(); // Fetch data when the component mounts
  }, [userToken, userEmail]);

  return (
    <div>
      <Navbar />

      <div className='mt-20 max-w-6xl mx-auto mb-10'>
        <div className='mt-10 mb-10'>
            <h1 className='font-bold text-4xl'>Candidates</h1>
        </div>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <table className='min-w-full table-auto border-collapse border border-gray-300'>
            <thead>
              <tr>
                <th className="px-6 py-3 bg-gray-200 text-left">Name</th>
                <th className="px-6 py-3 bg-gray-200 text-left">Employee No</th>
                <th className="px-6 py-3 bg-gray-200 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {candidates?.map((candidate) => (
                <tr key={candidate.id} className='hover:bg-gray-100'>
                  <td className="px-6 py-4">{candidate.name}</td>
                  <td>{candidate.empno}</td>
                  <td>
                    <Button onClick={() => deleteCandidate(candidate.empno)}>Delete</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default Candidates;
