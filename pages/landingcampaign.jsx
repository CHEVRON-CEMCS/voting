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

  const { employeeNumber, currentStage, code, accepted, canLogin, message } = useNewAuth();
  const [open, setOpen] = useState(false);


  const [buttonText, setButtonText] = useState('Create Campaign'); // Initialize button text
  const [Links, setLinks] = useState('/campaign')
  const [currentStageData, setCurrentStageData] = useState(null);

  console.log('accept:', accepted);

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
          setLinks('/updateCampaignMessage');
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

      {canLogin === 0 ? (
                <div>
                    <MemberNavbar />
                <div className="flex items-center justify-center h-screen mx-auto font-extrabold font-sora text-red-500 text-center w-10/12">
                  <h1 className='text-lg lg:text-2xl'>{message}</h1>
                </div>
              </div>
            ):(

      <div className="flex items-center justify-center h-screen">
        <div className='max-w-6xl mx-auto flex md:flex-row flex-col space-y-5 md:space-y-0 md:space-x-8'>
          
          <Card className="w-[350px]">
            <CardHeader>
              <CardTitle className="mb-3">Create your Campaign</CardTitle>
              <CardDescription>This will navigate you to the page where you will create a campaign that will be seen by other members.</CardDescription>
            </CardHeader>
            <CardContent>
              {/* Use the buttonText state variable for the button text */}
              {currentStageData === '' || currentStageData === 'Nomination' || accepted === "0" ? (
                <Button className='border p-2.5 rounded-md bg-[#2187C0] text-white' disabled>{buttonText}</Button>
              ) : (
                // <Link className='border p-2.5 rounded-md bg-[#2187C0] text-white' href={Links}>{buttonText}</Link>
                <Button className='border p-2.5 rounded-md bg-[#2187C0] text-white' disabled>{buttonText}</Button>
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
            )}
    </div>
  )
}

export default LandingCampaign