import MemberNavbar from '@/components/MemberNavbar';
import { useToast } from '@/components/ui/use-toast';
import { useNewAuth } from '@/services/NewAuthContext';
import React, { useState, useEffect } from 'react';
import axios from 'axios'; // Import Axios

function Viewvotes() {
  const { employeeNumber } = useNewAuth();
  const { toast } = useToast();
  const { code } = useNewAuth();

  const [filteredData, setFilteredData] = useState([]); // State to store filtered data
  const [positions, setPositions] = useState([]); // State to store positions data


  useEffect(() => {
    // Construct the API URL with the employeeNumber
    const apiUrl = `https://virtual.chevroncemcs.com/voting/getVoteCandidates/${employeeNumber}`;

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
        }
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
        // You can add error handling or display a toast message here
        toast.error('Error fetching data. Please try again.');
      });
  }, [employeeNumber, code]); // Trigger the request when employeeNumber or code changes

  useEffect(() => {
    async function fetchPositions() {
      try {
        const response = await axios.get('https://virtual.chevroncemcs.com/voting/position');

        if (response.status === 200) {
          setPositions(response.data.data);
        } else {
          console.error('API request failed with status:', response.status);
        }
      } catch (error) {
        console.error('Error fetching positions:', error);
      }
    }

    fetchPositions();
  }, []);

  // Create a list of positions that are not taken
  const unoccupiedPositions = positions.filter(
    (position) => !filteredData.some((candidate) => candidate.name === position.name)
  );

  return (
    <div>
      <MemberNavbar />
      <div className='mt-28 max-w-6xl mx-auto'>
        <h1 className='font-bold text-2xl'>PEOPLE YOU HAVE VOTED FOR</h1>
        <table className="table-auto mt-5 w-full">
          <thead>
            <tr>
              <th className="px-4 py-2 bg-gray-200 text-gray-700">Candidate Name</th>
              <th className="px-4 py-2 bg-gray-200 text-gray-700">Candidate Position</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((item, index) => (
              <tr key={index}>
                <td className="border px-4 py-2">{item.votedName}</td>
                <td className="border px-4 py-2">{item.name}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Viewvotes;
