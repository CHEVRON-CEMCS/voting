import MemberNavbar from '@/components/MemberNavbar';
import React, { useEffect, Fragment, useState } from 'react';
import axios from 'axios';
import { useNewAuth } from '@/services/NewAuthContext';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/router';
import { Loader2 } from 'lucide-react';
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogFooter,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, Transition } from '@headlessui/react'

function Multiplecampaigns() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCandidates, setSelectedCandidates] = useState({});
  const [selectedPositions, setSelectedPositions] = useState({}); // Add a state for selected positions
  const [selectedCandidatesByPosition, setSelectedCandidatesByPosition] = useState({});
  const [isloading, setIsLoading] = useState(false);
  const [filteredData, setFilteredData] = useState([]); // State to store filtered data
  const [selectedCandidatesForVoting, setSelectedCandidatesForVoting] = useState({});
  const [showSelectedNames, setShowSelectedNames] = useState(false);

  let [isOpen, setIsOpen] = useState(false)

  function closeModal() {
    setIsOpen(false)
  }

  function openModal() {
    setIsOpen(true)
  }

  const toggleSelectedNames = () => {
    setShowSelectedNames(!showSelectedNames);
  };

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
  }, [code, employeeNumber]);

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
  // const groupDataByPosition = () => {
  //   const groupedData = {};
  //   data.forEach(item => {
  //     if (!groupedData[item.position_name]) {
  //       groupedData[item.position_name] = {
  //         positionName: item.position_name,
  //         candidates: [],
  //       };
  //     }
  //     groupedData[item.position_name].candidates.push(item);
  //   });
  //   return Object.values(groupedData);
  // };

  const groupDataByPosition = () => {
    const groupedData = {};
    data.forEach(item => {
      if (!groupedData[item.position_name]) {
        groupedData[item.position_name] = {
          positionName: item.position_name,
          candidates: [],
        };
      }
      groupedData[item.position_name].candidates.push({
        empno: item.empno,
        name: item.name, // Include candidate name in the grouped data
      });
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

      // Close the modal after the votes are sent
    closeModal();
  
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
  onChange={(e) => {
    const selectedEmpno = e.target.value;
    const selectedCandidate = group.candidates.find(candidate => candidate.empno === selectedEmpno);
    console.log(`Selected Candidate: ${selectedCandidate.name} for Position: ${group.positionName}`);
    setSelectedCandidatesByPosition({
      ...selectedCandidatesByPosition,
      [group.positionName]: selectedEmpno,
    });
  }}
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

        {/* Button to display selected names */}
        {/* <Button onClick={toggleSelectedNames} className="bg-[#1E2C8A] mt-5">
          Display Selected Names
        </Button> */}

        {/* Display selected names if the button is clicked */}
        {/* {showSelectedNames && (
          <div className="mt-5">
            <h2 className="font-bold text-xl">Selected Names:</h2>
            <ul>
              {Object.entries(selectedCandidatesByPosition).map(([positionName, empno]) => {
                const selectedCandidate = groupDataByPosition()
                  .find(group => group.positionName === positionName)
                  .candidates.find(candidate => candidate.empno === empno);
                return (
                  <li key={positionName}>
                    Position: {positionName}, Candidate: {selectedCandidate.name}
                  </li>
                );
              })}
            </ul>
          </div>
        )} */}

<>
<Button
  onClick={() => {
    toggleSelectedNames(); // Call toggleSelectedNames before opening the modal
    openModal(); // Open the modal
  }}
  className="mt-5 bg-[#2187C0]"
>
  Submit Votes
</Button>


      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={closeModal}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900"
                  >
                    Are you sure you want to vote for these candidates?                  
                  </Dialog.Title>
                  <div className="mt-2">
                    {/* <p className="text-sm text-gray-500">
                      Your payment has been successfully submitted. We’ve sent
                      you an email with all of the details of your order.
                    </p> */}
                     {/* {showSelectedNames && ( */}
          <div className="mt-5">
            {/* <h2 className="font-bold">Selected Names:</h2> */}
            <ul>
              {Object.entries(selectedCandidatesByPosition).map(([positionName, empno]) => {
                const selectedCandidate = groupDataByPosition()
                  .find(group => group.positionName === positionName)
                  .candidates.find(candidate => candidate.empno === empno);
                return (
                  <li key={positionName}>
                    <p><span className='font-bold'>Position:</span> {positionName} - Candidate: {selectedCandidate.name}</p>
                  </li>
                );
              })}
            </ul>
          </div>
         {/* )} */}
                    
                  </div>

                  <div className="mt-4 flex items-center space-x-4">
                    <Button onClick={sendVoteRequest} className="bg-[#2187C0] mt-5" disabled={isloading}>
                      {isloading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Voting...
                        </>
                      ) : (
                        <>Yes, I do</>
                      )}
                    </Button>

                    <Button className="mt-5" onClick={closeModal}>No I do not</Button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>



        {/* <Button onClick={sendVoteRequest} className="bg-[#1E2C8A] mt-5" disabled={isloading}>
          {isloading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Voting...
            </>
          ) : (
            <>Vote Candidates</>
          )}
        </Button> */}
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
