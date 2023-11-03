import MemberNavbar from '@/components/MemberNavbar'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea';
import Link from 'next/link';
import React, { useState } from 'react'
import { cn } from "@/lib/utils"
import { Button, buttonVariants } from "@/components/ui/button"
import { ChevronLeft, Loader2, LogInIcon } from 'lucide-react'

function Contact() {
    const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [text, setText] = useState('');

//   const { login, user } = useAuth(); // Access the user object from AuthContext
//   const router = useRouter();
  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await login(email, password); // No need to capture the response here
      router.push('/admin'); // Redirect to the home page after successful login
    } catch (error) {
      console.error('Login failed', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
        {/* <MemberNavbar /> */}

        <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <Link
        href="/signinmember"
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
        <img src="/logo.png" alt="Logo" className='w-20 h-20 object-contain' />
          {/* <Icons.logo className="mx-auto h-6 w-6" /> */}
          <h1 className="text-2xl font-semibold tracking-tight">
            Contact the IT team
          </h1>
          {/* <p className="text-sm text-muted-foreground">
            Enter your email
          </p> */}
        </div>
        <Input 
          type="email"
          name="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)} 
          placeholder="Enter your Email" 
        />
        <Textarea
            placeholder="Type your message here." 
        />
        {/* <Input 
          type="password"
          name="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)} 
          placeholder="Password" 
        /> */}
        <Button onClick={handleLogin} className="w-full bg-[#1E2C8A]" disabled={isLoading}>{isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <LogInIcon className='h-4 w-4 mr-2' />}Submit</Button>
        {/* <UserAuthForm /> */}
        {/* <p className="px-8 text-center text-sm text-muted-foreground">
          <Link
            href="#"
            className="hover:text-brand underline underline-offset-4"
          >
            Don&apos;t have an account? Sign Up
          </Link>
        </p> */}
      </div>
      You can reach out to us directly at: <b><a className='underline' href="mailto:l9lek325-smb@chevron.com">l9lek325-smb@chevron.com</a></b>

    </div>
    </div>
  )
}

export default Contact