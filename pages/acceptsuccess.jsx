import Image from 'next/image';
import React, { useEffect } from 'react';
import { runFireworks } from '@/confetti';
import { useRouter } from 'next/router';
import { Button } from '@/components/ui/button';
import { PartyPopper } from 'lucide-react';
import Link from 'next/link';

function AcceptSuccess() {
  const router = useRouter();

  useEffect(() => {
    runFireworks();
  }, []);

  const handleGoBackToHome = () => {
    // Reload the landingUser page immediately after navigating to it
    router.push('/landingUser').then(() => router.reload());
  };

  return (
    <div>
      <div className="flex flex-col items-center justify-center h-screen font-sora">
        <PartyPopper className="w-20 h-20" />
        <h1 className="text-4xl font-bold">Hooray!!</h1>
        <p className="text-lg text-[black]">You have successfully accepted your nomination</p>
        <Button onClick={handleGoBackToHome} className="mt-5">
          Go back to Home
        </Button>
      </div>
    </div>
  );
}

export default AcceptSuccess;
