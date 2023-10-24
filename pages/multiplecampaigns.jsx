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
    setIsLoading(true);
  
    const voteHeaders = {
      Authorization: `Bearer ${code}`,
    };
  
    try {
      const votes = [];
  
      // Iterate over selected candidates by position
      for (const positionName in selectedCandidatesByPosition) {
        const empno = selectedCandidatesByPosition[positionName];
        const position = data.find(candidate => candidate.position_name === positionName);
        const name = data.find(candidate => candidate.empno === empno).name;
  
        if (!empno) {
          // Candidate not selected for this position
          continue;
        }
  
        const votePayload = {
          empno: employeeNumber,
          positionId: position.positionId,
          votedno: empno,
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
        }
  
        votes.push({ positionName, empno });
      }
  
      // Reset the selectedCandidatesByPosition state after successful votes
      setSelectedCandidatesByPosition({});
  
      console.log('All votes sent successfully.');
      setIsLoading(false);
  
    } catch (error) {
      const errorMessage = `Vote Request Error: ${error.message}`;
      setErrors((prevErrors) => [...prevErrors, errorMessage]);
      setIsLoading(false);
    }
  };
  
  
  return (
    <div>
      <MemberNavbar />
      <div className='mt-20 max-w-6xl mx-auto'>
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
                <select
                  value={selectedCandidatesByPosition[group.positionName] || ''}
                  className='border p-2 rounded-md'
                  onChange={(e) =>
                    setSelectedCandidatesByPosition({
                      ...selectedCandidatesByPosition,
                      [group.positionName]: e.target.value,
                    })
                  }
                >
                  <option value="">Select a candidate</option>
                  {group.candidates.map(candidate => (
                    <option key={candidate.empno} value={candidate.empno}>
                      {candidate.name}
                    </option>
                  ))}
                </select>
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
            <>Vote</>
          )}
        </Button>
      </div>
    </div>
  );
}

export default Multiplecampaigns
