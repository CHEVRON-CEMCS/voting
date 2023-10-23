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

function MemberNavbar() {
  const { logout, employeeNumber, code } = useNewAuth();
  const [showUpdateCampaignLink, setShowUpdateCampaignLink] = useState(false);
  const router = useRouter();

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
    <div className='fixed top-0 inset-x-0 h-fit bg-zinc-100 border-b border-zinc-300 z-[10] py-2'>
      <div className='container max-w-7xl h-full mx-auto flex items-center justify-between gap-2'>
        <Link href='/search' className='flex gap-2 items-center'>
          <p className='text-zinc-700 text-sm font-medium'>CEMCS</p>
        </Link>

        <div className='flex items-center space-x-8'>
          <Link href='/search'>Home</Link>
          <Link href='/campaign'>Create campaign</Link>
          <Link href='/seecampaigns'>See Campaigns</Link>
          <Link href='/multiplecampaigns'>Vote Multiple Candidates</Link>
          {showUpdateCampaignLink && <Link href='/updatecampaign'>Update Campaign</Link>}
          {code ? (
            <Button onClick={handleLogout}>Log Out</Button>
          ) : (
            <Link href='/signinmember' className={buttonVariants()}>
              Member Sign In
            </Link>
          )}

          <DropdownMenu>
            <DropdownMenuTrigger>
              <Avatar>
                <AvatarImage src="https://github.com/shadcn.png" />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem><Link href='/viewvotes'>View Votes</Link></DropdownMenuItem>
              <DropdownMenuItem><Link href='/viewnominations'>View Nominations</Link></DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
}

export default MemberNavbar;
