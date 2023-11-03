import Link from 'next/link'
import React from 'react'
// import { Icons } from './Icons'
import { Button, buttonVariants } from '@/components/ui/button'
import { useAuth } from '@/services/AuthContext';
// import { getAuthSession } from '@/lib/auth'
// import UserAccountNav from './UserAccountNav'
import { Moon, Sun } from "lucide-react"

function NavLanding() {
//   const { user, logout } = useAuth();


//   const session = await getAuthSession()

  return (
    <div className='fixed top-0 inset-x-0 h-fit bg-zinc-100 border-b border-zinc-300 z-[10] py-2'>
        <div className='container max-w-7xl h-full mx-auto flex items-center justify-between gap-2'>
            {/* logo */}
            <Link href='/' className='flex gap-2 items-center'>
              {/* <Icons.logo className='h-8 w-8 sm:h-6 sm:w-6' /> */}
              {/* <p className=' text-zinc-700 text-sm font-medium'>
                CEMCS
              </p> */}
              <img src="/logo.png" alt="Logo" className='w-12 h-12 object-contain' />
            </Link>

            <div className='flex items-center space-x-8'>
                <Link href='/landing'>Home</Link>
                {/* <Link href='/upload'>Upload</Link>
                <Link href='/ballotresultspage'>Draw</Link> */}
                {/* <Link href='/signinmember' className={buttonVariants()} >Member SIgn In</Link>
                {user ? (
                <Button onClick={logout} >Log Out</Button>
                ) : (
                <Link href='/signin' className={buttonVariants()} >Sign In</Link>
                )} */}
            </div>
        </div>
    </div>
  )
}

export default NavLanding