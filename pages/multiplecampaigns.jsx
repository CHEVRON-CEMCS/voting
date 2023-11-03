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
  const [filteredData, setFilteredData] = useState([]); // State to store filtered data


  const [errors, setErrors] = useState([]); // State variable for errors
  const { employeeNumber } = useNewAuth();

  const { currentStage } = useNewAuth();

  console.log(currentStage)

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
      'Authorization': `Bearer ${code}`,
      'Content-Type': 'application/json',
    };

    // Make an API GET request with query parameters
    axios.get('https://virtual.chevroncemcs.com/voting/getVoteCandidates', {
      headers: headers,
      params: {
        empno: employeeNumber,
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
  
        if (response.data.error) {
          const errorMessage = `Voting Error: ${response.data.message}  (Candidate Name: ${name})`;
          setErrors((prevErrors) => [...prevErrors, errorMessage]);
          toast({
            variant: "destructive",
            title: 'Voting Errors',
            description: ` ${response.data.message} ${name}`,
          });
        } else if (response.data.error) {
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
  
  
  return (
    <div>
      <MemberNavbar />

      {currentStage === 'Campaign' ? (
        <div>
          <MemberNavbar />
          <div className="flex items-center justify-center h-screen mx-auto font-extrabold font-sora text-red-500">
            THE NOMINATION STAGE HAS ENDED
          </div>
        </div>
      ) : currentStage === 'Voting Ended' ? (
        <div>
          <MemberNavbar />
          <div className="flex items-center justify-center h-screen mx-auto font-extrabold font-sora text-red-500">
            THE VOTING STAGE HAS ENDED
          </div>
        </div>
      ) : currentStage === 'Nomination' ? (
        <div>
          <MemberNavbar />
          <div className="flex items-center justify-center h-screen mx-auto font-extrabold font-sora text-red-500">
            THE VOTING STAGE HAS NOT STARTED
          </div>
        </div>
      ) : (
        <>

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
        <div className='flex flex-col justify-center pb-2 mt-5 max-w-6xl mx-auto mb-10 bg-[#1E2C8A]'>
            <p className='p-5 text-white'>
                The table allows you to vote candidates for positions. If you have voted someone already
                their name will show on the table below the voting table.
                You can select multiple candidates at once or select one by one to vote your candidate.
                If you have not finished voting your candidates, you can always come back at a later time.
            </p>
        </div>
        {loading ? (
          <p>Loading...</p>
        ) : (
          
          <table className="table-auto border-collapse w-full">
            <thead>
              <tr>
                <th className="border p-2">Positions</th>
                <th className="border p-2">Candidates</th>
              </tr>
            </thead>
            <tbody>
              {groupDataByPosition().map((group) => (
                <tr key={group.positionName}>
                  <td className="border p-2">{group.positionName}</td>
                  <td className="border p-2">
                    <select
                      value={selectedCandidatesByPosition[group.positionName] || ''}
                      onChange={(e) =>
                        setSelectedCandidatesByPosition({
                          ...selectedCandidatesByPosition,
                          [group.positionName]: e.target.value,
                        })
                      }
                    >
                      <option value="">Select a candidate</option>
                      {group.candidates.map((candidate) => (
                        <option key={candidate.empno} value={candidate.empno}>
                          {candidate.name}
                        </option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        <Button onClick={sendVoteRequest} className="bg-[#1E2C8A] mt-5" disabled={isloading}>
          {isloading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Voting...
            </>
          ) : (
            <>Vote Candidates</>
          )}
        </Button>
      </div>
      </>
      )}

<div className='mt-20 mb-10 max-w-6xl mx-auto'>
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

export default Multiplecampaigns
