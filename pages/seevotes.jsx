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

function Seevotes() {
  const { user } = useAuth();
  const { toast } = useToast();

  const userToken = user?.token;
  const userEmail = user?.email;

  const [loading, setLoading] = useState(true);
  const [nominationsData, setNominationsData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isEmpno, setIsEmpno] = useState('');
  const [positions, setPositions] = useState([]); // State for positions
  const [selectedPosition, setSelectedPosition] = useState(''); // State for selected position

  // Define state to store the highest result for each position
  const [highestResults, setHighestResults] = useState({});

  // CSS class for green rows
  const greenRowClass = 'green-row';

  console.log(userToken);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('https://virtual.chevroncemcs.com/voting/votes', {
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

  //Fetch positions data from the API

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
        <h1 className="text-3xl font-semibold mb-4">Election Results</h1>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <div>
            <div className="overflow-x-auto">
              <table className="w-full table-auto border-collapse border border-gray-300">
                <thead>
                  <tr>
                    <th className="px-6 py-3 bg-gray-200 text-left">Employee Number</th>
                    {positionHeaders.map((header, index) => (
                      <th key={index} className="px-6 py-3 bg-gray-200 text-left">
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {nominationsData.map((item, index) => (
                    <tr key={index} className={index % 2 === 0 ? 'bg-gray-100' : ''}>
                      <td className="px-6 py-4">{item.empno}</td>
                      {positionHeaders.map((header, headerIndex) => (
                        <td
                          key={headerIndex}
                          className={`px-6 py-4 ${
                            item.counts.find((countItem) => countItem.positionName === header)?.count ===
                            highestResults[header]
                              ? 'bg-green-500' // Apply green background to the cell with the highest result
                              : ''
                          }`}
                        >
                          {item.counts.find((countItem) => countItem.positionName === header)?.count || 0}
                        </td>
                      ))}
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

export default Seevotes;
