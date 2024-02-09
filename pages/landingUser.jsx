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
import { Drawer } from 'vaul';
import Footer from '@/components/Footer'

function LandingUser() {
    const { code, employeeNumber, currentStage, nominated, accepted, positionId, name, eligible, canLogin, message, positionIdArray, positionName } = useNewAuth();
    const [isOpen, setIsOpen] = useState(false);
    const [isloading, setIsLoading] = useState(false);
    const [loading, IssLoading] = useState(false);
    const [acceptedState, setAccepted] = useState(accepted);
    const [positions, setPositions] = useState([]);
    const [currentStageData, setCurrentStageData] = useState(null);
    // State to track whether the screen size is mobile or not
    const [isMobile, setIsMobile] = useState(false);
    const [open, setOpen] = useState(false);
    const [selectedPosition, setSelectedPosition] = useState([]);

    console.log('Position', positionId);
    console.log('Name:', name)
    console.log('Eligible', eligible)
    console.log('CanLogin', canLogin)
    console.log('message', message)
    console.log('positionIdArray', positionIdArray)
    console.log('positionName', positionName);

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
                position: selectedPosition
            };

            // Log the payload before sending the request
        console.log('Request Payload:', requestBody);

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

    if (currentStageData === 'Not Started') {
        return (
            <div>
                <MemberNavbar />
                <div className="flex items-center justify-center h-screen mx-auto font-extrabold font-sora text-red-500 text-center w-10/12">
                    <h1 className='text-lg lg:text-2xl'>THE VOTING PROCESS HAS NOT STARTED.</h1>
                </div>
            </div>
        );
    }

    return (
        <div>
            {canLogin === "0" ? (
                <div>
                    <MemberNavbar />
                <div className="flex items-center justify-center h-screen mx-auto font-extrabold font-sora text-red-500 text-center w-10/12">
                  <h1 className='text-lg lg:text-2xl'>{message}</h1>
                </div>
              </div>
            ):(
                <div>
                    <MemberNavbar />

<div className="flex flex-col items-center justify-center md:h-screen mt-24 md:mt-0">

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
        <Dialog.Panel className="mx-auto max-w-xl w-[50rem] h-3/5 rounded bg-white">
            <Dialog.Title className="text-center mb-2 mt-3 font-bold text-xl lg:text-2xl">Congratulations!!</Dialog.Title>
            <Dialog.Description className="text-center">
                {/* You have been Nominated for the position of <p className='font-bold'>{nominatedPositionName}</p> */}
                Congratulations on your nomination.
            </Dialog.Description>

            <p className='text-center'>
                You can accept or reject the nomination.
            </p>

            <div className='px-10 text-center'>
                <p>NOTE: You can only select and accept one position.</p>
                <p>Click on the drop down to select the position you want to be voted for and click on the Accept Button.</p>
                <p>However, if you do not wish to accept any of the positions you have been nominated for, you can click on the Reject all button.</p>
            </div>
            <div>
                {/* Select dropdown for position */}
    <div className='flex flex-col items-center mt-2 px-10'>
        <Label className="text-lg mb-2">Select Position:</Label>
        <select
            value={selectedPosition} // Assuming you want to default to the current positionId
            onChange={(e) => {
                setSelectedPosition(e.target.value);
                console.log('Selected Position Id:', e.target.value);
            }} // Update the state on change
            className="border rounded-md p-2 w-full"
        >
{positionName.map((name, index) => (
                <option key={positionIdArray[index]} value={positionIdArray[index]}>
                    {name}
                </option>
            ))}
        </select>
    </div>
            </div>
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
                <Button className="bg-[#da3a4a]" onClick={handleReject} disabled={loading}>
                    {loading ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Rejecting all...
                        </>
                        ) : (
                            <>Reject all</>
                        )}
                </Button>
            </div>
            {/* ... */}
        </Dialog.Panel>
    </div>
</Dialog>
)}
    
    {currentStageData === 'Nomination' ? (
            <div>
                <h1 className='mb-5 font-bold md:text-4xl text-2xl text-center'>This is the Nomination stage</h1>
                <div className='flex flex-col justify-center pb-2 mt-3 max-w-6xl mx-auto mb-3'>
                {isMobile ? (
                    <div className=''>
                        <div className='bg-[#CF1A32]'>
                            <p className='p-5 text-center text-white mb-2'>Please click on the button below to find out more about this stage</p>
                        </div>
                        <div>
                        <Drawer.Root dismissible={false} open={open}>
                            <Drawer.Trigger data-testid="trigger" asChild onClick={() => setOpen(true)}>
                                <div className='flex justify-center'>
                                <Button>Show Information</Button>
                                </div>
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
                                    <Drawer.Title className="font-medium mb-4">Nomination Stage</Drawer.Title>
                                    <div className="text-zinc-600 mb-2">
                                        <ul>
                                            <li> • Welcome to our voting platform!</li>
                                            <li> • At this stage, members are exclusively granted access to the Nomination section.</li>
                                            <li> • Please note that you are not able to proceed to the campaign and voting stages at this moment.</li>
                                            <li> • This phase is dedicated to the nomination process, where members can put forth their candidates or choices.</li>
                                            <li> • Stay tuned for updates as we progress through the voting journey together!</li>
                                        </ul>
                                    </div>
                                    

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
                                    Powered by CEMCS
                                </div>
                                </div>
                            </Drawer.Content>
                            </Drawer.Portal>
                        </Drawer.Root>
                        </div>
                    </div>
                ) : (
                    <div>
                        {/* ... (existing code) */}
                        <div className='p-5 text-white bg-[#1E2C8A]'>
                        <ul>
                            <li> • Welcome to our voting platform!</li>
                            <li> • At this stage, members are exclusively granted access to the Nomination section.</li>
                            <li> • Please note that you are not able to proceed to the campaign and voting stages at this moment.</li>
                            <li> • This phase is dedicated to the nomination process, where members can put forth their candidates or choices.</li>
                            <li> • Stay tuned for updates as we progress through the voting journey together!</li>
                        </ul>
                                 
                        </div>
                    </div>
                )}
                    {/* <p className='p-5 text-white text-center md:text-lg text-base hidden'>
                        Welcome to our voting platform! At this stage, members are exclusively granted access to the Nomination section. 
                        Please note that you are not able to proceed to the campaign and voting stages at this moment. 
                        This phase is dedicated to the nomination process, where members can put forth their candidates or choices. 
                        Stay tuned for updates as we progress through the voting journey together!
                    </p> */}
                </div>
            </div>
        ) : currentStageData === 'Campaign' ? (
            <div>
                <h1 className='mb-5 font-bold md:text-4xl text-2xl text-center'>This is the Campaign stage</h1>
                <div className='flex flex-col justify-center pb-2 mt-3 max-w-6xl mx-auto mb-3'>
                    {isMobile ? (
                    <div className=''>
                        <div className='bg-[#CF1A32]'>
                            <p className='p-5 text-center text-white mb-2'>Please click on the button below to find out more about this stage</p>
                        </div>
                        <div>
                        <Drawer.Root dismissible={false} open={open}>
                            <Drawer.Trigger data-testid="trigger" asChild onClick={() => setOpen(true)}>
                                <div className='flex justify-center'>
                                <Button>Show Information</Button>
                                </div>
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
                                    <Drawer.Title className="font-medium mb-4">Campaign Stage</Drawer.Title>
                                    <div className="text-zinc-600 mb-2">
                                        <ul>
                                            <li> • Welcome to our voting platform!</li>
                                            <li> • Currently, members have exclusive access to the Campaign section.</li>
                                            <li> • It is important to note that you cannot proceed to the Nomination stage and the Voting stage at this time.</li>
                                            <li> • This phase is dedicated to campaigns, where members can showcase and promote their candidates or causes.</li>
                                            <li> • Keep an eye out for further instructions as we move through the stages of the voting process together!</li>
                                        </ul>
                                    </div>
                                    

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
                                    Powered by CEMCS
                                </div>
                                </div>
                            </Drawer.Content>
                            </Drawer.Portal>
                        </Drawer.Root>
                        </div>
                    </div>
                ) : (
                    <div>
                        {/* ... (existing code) */}
                        <div className='p-5 text-white bg-[#1E2C8A]'>
                        <ul>
                            <li> • Welcome to our voting platform!</li>
                            <li> • Currently, members have exclusive access to the Campaign section.</li>
                            <li> • It is important to note that you cannot proceed to the Nomination stage and the Voting stage at this time.</li>
                            <li> • This phase is dedicated to campaigns, where members can showcase and promote their candidates or causes.</li>
                            <li> • Keep an eye out for further instructions as we move through the stages of the voting process together!</li>
                        </ul>
                                 
                                </div>
                    </div>
                )}
                    {/* <p className='p-5 text-white hidden'>
                        Welcome to our voting platform! Currently, members have exclusive access to the Campaign section. 
                        It is important to note that you cannot proceed to the Nomination stage and the Voting stage at this time. 
                        This phase is dedicated to campaigns, where members can showcase and promote their candidates or causes. 
                        Keep an eye out for further instructions as we move through the stages of the voting process together!                                
                    </p> */}
                </div>
            </div>
        ) : currentStageData === 'Voting' ? (
            <div>
                <h1 className='mb-5 font-bold md:text-4xl text-2xl text-center'>This is the Voting stage</h1>
                <div className='flex flex-col justify-center pb-2 mt-3 max-w-6xl mx-auto mb-3 '>
                {isMobile ? (
                    <div className=''>
                        <div className='bg-[#CF1A32]'>
                            <p className='p-5 text-center text-white mb-2'>Please click on the button below to find out more about this stage</p>
                        </div>
                        <div>
                        <Drawer.Root dismissible={false} open={open}>
                            <Drawer.Trigger data-testid="trigger" asChild onClick={() => setOpen(true)}>
                                <div className='flex justify-center'>
                                <Button>Show Information</Button>
                                </div>
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
                                    <Drawer.Title className="font-medium mb-4">Voting Stage</Drawer.Title>
                                    <div className="text-zinc-600 mb-2">
                                    <ul>
                                        <li> • Welcome to our voting platform!</li>
                                        <li> • At this stage, members exclusively have access to the Voting section.</li>
                                        <li> • Please be aware that you are not able to navigate to the Nomination stage at this time.</li>
                                        <li> • This phase is dedicated to casting your votes and making your voice heard.</li>
                                        <li> • Stay engaged, as we progress through the voting journey together.</li>
                                        <li> • Keep an eye out for updates on the Nomination and Campaign stages in the future!</li>
                                    </ul>
                                    </div>
                                    

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
                                    Powered by CEMCS
                                </div>
                                </div>
                            </Drawer.Content>
                            </Drawer.Portal>
                        </Drawer.Root>
                        </div>
                    </div>
                ) : (
                    <div>
                        {/* ... (existing code) */}
                        <div className='p-5 text-white bg-[#1E2C8A]'>
                            <ul>
                                <li> • Welcome to our voting platform!</li>
                                <li> • At this stage, members exclusively have access to the Voting section.</li>
                                <li> • Please be aware that you are not able to navigate to the Nomination stage at this time.</li>
                                <li> • This phase is dedicated to casting your votes and making your voice heard.</li>
                                <li> • Stay engaged, as we progress through the voting journey together.</li>
                                <li> • Keep an eye out for updates on the Nomination and Campaign stages in the future!</li>
                            </ul>
                        </div>
                    </div>
                )}
                    {/* <p className='p-5 text-white hidden'>
                        Welcome to our voting platform! At this stage, members exclusively have access to the Voting section. 
                        Please be aware that you are not able to navigate to the Nomination stage at this time. 
                        This phase is dedicated to casting your votes and making your voice heard. 
                        Stay engaged, as we progress through the voting journey together. 
                        Keep an eye out for updates on the Nomination and Campaign stages in the future!                                 
                    </p> */}
                </div>
            </div>
        ) : currentStageData === 'Voting Ended Stage' ? (
            <div>
                <h1 className='mb-5 font-bold text-4xl text-center'>This is the election has successfully come to an end.</h1>
                <div className='flex flex-col justify-center pb-2 mt-3 max-w-6xl mx-auto mb-3 bg-[#1E2C8A]'>
                    <p className='p-5 text-white bg-[#1E2C8A]'>
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
            {/* {isMobile ? (
        <p>This is the mobile view</p>
    ) : (
        <div>
            Large view
        </div>
    )}
             */}
        </div>

        <div>
        <p className='mb-5 text-center'>
          Having challenges? You can reach out to us directly at: <b><a className='underline' href="mailto:l9lek325-smb@chevron.com">l9lek325-smb@chevron.com</a></b> Additionally, you can include the following email addresses in your communication: <br /><b><a className='underline' href="mailto:chiomaokafor@chevron.com">chiomaokafor@chevron.com</a></b>, <b><a className='underline' href="mailto:tunde.oyedele@chevron.com">tunde.oyedele@chevron.com</a></b>
        </p>
        </div>
            

    <div className="max-w-6xl mx-auto md:flex md:flex-row flex-col md:space-x-8 md:space-y-0 space-y-5 mb-10 md:mb-0">


        <Card className="w-[350px]">
            <CardHeader>
                <CardTitle className="mb-3">Nomination Stage</CardTitle>
                {/* <CountdownTimer targetDate={targetDate} /> */}
                <CardDescription>This will navigate you to the Nomination stage where you can nominate your candidates</CardDescription>
            </CardHeader>
            <CardContent>
            {currentStageData === 'Nomination' ? (
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
{currentStageData === 'Nomination' ? (
<Button className='border p-2.5 rounded-md bg-[#2187C0] text-white' disabled>
Go to Campaign
</Button>
) : (
<Button className='border p-2.5 rounded-md bg-[#2187C0] text-white' disabled>
Go to Campaign
</Button>
)}
</CardContent>
</Card>

        {/* <Card className="w-[350px]">
<CardHeader>
<CardTitle className="mb-3">Campaign Stage</CardTitle>
<CardDescription>This will navigate you to the Campaign stage where you can start your campaign</CardDescription>
</CardHeader>
<CardContent>
{currentStageData === 'Nomination' ? (
<Button className='border p-2.5 rounded-md bg-[#2187C0] text-white' disabled>
Go to Campaign
</Button>
) : (
<Link className='border p-2.5 rounded-md bg-[#2187C0] text-white' href='/landingcampaign'>
Go to Campaign
</Link>
)}
</CardContent>
</Card> */}


        <Card className="w-[350px]">
            <CardHeader>
                <CardTitle className="mb-3">Voting Stage</CardTitle>
                <CardDescription>This will navigate you to the Voting stage where you can cast your vote</CardDescription>
            </CardHeader>
            <CardContent>
            {currentStageData === 'Voting' ? (
                    <Link className='border p-2.5 rounded-md bg-[#2187C0] text-white' href='/multiplecampaigns'>Go to Voting</Link>
                ) : (
                    <Button className='border p-2.5 rounded-md bg-[#2187C0] text-white' disabled>Go to Voting</Button>
                )}
            </CardContent>
        </Card>
    </div>
</div>
                </div>
            )}

            {/* <Footer /> */}
            
        </div>
    )
}

export default LandingUser;
