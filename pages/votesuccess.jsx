import Image from 'next/image'
import React, { useEffect } from 'react'
import { runFireworks } from '@/confetti';
import { useRouter } from 'next/router';
import { Button } from '@/components/ui/button';
import { PartyPopper } from 'lucide-react';

function VoteSuccess() {
  const router = useRouter();

  useEffect(() => {
    runFireworks();
  }, [])
  

  return (
    <div>
        <div class="flex flex-col items-center justify-center h-screen font-sora">
        <PartyPopper className='w-20 h-20'/>
            <h1 className='text-4xl font-bold'>Hooray!!</h1>
            <p className='text-lg text-[black]'>You have successfully voted your candidate</p>
            <Button onClick={() => router.push('/seecampaigns') } className="mt-5">
                Continue to see more campaigns
            </Button>        
        </div>
    </div>
  )
}

export default VoteSuccess