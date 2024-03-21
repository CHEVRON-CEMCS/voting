import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '@/components/Navbar';
import * as XLSX from 'xlsx';
import { useAuth } from '@/services/AuthContext';

function VotePosition() {
  const [positions, setPositions] = useState([]);
  const [selectedPosition, setSelectedPosition] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const { user } = useAuth();
  const userToken = user?.token;
  const userEmail = user?.email;

  useEffect(() => {
    axios.get('https://virtual.chevroncemcs.com/voting/position')
      .then(response => {
        setPositions([{ id: 'all', name: 'All' }, ...response.data.data]); // Add "All" option to positions
      })
      .catch(error => {
        console.error('Error fetching positions:', error);
      });
  }, []);

  const handlePositionChange = (event) => {
    const selectedPositionId = event.target.value;
    setSelectedPosition(selectedPositionId);
    setLoading(true);

    if (selectedPositionId === 'all') {
      // Fetch results for all positions
      Promise.all(positions.slice(1).map(position => // Skip the first "All" option
        axios.get(`https://virtual.chevroncemcs.com/voting/votes/${position.id}`, {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
          params: {
            email: userEmail
          }
        }).then(response => response.data.data)
      )).then(allResults => {
        setResults(allResults.flat()); // Combine and set results
      }).catch(error => {
        console.error('Error fetching results:', error);
      }).finally(() => {
        setLoading(false);
      });
    } else {
      // Fetch results for a single position
      axios.get(`https://virtual.chevroncemcs.com/voting/votes/${selectedPositionId}`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
        params: {
          email: userEmail
        }
      })
        .then(response => {
          setResults(response.data.data);
        })
        .catch(error => {
          console.error('Error fetching results:', error);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  };

  // const exportToExcel = () => {
  //   const worksheet = XLSX.utils.json_to_sheet(results);
  //   const workbook = XLSX.utils.book_new();
  //   XLSX.utils.book_append_sheet(workbook, worksheet, 'Nominations');
  //   XLSX.writeFile(workbook, 'votingbyposition.xlsx');
  // };

  const exportToExcel = () => {
    // Transform the results data for Excel
    const transformedResults = results.map(result => ({
      Name: result.name, // Employee's name
      EmployeeNumber: result.empno, // Employee's number
      Position: result.counts[0]?.positionName, // First position's name from the counts array
      Count: result.counts[0]?.count // First position's count from the counts array
    }));
  
    // Convert the transformed data to a worksheet
    const worksheet = XLSX.utils.json_to_sheet(transformedResults);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Nominations');
    XLSX.writeFile(workbook, 'votingbyposition.xlsx');
  };
  

  return (
    <div>
      <Navbar />
      <div className="container mx-auto mt-20">
        <h1 className='text-center font-bold text-3xl mb-6'>Votes By Position</h1>
        <div className="mb-4">
          <label htmlFor="position" className="block text-lg font-medium text-gray-600 mb-2">Select Position:</label>
          <select
            id="position"
            value={selectedPosition}
            onChange={handlePositionChange}
            className="border p-2 rounded outline-none"
          >
            <option value="" disabled>Select Position</option>
            {positions.map(position => (
              <option key={position.id} value={position.id}>{position.name}</option>
            ))}
          </select>
        </div>

        {loading && <div className="text-center mt-4">Loading Results...</div>}

        {selectedPosition && !loading && (
          <div className='mb-10'>
            <button
              onClick={exportToExcel}
              className="mt-4 p-2 bg-blue-500 text-white rounded hover:bg-blue-700 focus:outline-none focus:shadow-outline-blue active:bg-blue-800"
            >
              Export to Excel
            </button>
            <div className="overflow-x-auto">
              <table className="min-w-full mt-4 border border-gray-300">
                <thead className='bg-gray-200'>
                  <tr>
                    <th className="p-3 text-left">Name</th>
                    <th className="p-3 text-left">Employee Number</th>
                    <th className="p-3 text-left">Position</th>
                    <th className="p-3 text-left">Count</th>
                  </tr>
                </thead>
                <tbody>
                  {results.map(result => (
                                        <tr key={result.empno}>
                                        <td className="border p-3">{result.name}</td>
                                        <td className="border p-3">{result.empno}</td>
                                        <td className="border p-3">{result.counts[0].positionName}</td>
                                        <td className="border p-3">{result.counts[0].count}</td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  }
                  
                  export default VotePosition;
                  

