import MemberNavbar from '@/components/MemberNavbar'
import React from 'react'
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

function LandingCampaign() {
  return (
    <div>
        <MemberNavbar />

        <div class="flex items-center justify-center h-screen">

            <div className=' max-w-6xl mx-auto flex space-x-8'>
                <h1></h1>
                <Card className="w-[350px]">
                    <CardHeader>
                        <CardTitle className="mb-3">Create your Campaign</CardTitle>
                        <CardDescription>This will navigate you to the page where you will create a campaign that will be seen by other members.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Link className='border p-2.5 rounded-md bg-[#2187C0] text-white' href='/campaign'>Create Campaign</Link>
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