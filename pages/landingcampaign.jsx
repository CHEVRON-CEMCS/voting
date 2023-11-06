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


function LandingCampaign() {

  const { employeeNumber } = useNewAuth();

  const [buttonText, setButtonText] = useState('Create Campaign'); // Initialize button text

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
        <div className='max-w-6xl mx-auto flex space-x-8'>
          <h1></h1>
          <Card className="w-[350px]">
            <CardHeader>
              <CardTitle className="mb-3">Create your Campaign</CardTitle>
              <CardDescription>This will navigate you to the page where you will create a campaign that will be seen by other members.</CardDescription>
            </CardHeader>
            <CardContent>
              {/* Use the buttonText state variable for the button text */}
              <Link className='border p-2.5 rounded-md bg-[#2187C0] text-white' href='/updatecampaign'>{buttonText}</Link>
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