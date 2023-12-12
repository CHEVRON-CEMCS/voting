import { createContext, useContext, useState, useEffect } from 'react';
import axios from "axios"
import { useRouter } from 'next/router';

const NewAuthContext = createContext();

export function NewAuthProvider({ children }) {
  const [code, setCode] = useState(null);
  const [employeeNumber, setEmployeeNumber] = useState(null); // Change the name here
  const [currentStage, setCurrentStage] = useState(null);
  const [nominated, setNominated] = useState(null);
  const [accepted, setAccepted] = useState(null);
  const [positionId, setPositionId] = useState(null);

  const router = useRouter();

  // Function to handle authentication
  const authenticate = async (empno, otpValue) => {
    try {
      const apiUrl = 'https://virtual.chevroncemcs.com/voting/voter';
      const requestBody = {
        empno: empno,
        code: otpValue,
      };

      const response = await axios.post(apiUrl, requestBody);

      // Handle the API response here
      setCode(response.data.code);
      setEmployeeNumber(response.data.empno); // Change the name here
      setCurrentStage(response.data.currentStage);

      // Access the nominated value from the data array
      const nominatedValue = response.data.data[0].nominated;
      setNominated(nominatedValue);

      //Access the accepted value from the data array
      const acceptedValue = response.data.data[0].accepted
      setAccepted(acceptedValue);

      const positionIdValue = response.data.data[0].positionId
      setPositionId(positionIdValue);
      
      // Store the code in local storage
      localStorage.setItem('code', response.data.code);
      localStorage.setItem('empno', response.data.empno);
      localStorage.setItem('currentStage', response.data.currentStage);
      localStorage.setItem('nominated', nominatedValue);
      localStorage.setItem('accepted', acceptedValue);
      localStorage.setItem('positionId', positionIdValue);

      return true; // Authentication success
    } catch (error) {
      console.error('Authentication Error:', error);
      return false; // Authentication failed
    }
  };

  // Function to handle logout
  const logout = () => {
    // Clear the code and employeeNumber from state and local storage
    setCode(null);
    setEmployeeNumber(null); // Change the name here
    setCurrentStage(null);
    setNominated(null);
    setAccepted(null);
    setPositionId(null);
    localStorage.removeItem('code');
    localStorage.removeItem('empno');
    localStorage.removeItem('currentStage')
    localStorage.removeItem('nominated');
    localStorage.removeItem('accepted');
    localStorage.removeItem('positionId');
    // Redirect to the home page
    router.push('/signinmember');
  };

  // Check for code and employeeNumber in local storage during initialization
useEffect(() => {
  const storedCode = localStorage.getItem('code');
  const storedEmployeeNumber = localStorage.getItem('empno');
  const storedCurrentStage = localStorage.getItem('currentStage');
  const storedNominated = localStorage.getItem('nominated');
  const storedAccepted = localStorage.getItem('accepted');
  const storedPositionId = localStorage.getItem('positionId');

  if (storedCode) {
    setCode(storedCode);
  }

  if (storedEmployeeNumber) {
    setEmployeeNumber(storedEmployeeNumber);
  }

  if (storedCurrentStage) {
    setCurrentStage(storedCurrentStage);
  }

  if (storedNominated) {
    setNominated(parseInt(storedNominated)); // Parse the value to ensure it's of the correct type
  }

  if (storedAccepted) {
    setAccepted(storedAccepted);
  }

  if (storedPositionId) {
    setPositionId(parseInt(storedPositionId)); // Parse the value to ensure it's of the correct type
  }
}, []);

// Function to reset authentication after inactivity
const resetAuthentication = () => {
  // Clear the code and employeeNumber from state and local storage
  setCode(null);
  setEmployeeNumber(null);
  setCurrentStage(null);
  setNominated(null);
  setAccepted(null);
  setPositionId(null);
  localStorage.removeItem('code');
  localStorage.removeItem('empno');
  localStorage.removeItem('currentStage');
  localStorage.removeItem('nominated');
  localStorage.removeItem('accepted');
  localStorage.removeItem('positionId');
  // Redirect to the home page
  router.push('/signinmember');
};

useEffect(() => {
  const inactivityTimeout = setTimeout(() => {
    // Trigger automatic logout after 10 minutes of inactivity
    resetAuthentication();
  }, 1 * 60 * 1000); // 10 minutes in milliseconds

  console.log('Inactivity timeout set');


  // Reset the inactivity timeout on user activity
  const handleUserActivity = () => {
    clearTimeout(inactivityTimeout);
  };

  // Attach event listeners for user activity
  document.addEventListener('mousemove', handleUserActivity);
  document.addEventListener('keydown', handleUserActivity);

  return () => {
    clearTimeout(inactivityTimeout);
    document.removeEventListener('mousemove', handleUserActivity);
    document.removeEventListener('keydown', handleUserActivity);
  };
}, []); // Run only on component mount


  return (
    <NewAuthContext.Provider value={{ code, employeeNumber, currentStage, nominated, accepted, positionId, authenticate, logout }}> {/* Change the name here */}
      {children}
    </NewAuthContext.Provider>
  );
}

export function useNewAuth() {
  return useContext(NewAuthContext);
}
