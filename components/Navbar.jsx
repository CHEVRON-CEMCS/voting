import Link from 'next/link'
import React from 'react'
// import { Icons } from './Icons'
import { Button, buttonVariants } from '@/components/ui/button'
import { useAuth } from '@/services/AuthContext';
// import { getAuthSession } from '@/lib/auth'
// import UserAccountNav from './UserAccountNav'
import { Moon, Sun } from "lucide-react"

function Navbar() {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    // Call the logout function from the AuthContext
    logout();
    
    // Redirect to the desired page after logout
    router.push('/'); // Replace 'desired-page' with the actual URL you want to go to
  };


//   const session = await getAuthSession()

  return (
    <div className='fixed top-0 inset-x-0 h-fit bg-zinc-100 border-b border-zinc-300 z-[10] py-2'>
        <div className='container max-w-7xl h-full mx-auto flex items-center justify-between gap-2'>
            {/* logo */}
            <Link href='/admin' className='flex gap-2 items-center'>
              {/* <Icons.logo className='h-8 w-8 sm:h-6 sm:w-6' /> */}
              <p className=' text-zinc-700 text-sm font-medium'>
                CEMCS
              </p>
            </Link>

            <div className='flex items-center space-x-8'>
                <Link href='/admin'>Home</Link>
                <Link href='/upload'>Upload Candidates</Link>
                <Link href='/nominations'>See Nominations</Link>
                <Link href='/seevotes'>Votes</Link>

                {/* <Link href='/upload'>Upload</Link>
                <Link href='/ballotresultspage'>Draw</Link> */}
                {/* <Link href='/signinmember' className={buttonVariants()} >Member SIgn In</Link> */}
                {user ? (
                <Button onClick={handleLogout} >Log Out</Button>
                ) : (
                <Link href='/signin' className={buttonVariants()} >Sign In</Link>
                )}
            </div>
        </div>
    </div>
  )
}

export default Navbar