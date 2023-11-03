import Link from 'next/link'
import React, { useState } from 'react'
import { Button, buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Input } from '@/components/ui/input'
import { ChevronLeft, Loader2, LogInIcon, PartyPopper } from 'lucide-react'
import { useAuth } from '@/services/AuthContext';
import { useRouter } from 'next/router'
import axios from 'axios'
import { useToast } from '@/components/ui/use-toast';

function Signin() {
  const [isLoading, setIsLoading] = useState(false);
  const [employee, setEmployee] = useState('');
  const {user} = useAuth();
  const { toast } = useToast();
  const router = useRouter()


  const handleSignIn = async () => {
    setIsLoading(true);
  
    try {
      const apiUrl = 'https://virtual.chevroncemcs.com/voting/voter/email';
      const requestBody = {
        empno: employee, // Use the value from the input field
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

      // Redirect the user to another page (replace '/your-target-page' with the actual route)
      router.push({
        pathname: '/otppage', // Replace with the actual route of otppage
        query: { empno: employee }, // Pass empno as a query parameter
      });
  
      // Handle the response here, e.g., update the UI or redirect to another page.
    } catch (error) {
      console.error('Error:', error);
      // Handle error
    } finally {
      setIsLoading(false);
    }
  };
  

  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <Link
        href="/"
        className={cn(
          buttonVariants({ variant: "ghost" }),
          "absolute left-4 top-4 md:left-8 md:top-8"
        )}
      >
        <>
          <ChevronLeft className='mr-2 h-4 w-4'/>
          {/* <Icons.chevronLeft className="mr-2 h-4 w-4" /> */}
          Back
        </>
      </Link>
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <div className="flex flex-col space-y-2 justify-center items-center">
          {/* <Icons.logo className="mx-auto h-6 w-6" /> */}
          <img src="/logo.png" alt="Logo" className='w-20 h-20 object-contain' />
          <h1 className="text-2xl font-semibold tracking-tight flex justify-center items-center space-x-5">
            Welcome!!
            <PartyPopper className='ml-1 h-8 w-8'/>
          </h1>
          <p className="text-sm text-muted-foreground">
            Enter your employee number to sign in to your account
          </p>
        </div>
        <Input 
          type="text"
          name="text"
          id="text"
          value={employee}
          onChange={(e) => setEmployee(e.target.value)} 
          placeholder="Enter your Employee Number" 
        />
        
        <Button className="w-full bg-[#2187C0]" onClick={handleSignIn} disabled={isLoading}>{isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <LogInIcon className='h-4 w-4 mr-2' />}Sign In</Button>
        {/* <UserAuthForm /> */}
        <p className="px-8 text-center text-sm text-muted-foreground">
          <Link
            href="/contact"
            className="hover:text-brand underline underline-offset-4 font-bold"
          >
            Having troubles logging in? Click Here          
          </Link>
        </p>
      </div>
    </div>
  )
}

export default Signin