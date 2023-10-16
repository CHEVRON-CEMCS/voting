import Link from 'next/link'
import React from 'react'
import { Button, buttonVariants } from '@/components/ui/button'
import { useAuth } from '@/services/AuthContext';
import { useNewAuth } from '@/services/NewAuthContext';
import { useRouter } from 'next/router';

function MemberNavbar() {
  const { logout } = useNewAuth();
  const { code } = useNewAuth();
  const router = useRouter()

  const handleLogout = () => {
    // Call the logout function from the AuthContext
    logout();
    
    // Redirect to the desired page after logout
    router.push('/'); // Replace 'desired-page' with the actual URL you want to go to
  };

  return (
    <div className='fixed top-0 inset-x-0 h-fit bg-zinc-100 border-b border-zinc-300 z-[10] py-2'>
      <div className='container max-w-7xl h-full mx-auto flex items-center justify-between gap-2'>
        {/* logo */}
        <Link href='/search' className='flex gap-2 items-center'>
          <p className='text-zinc-700 text-sm font-medium'>CEMCS</p>
        </Link>

        <div className='flex items-center space-x-8'>
          <Link href='/search'>Home</Link>
          <Link href='/campaign'>Create campaign</Link>
          <Link href='/seecampaigns'>See Campaigns</Link>
          {code ? (
            <Button onClick={handleLogout}>Log Out</Button>
            ) : (
            <Link href='/signinmember' className={buttonVariants()}>
              Member Sign In
            </Link>
          )}
          {/* {user ? ( 
            <Button onClick={handleLogout}>Log Out</Button>
          ) : (
            <Link href='/signinmember' className={buttonVariants()}>
              Sign In
            </Link>
          )} */}
        </div>
      </div>
    </div>
  );
}

export default MemberNavbar;
