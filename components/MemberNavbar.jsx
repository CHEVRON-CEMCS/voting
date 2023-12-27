import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { Button, buttonVariants } from '@/components/ui/button';
import { useNewAuth } from '@/services/NewAuthContext';
import { useRouter } from 'next/router';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { User } from 'lucide-react';
import logo from '@/public/logo.png'

// ... (previous imports and code)

function MemberNavbar() {
  const { logout, employeeNumber, code, nominated, name } = useNewAuth();
  const [showUpdateCampaignLink, setShowUpdateCampaignLink] = useState(false);
  // State to track whether the screen size is mobile or not
  const [isMobile, setIsMobile] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Check the screen size on component mount
    setIsMobile(window.innerWidth <= 768);

    // Add event listener to check screen size on window resize
    const handleResize = () => {
        setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener('resize', handleResize);

    // Remove the event listener when the component is unmounted
    return () => {
        window.removeEventListener('resize', handleResize);
    };
}, []);

  useEffect(() => {
    const fetchCampaignData = async () => {
      try {
        const apiUrl = 'https://virtual.chevroncemcs.com/voting/campaign';

        const response = await fetch(apiUrl, {
          method: 'GET',
          headers: {
            Authorization: 'YourAuthorizationTokenHere',
          },
        });

        if (response.ok) {
          const data = await response.json();
          const isEmployeeInResponse = data.data.some(item => item.empno === employeeNumber);
          setShowUpdateCampaignLink(isEmployeeInResponse);
        } else {
          console.error('Failed to fetch campaign data');
        }
      } catch (error) {
        console.error('Error fetching campaign data', error);
      }
    };

    if (employeeNumber) {
      fetchCampaignData();
    }
  }, [employeeNumber]);

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  return (
    <div className='fixed top-0 bg-zinc-100 w-full border-b border-zinc-300 z-[10] py-2'>
      <div className='container max-w-7xl h-full mx-auto flex items-center justify-between gap-2'>
        <Link href='/landingUser' className='flex gap-2 items-center'>
          {/* <p className='text-zinc-700 text-sm font-medium'>CEMCS</p> */}
          <img src="/logo.png" alt="Logo" className='w-12 h-12 object-contain' />
        </Link>

        <div className='flex items-center space-x-4'>
          {isMobile ? (
            null
          ):(
            <Link href='/landingUser'>Home</Link>
          )}
          <div className='hidden'>
            {nominated === 0 ? null : <Link href='/campaign'>Create campaign</Link>}
            <Link href='/seecampaigns'>See Campaigns</Link>
            <Link href='/multiplecampaigns'>Vote Multiple Candidates</Link>
            {showUpdateCampaignLink && <Link href='/updatecampaign'>Update Campaign</Link>}
          </div>
          
          <p className='text-sm md:text-base'>Welcome!, {name}</p>

          {isMobile ? (
              <DropdownMenu>
              <DropdownMenuTrigger>
                <Avatar className="border border-black">
                <AvatarImage src="" className="w-6 h-6" />
                  <AvatarFallback><User className='w-6 h-6' /></AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Link href='/landingUser'>Home</Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  {code ? (
                    <button className="" onClick={handleLogout}>Log Out</button>
                  ) : (
                    <Link href='/signinmember' className={buttonVariants()}>
                      Member Sign In
                    </Link>
                  )}
          </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ): (
             <>
              {code ? (
            <Button className="bg-[#2187C0]" onClick={handleLogout}>Log Out</Button>
          ) : (
            <Link href='/signinmember' className={buttonVariants()}>
              Member Sign In
            </Link>
          )}
             </>
          )}

          
        </div>
      </div>
    </div>
  );
}

export default MemberNavbar;
