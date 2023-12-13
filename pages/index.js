import Navbar from '@/components/Navbar'
import { Button, buttonVariants } from '@/components/ui/button'
import React from 'react'
import Banner from '@/public/banner.jpg'
import Image from 'next/image'
import NavLanding from '@/components/NavLanding'
import Link from 'next/link'

export default function Home() {
  return (
    <div className="">
      {/* <Head>
        <title>QooSpayce</title>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0" />
        <link rel="icon" href="/qoo_logo.png" />
      </Head> */}
      {/* <Header /> */}
      {/* <Navbar /> */}
      <NavLanding />

      <div className="flex flex-col items-center justify-center w-full mt-20 mb-16">
        <div className="md:w-[30rem] ">
          <h1 className="text-2xl md:text-4xl font-bold text-center text-secondary leading-[2.75rem]">
            WELCOME TO THE CEMCS VOTING PLATFORM
          </h1>
        </div>

        <div className='flex space-x-5 mt-5' >
            <Link href="/signinmember" className='bg-[#2187C0] pt-2 pb-2 pl-5 pr-5 rounded-xl text-white'>
             Sign in
            </Link>

          {/* <Button className="bg-[#1E2C8A]">
              <Link  href="/signin">
              Admin Sign in
              </Link>
          </Button> */}
        </div>

        <div className="relative w-full mt-16 h-[30rem] border">
  <img
    className="absolute w-full h-full object-cover"
    src='/image001.jpg'
    layout="fill"
    objectFit="contain"
    alt='Altina'
  />
</div>

       
      </div>
      
    </div>
  )
}

