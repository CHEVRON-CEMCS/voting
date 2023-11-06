import MemberNavbar from '@/components/MemberNavbar'
import React, { useState } from 'react'
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
import CountdownTimer from '@/components/CountdownTimer'

function LandingUser() {
    const { code, employeeNumber, currentStage } = useNewAuth();

    const [link, setLink] = useState(false);

    const targetDate = new Date('2023-12-31T23:59:59').getTime(); // Replace with your target date

    console.log(code)

    return (
        <div>
            <MemberNavbar />

            <div className="flex flex-col items-center justify-center h-screen">
                {currentStage === 'Nomination' ? (
                        <div>
                            <h1 className='mb-5 font-bold text-4xl text-center'>This is the Nomination stage</h1>
                            <div className='flex flex-col justify-center pb-2 mt-3 max-w-6xl mx-auto mb-3 bg-[#1E2C8A]'>
                                <p className='p-5 text-white'>
                                    In this stage members only have access to the Nomination section.
                                    You cannot go to the campaign stage and the voting stage.
                                </p>
                            </div>
                        </div>
                    ) : currentStage === 'Campaign' ? (
                        <div>
                            <h1 className='mb-5 font-bold text-4xl text-center'>This is the Campaign stage</h1>
                            <div className='flex flex-col justify-center pb-2 mt-3 max-w-6xl mx-auto mb-3 bg-[#1E2C8A]'>
                                <p className='p-5 text-white'>
                                    In this stage members only have access to the Campaign section.
                                    You cannot go to the Nomination stage and the voting stage.                                
                                </p>
                            </div>
                        </div>
                    ) : currentStage === 'Voting' ? (
                        <div>
                            <h1 className='mb-5 font-bold text-4xl text-center'>This is the Voting stage</h1>
                            <div className='flex flex-col justify-center pb-2 mt-3 max-w-6xl mx-auto mb-3 bg-[#1E2C8A]'>
                                <p className='p-5 text-white'>
                                    In this stage members only have access to the Voting section.
                                    You cannot go to the Nomination stage and the Campaign stage.                                 </p>
                            </div>
                        </div>
                    ) : currentStage === 'Voting Ended Stage' ? (
                        <div>
                            <h1 className='mb-5 font-bold text-4xl text-center'>This is the election has successfully come to an end.</h1>
                            <div className='flex flex-col justify-center pb-2 mt-3 max-w-6xl mx-auto mb-3 bg-[#1E2C8A]'>
                                <p className='p-5 text-white'>
                                    YOu do not have access to any of the stages.
                                </p>
                            </div>
                        </div>
                    ) :
                        null
                    }

                    <div className='mb-3'>
                        {/* <CountdownTimer targetDate={targetDate} />
                        <h1 className='font-bold text-xl'>
                            The election will commence soon
                        </h1> */}
                    </div>
                        

                <div className="max-w-6xl mx-auto flex space-x-8">


                    <Card className="w-[350px]">
                        <CardHeader>
                            <CardTitle className="mb-3">Nomination Stage</CardTitle>
                            {/* <CountdownTimer targetDate={targetDate} /> */}
                            <CardDescription>This will navigate you to the Nomination stage where you can nominate your candidates</CardDescription>
                        </CardHeader>
                        <CardContent>
                        {currentStage === 'Nomination' ? (
                                <Link className='border p-2.5 rounded-md bg-[#2187C0] text-white' href='/viewnomsearch'>Go to Nomination</Link>
                            ) : (
                                <Button className='border p-2.5 rounded-md bg-[#2187C0] text-white' disabled>Go to Nomination</Button>
                        )}
                        </CardContent>
                    </Card>

                    <Card className="w-[350px]">
                        <CardHeader>
                            <CardTitle className="mb-3">Campaign Stage</CardTitle>
                            <CardDescription>This will navigate you to the Campaign stage where you can start your campaign</CardDescription>
                        </CardHeader>
                        <CardContent>
                        {currentStage === 'Campaign' ? (
                                <Link className='border p-2.5 rounded-md bg-[#2187C0] text-white' href='/landingcampaign'>Go to Campaign</Link>
                            ) : (
                                <Button className='border p-2.5 rounded-md bg-[#2187C0] text-white' disabled>Go to Campaign</Button>
                            )}
                        </CardContent>
                    </Card>

                    <Card className="w-[350px]">
                        <CardHeader>
                            <CardTitle className="mb-3">Voting Stage</CardTitle>
                            <CardDescription>This will navigate you to the Voting stage where you can cast your vote</CardDescription>
                        </CardHeader>
                        <CardContent>
                        {currentStage === 'Voting' ? (
                                <Link className='border p-2.5 rounded-md bg-[#2187C0] text-white' href='/multiplecampaigns'>Go to Voting</Link>
                            ) : (
                                <Button className='border p-2.5 rounded-md bg-[#2187C0] text-white' disabled>Go to Voting</Button>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}

export default LandingUser;
