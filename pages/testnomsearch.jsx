import MemberNavbar from '@/components/MemberNavbar';
import { useNewAuth } from '@/services/NewAuthContext';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

function Viewnomsearch() {
  const { employeeNumber, code } = useNewAuth();

  const [filteredData, setFilteredData] = useState([]); // State to store filtered data
  const [positions, setPositions] = useState([]); // State to store positions data
  const [searchTerms, setSearchTerms] = useState([]); // State to store search terms
  const [searchTermsOne, setSearchTermsOne] = useState([]); // State to store search terms
  const [searchResults, setSearchResults] = useState([]); // State to store search results
  const [selectedResults, setSelectedResults] = useState([]);
  const [showOverlays, setShowOverlays] = useState(Array(3).fill(false)); // State to control overlay display for each search bar
  const [isEditing, setIsEditing] = useState([]); // Initialize isEditing as an empty array

  const { toast } = useToast();

  const employeeNumberAsNumber = parseInt(employeeNumber, 10);

  console.log(code)

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

  // Create a list of positions that are not taken
  const unoccupiedPositions = positions.filter(
    (position) => !filteredData.some((candidate) => candidate.name === position.name)
  );

  const handleSearchChange = (e, index) => {
    const newSearchTerms = [...searchTerms];
    newSearchTerms[index] = e.target.value;
    setSearchTerms(newSearchTerms);
  };
  
  const handleSearchChangeOne = (e, index) => {
    const newSearchTermsOne = [...searchTermsOne]
    newSearchTermsOne[index] = e.target.value;
    setSearchTermsOne(newSearchTermsOne);
  };

  const handleResultSelect = (result, index) => {
    const newSelectedResults = [...selectedResults];
    const selectedPosition = positions.find((position) => position.name === unoccupiedPositions[index].name);

    if (selectedPosition) {
      newSelectedResults[index] = {
        ...result,
        positionId: selectedPosition.id
      };

      setSelectedResults(newSelectedResults);

      // Log the selected candidate and positionId
      console.log('Selected Candidate:', newSelectedResults[index]);

      setIsEditing((prevIsEditing) => {
        const newIsEditing = [...prevIsEditing];
        newIsEditing[index] = false;
        return newIsEditing;
      });

      // Close the overlay card for this search bar
      setShowOverlays((prevState) => prevState.map((value, i) => (i === index ? false : value)));
    } else {
      console.error('Selected position not found for candidate:', result.name);
    }

    // Update the search term to show the selected candidate's name
    const newSearchTerms = [...searchTerms];
    newSearchTerms[index] = result.name;
    setSearchTerms(newSearchTerms);
  };

  const handleResultSelectOne = (result, index) => {
    const newSelectedResults = [...selectedResults];
    const selectedPosition = positions.find((position) => position.name === filteredData[index].name);

    if (selectedPosition) {
      newSelectedResults[index] = {
        ...result,
        positionId: selectedPosition.id
      };

      setSelectedResults(newSelectedResults);

      // Log the selected candidate and positionId
      console.log('Selected Candidate:', newSelectedResults[index]);

      setIsEditing((prevIsEditing) => {
        const newIsEditing = [...prevIsEditing];
        // newIsEditing[index] = false;
        return newIsEditing;
      });

      // Close the overlay card for this search bar
      setShowOverlays((prevState) => prevState.map((value, i) => (i === index ? false : value)));
    } else {
      console.error('Selected position not found for candidate:', result.name);
    }

    // Update the search term to show the selected candidate's name
    const newSearchTermsOne = [...searchTermsOne]
    newSearchTermsOne[index] = result.name;
    setSearchTermsOne(newSearchTermsOne);
  };

  const toggleEdit = (index) => {
    setIsEditing((prevIsEditing) => {
      const newIsEditing = [...prevIsEditing];
      newIsEditing[index] = !newIsEditing[index];
      return newIsEditing;
    });
  };

  const handleSearchFocus = (index) => {
    const newShowOverlays = [...showOverlays];
    newShowOverlays[index] = true;
    setShowOverlays(newShowOverlays);
  };
    

  useEffect(() => {
    const fetchResultsPromises = searchTerms.map((searchTerm, index) => {
      if (searchTerm.trim() === '') {
        return Promise.resolve([]); // Return an empty array if the search term is empty
      }
      return axios.get(`https://virtual.chevroncemcs.com/voting/member/${searchTerm}`);
    });

    Promise.all(fetchResultsPromises)
      .then((responses) => {
        const newSearchResults = responses.map((response) => (response.status === 200 ? response.data.data : []));
        setSearchResults(newSearchResults);
      })
      .catch((error) => {
        console.error('Error fetching search results:', error);
      });
  }, [searchTerms]);

  useEffect(() => {
    const fetchResultsPromises = searchTermsOne.map((searchTerm, index) => {
      if (searchTerm.trim() === '') {
        return Promise.resolve([]); // Return an empty array if the search term is empty
      }
      return axios.get(`https://virtual.chevroncemcs.com/voting/member/${searchTerm}`);
    });

    Promise.all(fetchResultsPromises)
      .then((responses) => {
        const newSearchResults = responses.map((response) => (response.status === 200 ? response.data.data : []));
        setSearchResults(newSearchResults);
      })
      .catch((error) => {
        console.error('Error fetching search results:', error);
      });
  }, [searchTermsOne]);

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
      // Reload the page after nominations are submitted
    window.location.reload();
    } catch (error) {
        toast({
            title: 'There was a problem.',
            description: 'There was an error nominating your candidate.',
            variant: 'destructive',
          });      
          // ...
    }
  };

  return (
    <div>
      <MemberNavbar />
      <div className='mt-20 max-w-6xl mx-auto'>
        <h1 className='font-bold text-2xl'>NOMINATE YOUR CANDIDATE</h1>
        <div className='flex flex-col justify-center pb-2 mt-5 max-w-6xl mx-auto mb-5 bg-[#1E2C8A]'>
            <p className='p-5 text-white'>
                The table allows you to nominate candidates for positions. If you have nominated someone already
                their name will show on the table beside the position they are nominated for. There will be no search box to search
                for another candidate if you have nominated a candidate for a position. 
                You can select multiple candidates at once or select one by one to nominate your candidate.
                If you have not finished nominating your candidates, you can always come back at a later time.
            </p>
        </div>
        <div className='mb-5'>
          Having challenges you can reach out to us directly at: <b><a className='underline' href="mailto:l9lek325-smb@chevron.com">l9lek325-smb@chevron.com</a></b>
        </div>
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
                {/* <td className="border px-4 py-2">{item.nominatedName}</td> */}
                <td className="border px-4 py-2 flex space-x-3">
                {isEditing[index] ? (
                      <div className="relative">
                        <input
                          type="text"
                          placeholder="Search..."
                          className="p-1 border rounded-md"
                          value={searchTermsOne[index]}
                          onChange={(e) => handleSearchChangeOne(e, index)}
                        />
                        {searchResults[index] && searchResults[index].length > 0 && (
                          <div className="absolute bg-white rounded-md border shadow p-2 mt-1 z-10">
                            {searchResults[index].map((result) => (
                              <div
                                key={result.id}
                                onClick={() => handleResultSelectOne(result, index)}
                                style={{ cursor: 'pointer' }}
                              >
                                {result.name}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ) : (
                       <p>
                            {item.nominatedName}
                       </p> 
                    )}
                    
                </td>
                <td className='border px-4 py-2'>
                <Button
  onClick={() => toggleEdit(index)}
  className=""
>
  Edit Nomination
</Button>

                </td>
              </tr>
            ))}
            {unoccupiedPositions.map((position, index) => (
              <tr key={position.id}>
                <td className="border px-4 py-2">{position.name}</td>
                <td className="border px-4 py-2">
                  <input
                    type="text"
                    placeholder="Search for a candidate"
                    value={searchTerms[index] || ''}
                    onChange={(e) => handleSearchChange(e, index)}
                    className="p-1 border border-black rounded-md"
                    onFocus={() => handleSearchFocus(index)}
                  />
                  {showOverlays[index] && searchResults[index] && (
                    <div className="absolute bg-white rounded-md border shadow p-2 mt-1 z-10">
                      {searchResults[index].map((result) => (
                        <div key={result.id} className='cursor-pointer' onClick={() => handleResultSelect(result, index)}>
                          {result.name}
                        </div>
                      ))}
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className='mt-5 mb-5'>
          <Button onClick={handleNominationSubmit}>Submit</Button>
        </div>

        
      </div>
    </div>
  );
}

export default Viewnomsearch;
