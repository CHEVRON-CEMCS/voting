import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '@/services/AuthContext';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Loader2 } from 'lucide-react';
import * as XLSX from "xlsx";

function SeeVotes() {
  const { user } = useAuth();
  const { toast } = useToast();

  const userToken = user?.token;
  const userEmail = user?.email;


  console.log('Super:',user?.superToken);

  const superrToken = user?.superToken;

  const [loading, setLoading] = useState(true);
  const [nominationsData, setNominationsData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isEmpno, setIsEmpno] = useState('');
  const [positions, setPositions] = useState([]); // State for positions
  const [selectedPosition, setSelectedPosition] = useState(''); // State for selected position

  const [sortedNominationsData, setSortedNominationsData] = useState([]);
  const [sortByPosition, setSortByPosition] = useState('');

  // Define state to store the highest result for each position
  const [highestResults, setHighestResults] = useState({});


  console.log(userToken);

  // CSS class for green rows
  const greenRowClass = 'green-row';

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('https://virtual.chevroncemcs.com/voting/nominations', {
          params: { email: userEmail },
          headers: { Authorization: `Bearer ${userToken}` },
        });

        console.log(response.data);

        if (response.data.error === false) {
          setNominationsData(response.data.data);
          setLoading(false);
        } else {
          console.error('API request failed with error:', response.data);
          setLoading(false);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, [userToken, userEmail]);

  // Fetch positions data from the API
  useEffect(() => {
    async function fetchPositions() {
      try {
        const response = await axios.get('https://virtual.chevroncemcs.com/voting/votes');

        console.log('New Norm', response);

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

  const getPositionHeaders = () => {
    const positionNames = new Set();

    nominationsData.forEach((item) => {
      item.counts.forEach((countItem) => {
        if (countItem.count > 0) {
          positionNames.add(countItem.positionName);
        }
      });
    });

    return Array.from(positionNames);
  };

  const positionHeaders = getPositionHeaders();

  const handleExportToExcel = () => {
    setIsLoading(true);

    const dataToExport = sortedNominationsData.map((item) => ({
      'Employee Number': item.empno,
      Name: item.name,
      ...positionHeaders.reduce((acc, header) => {
        acc[header] = item.counts.find((countItem) => countItem.positionName === header)?.count || 0;
        return acc;
      }, {}),
    }));

    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(dataToExport);
    XLSX.utils.book_append_sheet(wb, ws, 'Voting Data');

    XLSX.writeFile(wb, 'voting_data.xlsx');

    setIsLoading(false);
  }

  // Function to sort nominations data by the count for a specific position
  function sortNominationsDataByPosition(data, position) {
    return data.sort((a, b) => {
      const countA = a.counts.find((countItem) => countItem.positionName === position)?.count || 0;
      const countB = b.counts.find((countItem) => countItem.positionName === position)?.count || 0;
      return countB - countA;
    });
  }

  // Event handler to handle sorting when a position header is clicked
  const handlePositionHeaderClick = (position) => {
    if (sortByPosition === position) {
      // If the same position is clicked again, reverse the sorting order.
      setSortedNominationsData([...sortedNominationsData.reverse()]);
    } else {
      // Sort the data by the selected position.
      setSortByPosition(position);
      setSortedNominationsData(sortNominationsDataByPosition([...nominationsData], position));
    }
  };
  
  useEffect(() => {
    // Calculate the highest results for each position
    const calculateHighestResults = () => {
      const results = {};

      nominationsData.forEach((item) => {
        positionHeaders.forEach((header) => {
          const countItem = item.counts.find((countItem) => countItem.positionName === header);
          const count = countItem ? countItem.count : 0;

          if (!results[header] || count > results[header]) {
            results[header] = count;
          }
        });
      });

      setHighestResults(results);
    };

    calculateHighestResults();
  }, [nominationsData, positionHeaders]);

  return (
    <div>
      <Navbar />
      
      <div className="container mx-auto mt-20 mb-20">
        <h1 className="text-3xl font-semibold mb-4">Voting Results</h1>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <div>
            <Button className="mb-5" onClick={handleExportToExcel}>Export to Excel</Button>
            <div className="overflow-x-auto">
              <table className="w-full table-auto border-collapse border border-gray-300">
                <thead>
                  <tr>
                    <th className="px-6 py-3 bg-gray-200 text-left">Employee Number</th>
                    <th className="px-6 py-3 bg-gray-200 text-left">Name</th>
                    {positionHeaders.map((header, index) => (
                      <th
                        key={index}
                        className="px-6 py-3 bg-gray-200 text-left cursor-pointer"
                        onClick={() => handlePositionHeaderClick(header)}
                      >
                        {header} ↓↑
                        {sortByPosition === header && ' ↓'}
                      </th>
                    ))}
                    {/* <th className="px-6 py-3 bg-gray-200 text-left">Actions</th> */}
                  </tr>
                </thead>
                <tbody>
                  {sortedNominationsData.map((item, index) => (
                    <tr
                      key={index}
                      className={`${index % 2 === 0 ? 'bg-gray-100' : ''} `}
                    >
                      <td className="px-6 py-4">{item.empno}</td>
                      <td className="px-6 py-4">{item.name}</td>

                      {positionHeaders.map((header, headerIndex) => (
                        <td key={headerIndex} className={`px-6 py-4 ${
                          item.counts.find((countItem) => countItem.positionName === header)?.count ===
                          highestResults[header]
                            ? 'bg-green-500' // Apply green background to the cell with the highest result
                            : ''
                        }`}>
                          {item.counts.find((countItem) => countItem.positionName === header)?.count || 0}
                        </td>
                      ))}
                      <td>
                        
                      
                      </td>
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

export default SeeVotes;