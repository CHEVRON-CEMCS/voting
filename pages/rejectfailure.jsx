import Image from 'next/image'
import React, { useEffect } from 'react'
import { runFireworks } from '@/confetti';
import { useRouter } from 'next/router';
import { Button } from '@/components/ui/button';
import { PartyPopper, XCircle } from 'lucide-react';
import Link from 'next/link';

function RejectFailure() {
  const router = useRouter();

//   useEffect(() => {
//     runFireworks();
//   }, [])
  

  return (
    <div>
        <div class="flex flex-col items-center justify-center h-screen font-sora">
        <XCircle className='w-20 h-20'/>
            <h1 className='text-4xl font-bold'>You have declined your nomination</h1>
            {/* <p className='text-lg text-[black]'>You have successfully accepted your nomination</p> */}
            <Link href="/landingUser" className='bg-[#2187C0] pt-2 pb-2 pl-5 pr-5 rounded-xl text-white mt-5'>
                Go back to Home
            </Link>        
        </div>
    </div>
  )
}

export default RejectFailure