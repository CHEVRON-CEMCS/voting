import React, { useRef, useState } from 'react';
import { Button } from './ui/button';
import axios from 'axios';
import { useAuth } from '@/services/AuthContext';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Loader2, LogInIcon } from 'lucide-react';

function SmallBanner() {
  const selectedStageRef = useRef(4); // Default to Nomination stage (ID 4)
  const [isLoading, setIsLoading] = useState(false);
  const apiUrl = 'https://virtual.chevroncemcs.com/voting/stage/current';
  const { user } = useAuth();
  console.log(user?.email);

  const userEmail=user?.email

  const handleStageChange = (event) => {
    selectedStageRef.current = parseInt(event.target.value, 10);
  };

  const handleSubmit = () => {
    const apiKey = user?.token; // Replace with your actual API key or token

    // Prepare the data for the PATCH request
    const requestData = {
      email: userEmail,
      id: selectedStageRef.current,
    };

    console.log('Sending data:', requestData); // Log the data being sent

    // Set isLoading to true to indicate that the request is in progress
    setIsLoading(true);

    // Perform the PATCH request to update the current stage using Axios with Authorization header
    axios
      .patch(apiUrl, requestData, {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
      })
      .then((response) => {
        // Set isLoading back to false when the request is complete
        setIsLoading(false);

        // Log the response
        console.log('Response:', response);

        if (!response.data.error) {
          // Display a success toast notification
          toast.success(`Current Stage updated`);
        } else {
          // Display an error toast notification
          toast.error('Error updating current stage');
        }
      })
      .catch((error) => {
        // Set isLoading back to false when there is an error
        setIsLoading(false);

        // Log the error
        console.error('Error updating current stage:', error);
        // Display an error toast notification
        toast.error('Error updating current stage');
      });
  };

  return (
    <div className='flex flex-col justify-center pb-10 mt-20 max-w-6xl mx-auto mb-10 bg-[#1E2C8A]'>
      <h1 className={` mb-5 text-center text-3xl mt-14 text-white`}>
        Select the current stage of the voting process.
      </h1>
      <div className='flex flex-col justify-center items-center mt-5'>
        <select
          onChange={handleStageChange}
          className="w-[300px] px-4 py-2 rounded-md shadow-md bg-gray-200 text-gray-800 focus:outline-none focus:ring focus:border-blue-300"
          defaultValue={selectedStageRef.current}
        >
          <option value={4}>Nomination stage</option>
          <option value={5}>Campaign Stage</option>
          <option value={6}>Voting Stage</option>
          <option value={7}>Voting Ended Stage</option>
        </select>

        <Button
          onClick={handleSubmit}
          className="bg-[#CC444B] hover:bg-[#bdc493] text-white mt-8 px-7 py-5"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Submitting...
            </>
          ) : (
            <>
              <LogInIcon className='h-4 w-4 mr-2' />
              Submit
            </>
          )}
        </Button>

        <ToastContainer /> {/* Add this line to render the toast notifications */}
      </div>
    </div>
  );
}

export default SmallBanner;
