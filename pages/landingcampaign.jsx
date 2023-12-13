import MemberNavbar from '@/components/MemberNavbar'
import React from 'react'
import { useEffect, useState } from 'react'; // Import useEffect and useState
import axios from 'axios'; // Import axios for making API requests
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import Link from 'next/link'
import { useNewAuth } from '@/services/NewAuthContext'
import { Drawer } from 'vaul';

function LandingCampaign() {

  const { employeeNumber, currentStage, code } = useNewAuth();
  const [open, setOpen] = useState(false);


  const [buttonText, setButtonText] = useState('Create Campaign'); // Initialize button text
  const [Links, setLinks] = useState('/campaign')
  const [currentStageData, setCurrentStageData] = useState(null);

  useEffect(() => {
    async function fetchCurrentStage() {
      try {
        const response = await axios.get('https://virtual.chevroncemcs.com/voting/stage/current', {
          headers: {
            Authorization: `Bearer ${code}`,
          },
        });
        setCurrentStageData(response.data.data.name);
        console.log('Current Stage Data:', response.data.data.name);
      } catch (error) {
        console.error('Error fetching current stage:', error);
      }
    }

    fetchCurrentStage();
  }, [code]); // Ensure to include the necessary dependencies in the dependency array

  useEffect(() => {
    // Make an API request to fetch the data
    axios.get('https://virtual.chevroncemcs.com/voting/campaign')
      .then((response) => {
        const campaignData = response.data.data;

        // Check if employeeNumber exists in the response empno
        const foundEmployee = campaignData.find(item => item.empno === employeeNumber);

        if (foundEmployee) {
          // Update the button text to "Update Campaign" if employeeNumber is found
          setButtonText('Update Campaign');
          setLinks('/updatecampaign');
        }
      })
      .catch((error) => {
        // Handle any errors here
        console.error('API request error:', error);
      });
  }, [employeeNumber]);


  return (
    <div>
      <MemberNavbar />

      <div className="flex items-center justify-center h-screen">
        <div className='max-w-6xl mx-auto flex md:flex-row flex-col space-y-5 md:space-y-0 md:space-x-8'>

          <div>
          <Drawer.Root dismissible={false} open={open}>
        <Drawer.Trigger data-testid="trigger" asChild onClick={() => setOpen(true)}>
          <button>Open Drawer</button>
        </Drawer.Trigger>
        <Drawer.Portal>
          <Drawer.Overlay className="fixed inset-0 bg-black/40" />
          <Drawer.Content
            data-testid="content"
            className="bg-zinc-100 flex flex-col rounded-t-[10px] mt-24 fixed bottom-0 left-0 right-0"
          >
            <div className="p-4 bg-white rounded-t-[10px] flex-1">
              <div className="mx-auto w-12 h-1.5 flex-shrink-0 rounded-full bg-zinc-300 mb-8" />
              <div className="max-w-md mx-auto">
                <Drawer.Title className="font-medium mb-4">Unstyled drawer for React.</Drawer.Title>
                <p className="text-zinc-600 mb-2">
                  This component can be used as a replacement for a Dialog on mobile and tablet devices.
                </p>
                <p className="text-zinc-600 mb-6">
                  It uses{' '}
                  <a
                    href="https://www.radix-ui.com/docs/primitives/components/dialog"
                    className="underline"
                    target="_blank"
                  >
                    Radix&rsquo;s Dialog primitive
                  </a>{' '}
                  under the hood and is inspired by{' '}
                  <a
                    href="https://twitter.com/devongovett/status/1674470185783402496"
                    className="underline"
                    target="_blank"
                  >
                    this tweet.
                  </a>
                </p>

                <button
                  type="button"
                  data-testid="dismiss-button"
                  onClick={() => setOpen(false)}
                  className="rounded-md mb-6 w-full bg-gray-900 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-gray-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-600"
                >
                  Click to close
                </button>
              </div>
            </div>
            <div className="p-4 bg-zinc-100 border-t border-zinc-200 mt-auto">
              <div className="flex gap-6 justify-end max-w-md mx-auto">
                <a
                  className="text-xs text-zinc-600 flex items-center gap-0.25"
                  href="https://github.com/emilkowalski/vaul"
                  target="_blank"
                >
                  GitHub
                  <svg
                    fill="none"
                    height="16"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    width="16"
                    aria-hidden="true"
                    className="w-3 h-3 ml-1"
                  >
                    <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"></path>
                    <path d="M15 3h6v6"></path>
                    <path d="M10 14L21 3"></path>
                  </svg>
                </a>
                <a
                  className="text-xs text-zinc-600 flex items-center gap-0.25"
                  href="https://twitter.com/emilkowalski_"
                  target="_blank"
                >
                  Twitter
                  <svg
                    fill="none"
                    height="16"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    width="16"
                    aria-hidden="true"
                    className="w-3 h-3 ml-1"
                  >
                    <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"></path>
                    <path d="M15 3h6v6"></path>
                    <path d="M10 14L21 3"></path>
                  </svg>
                </a>
              </div>
            </div>
          </Drawer.Content>
        </Drawer.Portal>
      </Drawer.Root>
          </div>
          
          <Card className="w-[350px]">
            <CardHeader>
              <CardTitle className="mb-3">Create your Campaign</CardTitle>
              <CardDescription>This will navigate you to the page where you will create a campaign that will be seen by other members.</CardDescription>
            </CardHeader>
            <CardContent>
              {/* Use the buttonText state variable for the button text */}
              {currentStageData === 'Voting' || currentStageData === 'Nomination' ? (
                <Button className='border p-2.5 rounded-md bg-[#2187C0] text-white' disabled>{buttonText}</Button>
              ) : (
                <Link className='border p-2.5 rounded-md bg-[#2187C0] text-white' href={Links}>{buttonText}</Link>
              ) }
            </CardContent>
          </Card>

          <Card className="w-[350px]">
            <CardHeader>
              <CardTitle className="mb-3">View Campaigns</CardTitle>
              <CardDescription>This will navigate you to the page where you can view the campaign of everyone.</CardDescription>
            </CardHeader>
            <CardContent>
              <Link className='border p-2.5 rounded-md bg-[#2187C0] text-white' href='/seecampaigns'>View Campaigns</Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default LandingCampaign