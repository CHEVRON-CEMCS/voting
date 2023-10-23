import MemberNavbar from '@/components/MemberNavbar';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNewAuth } from '@/services/NewAuthContext';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/router';
import { Loader2 } from 'lucide-react';

function Multiplecampaigns() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCandidates, setSelectedCandidates] = useState({});
  const [selectedPositions, setSelectedPositions] = useState({}); // Add a state for selected positions
  const [selectedCandidatesByPosition, setSelectedCandidatesByPosition] = useState({});
  const [isloading, setIsLoading] = useState(false);

  const [errors, setErrors] = useState([]); // State variable for errors
  const { employeeNumber } = useNewAuth();

  const { toast } = useToast();

  const router = useRouter(); // Initialize the router



  const empno = employeeNumber; // Assign the value of employeeNumber to empno
  
  console.log(employeeNumber);

  const {code} = useNewAuth();

  console.log(code);

  useEffect(() => {
    const email = 'charles.osegbue@chevron.com';

    // Configure headers with authorization token
    const headers = {
      'Authorization': `Bearer 018112`,
      'Content-Type': 'application/json',
    };

    // Make an API GET request with query parameters
    axios.get('https://virtual.chevroncemcs.com/voting/getVoteCandidates', {
      headers: headers,
      params: {
        empno: "2419",
      }
    })
      .then(response => {
        console.log('API Response:', response.data); // Log the response
        const filteredData = response.data.data.filter(item => item.nominated === 1);
        // Initialize selectedCandidates state with default values
        const initialSelectedCandidates = {};
        filteredData.forEach(item => {
          initialSelectedCandidates[item.empno] = false;
        });
        setSelectedCandidates(initialSelectedCandidates);
        setData(filteredData);
      })
      .catch(error => {
        console.error("API request error:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const handleCandidateSelection = (empno, positionId, name) => {
    // Check if the candidate is already selected
    const isSelected = selectedCandidates[empno];
  
    // Check if a candidate from the same nominatedPosition is already selected
    const isCandidateAlreadySelected = Object.values(selectedPositions).includes(positionId, name);

    console.log(`Selected Empno: ${empno}, PositionId: ${positionId}, Name: ${name}`);

  
    // If the candidate is not selected and no candidate from the same nominatedPosition is already selected, allow selection
    if (!isSelected && !isCandidateAlreadySelected) {
      setSelectedCandidates({
        ...selectedCandidates,
        [empno]: true,
      });
  
      setSelectedPositions({
        ...selectedPositions,
        [empno]: positionId,
      });

      setSelectedCandidatesByPosition({
        ...selectedCandidatesByPosition,
        [empno]: name,
      });
    }
    // If the candidate is already selected, unselect
    else if (isSelected) {
      setSelectedCandidates({
        ...selectedCandidates,
        [empno]: false,
      });
  
      // Remove the position if unselected
      const updatedSelectedPositions = { ...selectedPositions };
      delete updatedSelectedPositions[empno];
      setSelectedPositions(updatedSelectedPositions);
    }
  };
  

  // Create a function to group data by positionName
  const groupDataByPosition = () => {
    const groupedData = {};
    data.forEach(item => {
      if (!groupedData[item.position_name]) {
        groupedData[item.position_name] = {
          positionName: item.position_name,
          candidates: [],
        };
      }
      groupedData[item.position_name].candidates.push(item);
    });
    return Object.values(groupedData);
  };
  

  const sendVoteRequest = async () => {
    // Clear any previous error message
    setErrors([]);
    setIsLoading(true); // Set isloading to true when you start the voting operation

    // Create an array of selected candidates to vote for
    const candidatesToVoteFor = Object.entries(selectedCandidates)
      .filter(([empno, selected]) => selected)
      .map(([empno]) => empno);
  
    if (candidatesToVoteFor.length === 0) {
      console.log("No candidates selected to vote for.");
      setIsLoading(false); // Set isloading to false if there are no candidates to vote for
      return;
    }
  
    // Configure headers with authorization token for the POST request
    const voteHeaders = {
      Authorization: `Bearer ${code}`,
    };
  
    try {
      for (const empno of candidatesToVoteFor) {
        const nominatedPosition = selectedPositions[empno];
        const name = selectedCandidatesByPosition[empno]; // Get the name
  
        const votePayload = {
          empno: employeeNumber, // Use the user's employee number
          positionId: nominatedPosition, // Include nominatedPosition in the payload
          votedno: empno, // the candidate's employee number
        };
  
        console.log('Sending vote for empno:', empno);
  
        const response = await axios.post(
          'https://virtual.chevroncemcs.com/voting/vote',
          votePayload,
          {
            headers: voteHeaders,
          }
        );
  
        console.log('Vote Request Response:', response.data);
  
        // Check if the response contains a message indicating that the vote has already been cast
        if (response.data.message === 'You have voted someone for this position already! ') {
          const errorMessage = `Voting Error: ${response.data.message}  (Candidate Name: ${name})`;
          setErrors((prevErrors) => [...prevErrors, errorMessage]);
          toast({
            variant: "destructive",
            title: 'Voting Errors',
            description: ` ${response.data.message} ${name}`,
          });
        } else if (response.data.message === 'You cant vote yourself!') {
          const errorMessage = `Voting Error: ${response.data.message}  (Candidate Name: ${name})`;
          setErrors((prevErrors) => [...prevErrors, errorMessage]);
          toast({
            variant: "destructive",
            title: 'Voting Errors',
            description: ` ${response.data.message} ${name}`,
          });
        } else {
            toast({
              title: 'Voting Success',
              description: response.data.message,
            });
            // Redirect to the '/votesuccess' page
          // router.push('/votesuccess');
  
          // Reset the selectedCandidates and selectedPositions after successful vote
          setSelectedCandidates({});
          setSelectedPositions({});
          setSelectedCandidatesByPosition({});
  
          console.log('Selected candidates and positions reset.');
        }
      }
  
      console.log('All votes sent successfully.');
      setIsLoading(false); // Set isloading to false after all votes are sent successfully

    } catch (error) {
      const errorMessage = `Vote Request Error: ${error.message}`;
      setErrors((prevErrors) => [...prevErrors, errorMessage]);
      setIsLoading(false); // Set isloading to false in case of an error

    }
  };
  
  return (
    <div>
      <MemberNavbar />
      <div className='mt-20 max-w-6xl mx-auto'>
        {/* Display the error message at the top of the page */}
        {/* Display the error messages at the top of the page */}
        {errors.length > 0 && (
          <div className="bg-red-500 text-white p-2 mb-4">
            {errors.map((error, index) => (
              <div key={index}>{error}</div>
            ))}
          </div>
        )}
        <h1 className='mb-10 font-bold text-3xl text-center'>VOTE MULTIPLE CANDIDATES</h1>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <div className="grid grid-cols-3 gap-4">
            {groupDataByPosition().map(group => (
              <div key={group.positionName}>
                <h2 className='font-bold text-xl mb-2'>{group.positionName}</h2>
                <ul>
                  {group.candidates.map(candidate => (
                    <li key={candidate.empno}>
                      <p
                        className={`border p-4 font-semibold rounded mb-2 cursor-pointer ${selectedCandidates[candidate.empno] ? 'border-blue-500' : ''}`}
                        onClick={() => handleCandidateSelection(candidate.empno, candidate.positionId, candidate.name)}
                        >
                        {candidate.name}
                      </p>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}
        <Button onClick={sendVoteRequest} className="mt-5" disabled={isloading}>
                        {isloading ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Voting...
                          </>
                        ) : (
                          <>
                            Vote
                          </>
                        )}
                      </Button>
        {/* <Button onClick={sendVoteRequest} className="mt-5">Submit</Button> */}
      </div>
    </div>
  );
}

export default Multiplecampaigns
