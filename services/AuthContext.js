import { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/router';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState({ email: null, token: null, super: null });
  const router = useRouter();

  useEffect(() => {
    // Check if the user is authenticated using a token stored in cookies or localStorage
    const token = localStorage.getItem('token');
    const email = localStorage.getItem('email');
    const superToken = localStorage.getItem('super');

    if (token && email && superToken) {
      // You can also validate the token on the server for added security
      setUser({ email, token, superToken });
    }
  }, []);

  const login = async (email, password) => {
    // Make a POST request to your authentication API
    const response = await fetch('https://virtual.chevroncemcs.com/voting/adminLogin', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    console.log('Response status:', response.status);

    if (response.ok) {
      const data = await response.json();
      if (data && data.token) {
        console.log('Login successful. Token:', data);
        console.log('Login successful. Token:', data.token);
        setUser({ email, token: data.token, superToken: data.data.super });
        localStorage.setItem('token', data.token);
        localStorage.setItem('email', email); // Store the email
        localStorage.setItem('super', data.data.super);
      } else {
        console.error('Token not found in response');
        throw new Error('Authentication failed');
      }
    } else {
      console.error('Authentication failed');
      throw new Error('Authentication failed');
    }
  };

  const logout = () => {
    // Remove the token from localStorage and reset the user state
    localStorage.removeItem('token');
    localStorage.removeItem('email'); // Remove the email
    localStorage.removeItem('super');
    setUser({ email: null, token: null, superToken: null });

    // Redirect to the home page
    router.push('/signin');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider> 
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
