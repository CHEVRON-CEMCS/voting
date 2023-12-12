import MemberNavbar from '@/components/MemberNavbar';
import { useNewAuth } from '@/services/NewAuthContext';
import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Viewnominations() {
  const { employeeNumber, code } = useNewAuth();

  const [filteredData, setFilteredData] = useState([]); // State to store filtered data

  const employeeNumberAsNumber = parseInt(employeeNumber, 10);


  useEffect(() => {
    // Construct the API URL with the employeeNumber
    const apiUrl = `https://virtual.chevroncemcs.com/voting/getNominateCandidate/${employeeNumber}`;

    // Define the headers with Authorization
    const headers = {
      Authorization: `Bearer ${code}` // Assuming your authorization method is Bearer token
    };

    // Make the API GET request with authorization headers
    axios
      .get(apiUrl, { headers })
      .then((response) => {
        if (response.data && response.data.data) {
          // Filter the response data based on the employeeNumber
          const filteredData = response.data.data.filter(
            (item) => item.empno === employeeNumber
          );

          setFilteredData(filteredData); // Store the filtered data in state
          console.log('data',response.data)
          console.log('filtered data',filteredData)
        }
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
        // You can add error handling or display a toast message here
      });
  }, [employeeNumber, code]);

  return (
    <div>
      <MemberNavbar />
      <div className='mt-28 max-w-6xl mx-auto'>
        <h1 className='font-bold text-2xl'>PEOPLE YOU HAVE NOMINATED</h1>
        <table className="table-auto mt-5 w-full">
          <thead>
            <tr>
              <th className="px-4 py-2 bg-gray-200 text-gray-700">Candidate Position</th>
              <th className="px-4 py-2 bg-gray-200 text-gray-700">Candidate Name</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((item, index) => (
              <tr key={index}>
                <td className="border px-4 py-2">{item.name}</td>
                <td className="border px-4 py-2">{item.nominatedName}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Viewnominations;
