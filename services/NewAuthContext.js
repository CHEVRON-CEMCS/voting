import { createContext, useContext, useState, useEffect } from 'react';
import axios from "axios"
import { useRouter } from 'next/router';

const NewAuthContext = createContext();

export function NewAuthProvider({ children }) {
  const [code, setCode] = useState(null);
  const [employeeNumber, setEmployeeNumber] = useState(null); // Change the name here
  const [currentStage, setCurrentStage] = useState(null);
  const [nominated, setNominated] = useState(null);

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
      
      // Store the code in local storage
      localStorage.setItem('code', response.data.code);
      localStorage.setItem('empno', response.data.empno);
      localStorage.setItem('currentStage', response.data.currentStage);
      localStorage.setItem('Nominated', nominatedValue);


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
    setCurrentStage(null)
    setNominated(null)
    localStorage.removeItem('code');
    localStorage.removeItem('empno');
    localStorage.removeItem('currentStage')
    localStorage.removeItem('nominated')
    // Redirect to the home page
    router.push('/signinmember');
  };

  // Check for code and employeeNumber in local storage during initialization
useEffect(() => {
  const storedCode = localStorage.getItem('code');
  const storedEmployeeNumber = localStorage.getItem('empno');
  const storedCurrentStage = localStorage.getItem('currentStage');
  const storedNominated = localStorage.getItem('nominated');


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
    setNominated(storedNominated);
  }
}, []);


  return (
    <NewAuthContext.Provider value={{ code, employeeNumber, currentStage, nominated, authenticate, logout }}> {/* Change the name here */}
      {children}
    </NewAuthContext.Provider>
  );
}

export function useNewAuth() {
  return useContext(NewAuthContext);
}
