import MemberNavbar from '@/components/MemberNavbar';
import React, { useState } from 'react';
import Hero from '@/public/hero.jpg';
import Banner from '@/public/banner.jpg';
import Office from '@/public/office2.jpg';
import Profile from '@/public/profile.jpg';
import Image from 'next/image';
import Tiptap from '@/components/Tiptap';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/router';
import { useNewAuth } from '@/services/NewAuthContext';
import axios from 'axios';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

function Test({ apiData }) {
  const [voted, setVoted] = useState(false);
  const {employeeNumber, code} = useNewAuth();
  const [isloading, setIsLoading] = useState(false);

  const { toast } = useToast();

  console.log(code)
  const router = useRouter();

  const handleVote = async () => {
    setIsLoading(true);
    try {
      const response = await axios.post(
        'https://virtual.chevroncemcs.com/voting/vote',
        {
          empno: employeeNumber,
          positionId: apiData.data[0].positionId,
          votedno: apiData.data[0].empno
        },
        {
          headers: {
            'Authorization': `Bearer ${code}`,
            'Content-Type': 'application/json',
          }
        }
      );

      console.log('Vote Response:', response.data);

      if (response.data.error === false) {
        setVoted(true);
        toast({
          title: 'Voting Success',
          description: response.data.message,
        });
        // Handle the response or additional actions upon successful vote
      } else {
        // Handle errors or display a message to the user
        toast({
          variant: "destructive",
          title: 'Voting Error',
          description: ` ${response.data.message}`,
        });
      }
    } catch (error) {
      console.error('Error voting:', error);
      // Handle and display the error to the user
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <MemberNavbar />
      <div className="main-content mt-10 mb-44">
        {apiData ? (
          <div>
            <div className="relative h-[300px] sm:h-[400px] lg:h-[300px] xl:h-[300px] 2xl:h-[300px]">
              <img src='/office2.jpg' layout="fill" objectFit="cover" alt="" className='h-[300px] w-full object-cover' />
              <div className="absolute bottom-[-70px] left-1/2 transform translate-x-[-50%]">
                <div className="relative w-32 h-32">
                  <img src={apiData.data[0]?.image} alt="" className="absolute inset-0 w-full h-full object-cover rounded-full" />
                </div>
              </div>
            </div>

            <div className="flex flex-col space-y-1 justify-center items-center mt-24">
              <h1 className='font-extrabold text-2xl'>
                {apiData.data[0]?.name}
              </h1>
              <div className='flex justify-center mt-3'>

              <Button onClick={handleVote} className="bg-[#2187C0]" disabled={isloading}>
                {isloading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Voting...
                  </>
                ) : (
                  <>Vote For Me</>
                )}
              </Button>
            </div>
              <p className='text-lg text-gray-500 text-center'>
                Running for the Position of {apiData.data[0]?.position_name}
              </p>
            </div>

            <div className='max-w-6xl mx-auto flex flex-col justify-center items-center'>
              <h1 className='font-extrabold text-4xl mt-4 text-center'>
                Campaign Message
              </h1>
              <p className='mt-5 text-center'>
                {apiData.data[0]?.message}
              </p>
            </div>
            
          </div>
        ) : (
          <p>Loading...</p>
        )}
      </div>
    </div>
  );
}

export default Test;

export async function getServerSideProps(context) {
  const { empno } = context.query;

  try {
    // Make the GET request to the API endpoint
    const response = await fetch(`https://virtual.chevroncemcs.com/voting/campaign/${empno}`);
    if (!response.ok) {
      throw new Error(`Request failed with status: ${response.status}`);
    }
    const data = await response.json();
    console.log(data);

    return {
      props: {
        apiData: data,
      },
    };
  } catch (error) {
    console.error('Error fetching data:', error);

    return {
      props: {
        apiData: null,
      },
    };
  }
}
