import MemberNavbar from '@/components/MemberNavbar';
import { useNewAuth } from '@/services/NewAuthContext';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Drawer } from 'vaul';

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
  // State to track whether the screen size is mobile or not
  const [isMobile, setIsMobile] = useState(false);
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // State to track loading state

  const [cache, setCache] = useState({});


  const { toast } = useToast();

  const employeeNumberAsNumber = parseInt(employeeNumber, 10);
  console.log(employeeNumber)

  console.log(code)

  useEffect(() => {
    // Check the screen size on component mount
    setIsMobile(window.innerWidth <= 768);

    // Add event listener to check screen size on window resize
    const handleResize = () => {
        setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener('resize', handleResize);

    // Remove the event listener when the component is unmounted
    return () => {
        window.removeEventListener('resize', handleResize);
    };
}, []);

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
        }
        console.log('data',response.data.data)
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
    // console.log('search', newSearchTerms[index])
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
      if (searchTerm?.trim() === '') {
        return setSearchResults([]); // Return an empty array if the search term is empty
      }
  
      const positionId = unoccupiedPositions[index]?.id;
      const apiUrl = `https://virtual.chevroncemcs.com/voting/member/${searchTerm}/${positionId || ''}`;
  
      // Create a function that captures the correct index
      const handleSearchResults = (response) => {
        if (response.status === 200) {
          // Filter the results to only include names starting with the search term
          return response.data.data.filter((result) =>
          result.name.toLowerCase().startsWith((searchTerms[index] ?? '').toLowerCase())
        );
        } else {
          return [];
        }
      };
  
      return axios.get(apiUrl).then(handleSearchResults); // Use the function as the callback
    });
  
    Promise.all(fetchResultsPromises)
      .then((newSearchResults) => {
        setSearchResults(newSearchResults);
        console.log('search', newSearchResults);
      })
      .catch((error) => {
        console.error('Error fetching search results:', error);
      });
  }, [searchTerms]);

  useEffect(() => {
    const fetchResultsPromises = searchTermsOne.map((searchTerm, index) => {
      if (searchTerm?.trim() === '') {
        return Promise.resolve([]); // Return an empty array if the search term is empty
      }
  
      const positionId = unoccupiedPositions[index]?.id;
      const apiUrl = `https://virtual.chevroncemcs.com/voting/member/${searchTerm}/${positionId || ''}`;
  
      // Create a function that captures the correct index
      const handleSearchResults = (response) => {
        if (response.status === 200) {
          // Filter the results to only include names starting with the search term
          return response.data.data.filter((result) =>
          result.name.toLowerCase().startsWith((searchTermsOne[index] ?? '').toLowerCase())
        );
        } else {
          return [];
        }
      };

  
      return axios.get(apiUrl).then(handleSearchResults); // Use the function as the callback
    });
  
    Promise.all(fetchResultsPromises)
      .then((newSearchResults) => {
        setSearchResults(newSearchResults);
        console.log('search', newSearchResults);
      })
      .catch((error) => {
        console.error('Error fetching search results:', error);
      });
  }, [searchTermsOne]);
  
  

  // useEffect(() => {
  //   const fetchResultsPromises = searchTermsOne.map((searchTerm, index) => {
  //     if (searchTerm?.trim() === '') {
  //       return Promise.resolve([]); // Return an empty array if the search term is empty
  //     }
  //     return axios.get(`https://virtual.chevroncemcs.com/voting/member/${searchTerm}`);
  //   });

  //   Promise.all(fetchResultsPromises)
  //     .then((responses) => {
  //       const newSearchResults = responses.map((response) => (response.status === 200 ? response.data.data : []));
  //       setSearchResults(newSearchResults);
  //     })
  //     .catch((error) => {
  //       console.error('Error fetching search results:', error);
  //     });
  // }, [searchTermsOne]);

  const handleNominationSubmit = async () => {
    try {
      setIsLoading(true); // Set loading to true when nomination starts

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
      // Reset the loading state after nominations are submitted
      setIsLoading(false);
      // ...
      // Reload the page after nominations are submitted
    window.location.reload();
    } catch (error) {
        toast({
            title: 'There was a problem.',
            description: 'There was an error nominating your candidate.',
            variant: 'destructive',
          });    
          setIsLoading(false); // Reset the loading state in case of an error  
          // ...
    }
  };

  return (
    <div>
      <MemberNavbar />
      <div className='mt-20 max-w-6xl mx-auto'>
        <h1 className='font-bold text-2xl text-center md:text-left'>NOMINATE YOUR CANDIDATE</h1>
        <div className='flex flex-col justify-center pb-2 mt-5 max-w-6xl mx-auto mb-5 '>
        {isMobile ? (
                                <div className=''>
                                    <div className='bg-[#CF1A32]'>
                                        <p className='p-5 text-center text-white mb-2'>Please click on the button below to find out more about this stage</p>
                                    </div>
                                    <div>
                                    <Drawer.Root dismissible={false} open={open}>
                                        <Drawer.Trigger data-testid="trigger" asChild onClick={() => setOpen(true)}>
                                            <div className='flex justify-center'>
                                            <Button>Show Information</Button>
                                            </div>
                                        </Drawer.Trigger>
                                        <Drawer.Portal>
                                        <Drawer.Overlay className="fixed inset-0 bg-black/40" />
                                        <Drawer.Content
                                            data-testid="content"
                                            className="bg-zinc-100 flex flex-col rounded-t-[10px] mt-24 fixed bottom-0 left-0 right-0"
                                        >
                                            <div className="p-4 bg-white rounded-t-[10px] flex-1">
                                            <div className="mx-auto w-12 h-1.5 flex-shrink-0 rounded-full bg-zinc-300 mb-8" />
                                            <div className="max-w-md mx-auto">
                                                <Drawer.Title className="font-medium mb-4">Nomination Stage</Drawer.Title>
                                                <p className="text-zinc-600 mb-2">
                                                  The table allows you to nominate candidates for positions. If you have nominated someone already
                                                  their name will show on the table beside the position they are nominated for. There will be no search box to search
                                                  for another candidate if you have nominated a candidate for a position. 
                                                  You can select multiple candidates at once or select one by one to nominate your candidate.
                                                  If you have not finished nominating your candidates, you can always come back at a later time.

                                                  <br />NOTE: WHEN YOU SEARCH FOR YOUR CANDIDATE. IF THEIR NAME DOES NOT APPEAR ON THE RESULT, THEN SEARCH FOR THEM STARTING WITH THEIR LAST NAME INSTEAD.
                                                </p>
                                                

                                                <button
                                                type="button"
                                                data-testid="dismiss-button"
                                                onClick={() => setOpen(false)}
                                                className="rounded-md mb-6 w-full bg-gray-900 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-gray-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-600"
                                                >
                                                Click to close
                                                </button>
                                            </div>
                                            </div>
                                            <div className="p-4 bg-zinc-100 border-t border-zinc-200 mt-auto">
                                            <div className="flex gap-6 justify-end max-w-md mx-auto">
                                                Powered by CEMCS
                                            </div>
                                            </div>
                                        </Drawer.Content>
                                        </Drawer.Portal>
                                    </Drawer.Root>
                                    </div>
                                </div>
                            ) : (
                                <div>
                                    {/* ... (existing code) */}
                                    <p className='p-5 text-white bg-[#1E2C8A]'>
                                      The table allows you to nominate candidates for positions. If you have nominated someone already
                                      their name will show on the table beside the position they are nominated for. There will be no search box to search
                                      for another candidate if you have nominated a candidate for a position. 
                                      You can select multiple candidates at once or select one by one to nominate your candidate.
                                      If you have not finished nominating your candidates, you can always come back at a later time.     

                                      <br />NOTE: WHEN YOU SEARCH FOR YOUR CANDIDATE. IF THEIR NAME DOES NOT APPEAR ON THE RESULT, THEN SEARCH FOR THEM STARTING WITH THEIR LAST NAME INSTEAD.                            
                                    </p>
                                </div>
                            )}
            {/* <p className='p-5 text-white'>
                The table allows you to nominate candidates for positions. If you have nominated someone already
                their name will show on the table beside the position they are nominated for. There will be no search box to search
                for another candidate if you have nominated a candidate for a position. 
                You can select multiple candidates at once or select one by one to nominate your candidate.
                If you have not finished nominating your candidates, you can always come back at a later time.
            </p> */}
        </div>
        <div className='mb-5 text-center md:text-left'>
          Having challenges you can reach out to us directly at: <b><a className='underline' href="mailto:l9lek325-smb@chevron.com">l9lek325-smb@chevron.com</a></b> or Call us at <a className='underline font-bold' href="tel:+2348092362752">08092362752</a>
        </div>
        <div className='mt-5 mb-5 overflow-x-auto'>
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
                            value={searchTermsOne[index] || ''}
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

        </div>
        <div className='mt-5 mb-5 ml-2 lg:ml-0'>
          <Button onClick={handleNominationSubmit} disabled={isLoading}>
            {isLoading ? 'Submitting...' : 'Submit'}
          </Button>
        </div>

        
      </div>
    </div>
  );
}

export default Viewnomsearch;
