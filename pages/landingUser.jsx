import MemberNavbar from '@/components/MemberNavbar'
import React, { useEffect, useState } from 'react'
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
import { Dialog } from '@headlessui/react'
import axios from 'axios'
import { useRouter } from 'next/router'
import { Loader2 } from 'lucide-react'

function LandingUser() {
    const { code, employeeNumber, currentStage, nominated, accepted, positionId } = useNewAuth();
    const [isOpen, setIsOpen] = useState(false);
    const [isloading, setIsLoading] = useState(false);
    const [loading, IssLoading] = useState(false);
    const [acceptedState, setAccepted] = useState(accepted);
    const [positions, setPositions] = useState([]);

    console.log('Position', positionId);

    const router = useRouter();

    useEffect(() => {
        async function fetchPositions() {
          try {
            const response = await axios.get('https://virtual.chevroncemcs.com/voting/position', {
              headers: {
                Authorization: `Bearer ${code}`,
              },
            });
            setPositions(response.data.data); // Assuming the response is an array of positions
            console.log(response.data.data);
          } catch (error) {
            console.error('Error fetching positions:', error);
          }
        }
    
        fetchPositions();
      }, [code]); // Ensure to include the necessary dependencies in the dependency array
    
      const nominatedPosition = positions.find(pos => pos.id === positionId);
const nominatedPositionName = nominatedPosition ? nominatedPosition.name : 'Position Not Found';


    const openModal = () => {
        setIsOpen(true);
    };

    const closeModal = () => {
        setIsOpen(false);
    };

    // Check if nominated is 1, then show the modal
    useEffect(() => {
        if (nominated === 1) {
            setIsOpen(true);
        }
    }, [nominated]);

    // Check if accepted is "1", then remove the modal
    useEffect(() => {
        if (accepted === "1") {
            setIsOpen(false);
        }
    }, [accepted]);

    // Check if accepted is "2", then remove the modal
    useEffect(() => {
        if (accepted === "2") {
            setIsOpen(false);
        }
    }, [accepted]);

    console.log(code)
    console.log('nominate', nominated)
    console.log('accepted', accepted);

    const handleAccept = async () => {
        try {
            setIsLoading(true); // Set loading state to true on request start

            // Make the API request to accept the nomination
            const apiUrl = 'https://virtual.chevroncemcs.com/voting/acceptrequest';

            const requestBody = {
                empno: employeeNumber, // Assuming the employee number is to be used from the context
            };

            const response = await axios.post(apiUrl, requestBody, {
                headers: {
                    Authorization: `Bearer ${code}`, // Replace with your actual access token
                },
            });

            // Handle the response as needed
            console.log('Accept request response:', response.data);

            // Close the modal or update state as required
            setAccepted('1');
            localStorage.setItem('accepted', '1');
            setIsOpen(false);
            router.push('/acceptsuccess');
        } catch (error) {
            // Handle errors appropriately
            console.error('Accept request error:', error);
        } finally {
            setIsLoading(false); // Reset loading state to false on request completion
        }
    };

    const handleReject = async () => {
        try {
            IssLoading(true); // Set loading state to true on request start
            // Make the API request to accept the nomination
            const apiUrl = 'https://virtual.chevroncemcs.com/voting/declinerequest';

            const requestBody = {
                empno: employeeNumber, // Assuming the employee number is to be used from the context
            };

            const response = await axios.post(apiUrl, requestBody, {
                headers: {
                    Authorization: `Bearer ${code}`, // Replace with your actual access token
                },
            });

            // Handle the response as needed
            console.log('Reject request response:', response.data);
            setAccepted('2');
            localStorage.setItem('accepted', '2');
            // Close the modal or update state as required
            router.push('/rejectfailure');
        } catch (error) {
            // Handle errors appropriately
            console.error('Reject request error:', error);
        } finally {
            IssLoading(false); // Reset loading state to false on request completion
        }
    };

    return (
        <div>
            <MemberNavbar />

            <div className="flex flex-col items-center justify-center h-screen">

            {isOpen && (
                <Dialog
                open={isOpen} 
                onClose={closeModal}
                className="relative z-50"
            >
                {/* The backdrop, rendered as a fixed sibling to the panel container */}
                <div className="fixed inset-0 bg-black/30 backdrop-blur-md" aria-hidden="true" />

                {/* Full-screen container to center the panel */}
                <div className="fixed inset-0 flex w-screen items-center justify-center p-4">
                    {/* The actual dialog panel  */}
                    <Dialog.Panel className="mx-auto max-w-xl w-[50rem] h-44 rounded bg-white">
                        <Dialog.Title className="text-center mb-2 mt-3 font-bold text-2xl">Congratulations!!</Dialog.Title>
                        <Dialog.Description className="text-center">
                            You have been Nominated for the position of {nominatedPositionName}.
                        </Dialog.Description>

                        <p className='text-center'>
                            You can accept or decline the nomination.
                        </p>
                        <div className='flex space-x-5 justify-center mt-5'>
                            <Button className="bg-[#149911]" onClick={handleAccept} disabled={isloading}>
                                {isloading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Accepting...
                                    </>
                                    ) : (
                                        <>Accept</>
                                    )}
                            </Button>
                            <Button className="bg-[#3F0D12]" onClick={handleReject} disabled={loading}>
                                {loading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Declining...
                                    </>
                                    ) : (
                                        <>Decline</>
                                    )}
                            </Button>
                        </div>
                        {/* ... */}
                    </Dialog.Panel>
                </div>
            </Dialog>
            )}
                
                {currentStage === 'Nomination' ? (
                        <div>
                            <h1 className='mb-5 font-bold text-4xl text-center'>This is the Nomination stage</h1>
                            <div className='flex flex-col justify-center pb-2 mt-3 max-w-6xl mx-auto mb-3 bg-[#1E2C8A]'>
                                <p className='p-5 text-white text-center text-lg'>
                                    Welcome to our voting platform! At this stage, members are exclusively granted access to the Nomination section. 
                                    Please note that you are not able to proceed to the campaign and voting stages at this moment. 
                                    This phase is dedicated to the nomination process, where members can put forth their candidates or choices. 
                                    Stay tuned for updates as we progress through the voting journey together!
                                </p>
                            </div>
                        </div>
                    ) : currentStage === 'Campaign' ? (
                        <div>
                            <h1 className='mb-5 font-bold text-4xl text-center'>This is the Campaign stage</h1>
                            <div className='flex flex-col justify-center pb-2 mt-3 max-w-6xl mx-auto mb-3 bg-[#1E2C8A]'>
                                <p className='p-5 text-white'>
                                    Welcome to our voting platform! Currently, members have exclusive access to the Campaign section. 
                                    It is important to note that you cannot proceed to the Nomination stage and the Voting stage at this time. 
                                    This phase is dedicated to campaigns, where members can showcase and promote their candidates or causes. 
                                    Keep an eye out for further instructions as we move through the stages of the voting process together!                                
                                </p>
                            </div>
                        </div>
                    ) : currentStage === 'Voting' ? (
                        <div>
                            <h1 className='mb-5 font-bold text-4xl text-center'>This is the Voting stage</h1>
                            <div className='flex flex-col justify-center pb-2 mt-3 max-w-6xl mx-auto mb-3 bg-[#1E2C8A]'>
                                <p className='p-5 text-white'>
                                    Welcome to our voting platform! At this stage, members exclusively have access to the Voting section. 
                                    Please be aware that you are not able to navigate to the Nomination stage at this time. 
                                    This phase is dedicated to casting your votes and making your voice heard. 
                                    Stay engaged, as we progress through the voting journey together. 
                                    Keep an eye out for updates on the Nomination and Campaign stages in the future!                                 </p>
                            </div>
                        </div>
                    ) : currentStage === 'Voting Ended Stage' ? (
                        <div>
                            <h1 className='mb-5 font-bold text-4xl text-center'>This is the election has successfully come to an end.</h1>
                            <div className='flex flex-col justify-center pb-2 mt-3 max-w-6xl mx-auto mb-3 bg-[#1E2C8A]'>
                                <p className='p-5 text-white'>
                                   The election is over. Thank you for participating.
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
                                <Link className='border p-2.5 rounded-md bg-[#2187C0] text-white' href='/testnomsearch'>Go to Nomination</Link>
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
                        {currentStage === 'Campaign' || currentStage === 'Voting' ? (
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
