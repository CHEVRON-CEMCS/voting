import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useToast } from '@/components/ui/use-toast';
import { useNewAuth } from '@/services/NewAuthContext';
import MemberNavbar from '@/components/MemberNavbar';
import { Button } from '@/components/ui/button';

function Search() {
  const [searchTerms, setSearchTerms] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [positions, setPositions] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [selectedResults, setSelectedResults] = useState([]);
  const [isEditing, setIsEditing] = useState([]); // Initialize isEditing as an empty array
  const apiUrl = 'https://virtual.chevroncemcs.com/voting/member';
  const nominateApiUrl = 'https://virtual.chevroncemcs.com/voting/nominate'; // The nomination endpoint URL

  const { toast } = useToast();
  const { employeeNumber } = useNewAuth();
  const { currentStage } = useNewAuth();
  const { code } = useNewAuth();

  console.log('Current Stage:', currentStage);
  console.log('Employee Number:', employeeNumber);
  console.log('code', code)

  const [nominatedNames, setNominatedNames] = useState([]); // State to store nominated names

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
            (item) => item.empno === employeeNumberAsNumber
          );

          setFilteredData(filteredData); // Store the filtered data in state
          console.log(response.data);
          console.log(filteredData);
        }
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
        // You can add error handling or display a toast message here
      });
  }, [employeeNumber, code]);



  

  useEffect(() => {
    async function fetchPositions() {
      try {
        const response = await axios.get('https://virtual.chevroncemcs.com/voting/position');

        if (response.status === 200) {
          setPositions(response.data.data);
          console.log(response.data.data)
          // Initialize isEditing based on the number of positions
          setIsEditing(Array(response.data.data.length).fill(false));
        } else {
          console.error('API request failed with status:', response.status);
        }
      } catch (error) {
        console.error('Error fetching positions:', error);
      }
    }

    fetchPositions();
  }, []);

  const handleSearchChange = (e, index) => {
    const newSearchTerms = [...searchTerms];
    newSearchTerms[index] = e.target.value;
    setSearchTerms(newSearchTerms);
  };

  const handleResultSelect = (result, index) => {
    const newSelectedResults = [...selectedResults];
    newSelectedResults[index] = {
      ...result,
      positionId: positions[index].id // Map the selected candidate to its position
    };
  
    setSelectedResults(newSelectedResults);
  
    // Log the selected candidate and positionId
    console.log('Selected Candidate:', newSelectedResults[index]);
    
    setIsEditing((prevIsEditing) => {
      const newIsEditing = [...prevIsEditing];
      newIsEditing[index] = false;
      return newIsEditing;
    });
  };
  
  

  const toggleEdit = (index) => {
    setIsEditing((prevIsEditing) => {
      const newIsEditing = [...prevIsEditing];
      newIsEditing[index] = !newIsEditing[index];
      return newIsEditing;
    });
  };

  const handleNominationSubmit = async () => {
    try {
      for (const result of selectedResults) {
        if (result) { // Check if result is defined
          const { positionId, empno } = result;
          const url = 'https://virtual.chevroncemcs.com/voting/nominate';
    
          const params = {
            empno: employeeNumber,
            positionId: positionId, // Use the positionId from the selected candidate
            nomineeno: empno,
          };
    
          const headers = {
            Authorization: `Bearer ${code}`
          };
    
          console.log('Nomination payload', params);
    
          const response = await axios.get(url, { params, headers }); // Use axios.post instead of axios.get
    
          console.log(response.data);
          toast({
            title: 'Nomination',
            description: `${response.data.message}`,
          });
    
          if (response.status !== 200) {
            console.error('Nominations submission failed');
            toast({
              title: 'There was a problem.',
              description: 'There was an error nominating your candidate.',
              variant: 'destructive',
            });
            return;
          }
        }
      }
      // ...
    } catch (error) {
      console.error('Error submitting nominations:', error);
      // ...
    }
  };
  
  
  

  useEffect(() => {
    async function fetchSearchResults(index) {
      try {
        const searchTerm = searchTerms[index];
        if (searchTerm.trim() === '') {
          setSearchResults([]);
          return;
        }

        const response = await axios.get(`${apiUrl}/${searchTerm}`);

        if (response.status === 200) {
          const newSearchResults = [...searchResults];
          newSearchResults[index] = response.data.data;
          setSearchResults(newSearchResults);
        } else {
          console.error('API request failed with status:', response.status);
        }
      } catch (error) {
        console.error('Error fetching search results:', error);
      }
    }

    searchTerms.forEach((searchTerm, index) => {
      fetchSearchResults(index);
    });
  }, [searchTerms]);


  const nominatedNameDisplay = (index) => {
    // Check if the nominatedName is in the filteredData
    if (filteredData[index]) {
      return (
        <p>{filteredData[index].nominatedName}</p>
      );
    } else {
      return (
        <p>
          {selectedResults[index]?.name} - {selectedResults[index]?.nominatedName}
        </p>
      );
    }
  };

  useEffect(() => {
    console.log('filteredData:', filteredData);
    console.log('positions:', positions);
  }, [filteredData, positions]);

  return (
    <div>
      <MemberNavbar />
      <div className='mt-20 max-w-5xl mx-auto mb-10'>
        <table className="table-auto mt-5 w-full">
          <thead>
            <tr className="">
              <th className="px-4 py-2 bg-gray-200 text-gray-700">ID</th>
              <th className="px-4 py-2 bg-gray-200 text-gray-700">Name</th>
              <th className="px-4 py-2 bg-gray-200 text-gray-700">Search</th>
            </tr>
          </thead>
          <tbody>
            {positions.map((position, index) => (
              <tr key={position.id} className="bg-white">
                <td className="border px-4 py-2">{position.id}</td>
                <td className="border px-4 py-2">{position.name}</td>
                <td className="border px-4 py-2">
                  <div className='flex space-x-5'>
                    {isEditing[index] ? (
                      <div className="relative">
                        <input
                          type="text"
                          placeholder="Search..."
                          className="p-1 border rounded-md"
                          value={searchTerms[index]}
                          onChange={(e) => handleSearchChange(e, index)}
                        />
                        {searchResults[index] && searchResults[index].length > 0 && (
                          <div className="absolute bg-white rounded-md border shadow p-2 mt-1 z-10">
                            {searchResults[index].map((result) => (
                              <div
                                key={result.id}
                                onClick={() => handleResultSelect(result, index)}
                                style={{ cursor: 'pointer' }}
                              >
                                {result.name}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ) : (
                      <div>
                        {nominatedNameDisplay(index)}
                        <button
                          onClick={() => toggleEdit(index)}
                          className="px-2 py-1 bg-blue-500 text-white rounded-md ml-2"
                          // Hide the button if nominatedName is found
                          style={{ display: filteredData[index] ? 'none' : 'block' }}
                        >
                          {isEditing[index] ? 'Save' : 'Edit'}
                        </button>
                      </div>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className='mt-5'>
          <Button onClick={handleNominationSubmit}>Submit</Button>
        </div>
      </div>
    </div>
  );
}

export default Search;