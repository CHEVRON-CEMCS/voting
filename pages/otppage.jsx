import OtpInput from '@/components/misc/OtpInput';
import { Button } from '@/components/ui/button';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import { useToast } from '@/components/ui/use-toast';
import { useNewAuth } from '@/services/NewAuthContext';
import { Loader2, LogInIcon } from 'lucide-react';

function Otppage() {
  const [otpValue, setOtpValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [shouldRedirect, setShouldRedirect] = useState(false); // New state for redirection
  const router = useRouter();
  const { toast } = useToast();
  const { empno } = router.query;
  const { code, authenticate } = useNewAuth();

  const handleSubmit = async () => {
    setIsLoading(true);

    const isAuthenticated = await authenticate(empno, otpValue);

    if (isAuthenticated) {
      // Handle successful authentication here
      toast({
        title: 'Success!!',
        description: 'You have successfully logged in',
      });
      setShouldRedirect(true); // Trigger redirection on success
    } else {
      // Handle authentication failure here
      console.error('Authentication failed');
      toast({
        title: 'Uh oh! Something went wrong.',
        variant: 'destructive',
        description: 'There was a problem logging you in.',
      });
      setIsLoading(false);
    }
  };

  const handleSignIn = async () => {
    setIsLoading(true);
  
    try {
      const apiUrl = 'https://virtual.chevroncemcs.com/voting/voter/email';
      const requestBody = {
        empno: empno, // Use the value from the input field
      };
  
      const response = await axios.post(apiUrl, requestBody, {
        headers: {
          Authorization: 'Bearer YOUR_ACCESS_TOKEN_HERE', // Replace with your access token
        },
      });
  
      console.log('Response:', response.data);
      toast({
        title: 'Success!!',
        description: "Your code has been sent to your email successfully!",
      });
  
      // Handle the response here, e.g., update the UI or redirect to another page.
    } catch (error) {
      console.error('Error:', error);
      // Handle error
    } finally {
      setIsLoading(false);
    }
  };

  // Use useEffect to redirect when shouldRedirect changes
  useEffect(() => {
    if (shouldRedirect) {
      router.push('/landingUser'); // Redirect to /search
    }
  }, [shouldRedirect, router]);

  return (
    <div className='max-w-6xl mx-auto'>
      <div className="flex flex-col items-center justify-center h-screen">
        <img src="/logo.png" alt="Logo" className='w-20 h-20 object-contain' />
        <h1 className='text-xl font-bold'>Enter your Code</h1>
        <div className='flex flex-col justify-center pb-2 p-2 mt-5 max-w-6xl mx-auto mb-1 bg-[#1E2C8A]'>
        <p className='text-sm font-medium text-white text-center'>Visit your email to get your code</p>
        <p className='text-sm font-medium  text-white text-center'>NOTE: Check your Junk mail folder</p>
        </div>
        
        <OtpInput
          autoFocus
          isNumberInput
          inputLength={6}
          onChangeOtp={(otp) => setOtpValue(otp)}
        />
        <Button className="mt-5 px-7 bg-[#2187C0]" onClick={handleSubmit} disabled={isLoading}>
          {isLoading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <LogInIcon className='h-4 w-4 mr-2' />
          )}
          Submit
        </Button>
        <p className="mt-4 text-xs font-normal text-center text-gray-500">
          Did not get a code?{' '}
          <button className="text-primary" onClick={handleSignIn}>click to resend</button>
        </p>
      </div>
    </div>
  );
}

export default Otppage;
