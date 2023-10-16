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

  // Use useEffect to redirect when shouldRedirect changes
  useEffect(() => {
    if (shouldRedirect) {
      router.push('/search'); // Redirect to /search
    }
  }, [shouldRedirect, router]);

  return (
    <div className='max-w-6xl mx-auto'>
      <div className="flex flex-col items-center justify-center h-screen">
        <h1 className='text-xl font-bold'>Enter your Code</h1>
        <p className='text-sm font-medium'>Visit your email to get your code</p>
        <OtpInput
          autoFocus
          isNumberInput
          inputLength={6}
          onChangeOtp={(otp) => setOtpValue(otp)}
        />
        <Button className="mt-5 px-7" onClick={handleSubmit} disabled={isLoading}>
          {isLoading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <LogInIcon className='h-4 w-4 mr-2' />
          )}
          Submit
        </Button>
        <p className="mt-4 text-xs font-normal text-center text-gray-500">
          Did not get a code?{' '}
          <button className="text-primary">click to resend</button>
        </p>
      </div>
    </div>
  );
}

export default Otppage;
