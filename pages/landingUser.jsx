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
import { useNewAuth } from '@/services/NewAuthContext'

function LandingUser() {

    const { code, employeeNumber, currentStage } = useNewAuth();

    console.log(code)

  return (
    <div>
        <MemberNavbar />

        <div class="flex items-center justify-center h-screen">

            <div className=' max-w-6xl mx-auto flex space-x-8'>
                <h1></h1>
                <Card className="w-[350px]">
                    <CardHeader>
                        <CardTitle className="mb-3">Nomination Stage</CardTitle>
                        <CardDescription>This will navigate you to the Nomination stage where you can nominate your candidates</CardDescription>
                    </CardHeader>
                    <CardContent>
                    <Link className='border p-2.5 rounded-md bg-[#2187C0] text-white' href='/viewnomsearch'>Go to Nomination</Link>
                    {/* {currentStage === 'Campaign' ? (
                        <Link className='border p-2.5 rounded-md bg-[#2187C0] text-white' href='/viewnomsearch'>Go to Nomination</Link>
                    ) : (
                        <Button disabled={true} className='border p-2.5 rounded-md bg-[#2187C0] text-white' href='/viewnomsearch'>Go to Nomination</Button>
                    )
} */}
                    </CardContent>
                </Card>

                <Card className="w-[350px]">
                    <CardHeader>
                        <CardTitle className="mb-3">Campaign Stage</CardTitle>
                        <CardDescription>This will navigate you to the Nomination stage where you can nominate your candidates</CardDescription>
                    </CardHeader>
                    <CardContent>
                    <Link className='border p-2.5 rounded-md bg-[#2187C0] text-white' href='/landingcampaign'>Go to Campaign</Link>
                    </CardContent>
                </Card>

                <Card className="w-[350px]">
                    <CardHeader>
                        <CardTitle className="mb-3">Voting Stage</CardTitle>
                        <CardDescription>This will navigate you to the Nomination stage where you can nominate your candidates</CardDescription>
                    </CardHeader>
                    <CardContent>
                    <Link className='border p-2.5 rounded-md bg-[#2187C0] text-white' href='/multiplecampaigns'>Go to Voting</Link>
                    </CardContent>
                </Card>
            </div>
        </div>
    </div>
  )
}

export default LandingUser