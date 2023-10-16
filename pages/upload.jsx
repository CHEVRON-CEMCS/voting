import Navbar from '@/components/Navbar'
import { Button, buttonVariants } from '@/components/ui/button'
import { Download, HomeIcon, Landmark, Loader2, Upload, UserCheck } from 'lucide-react'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
// import Uploaded from './uploaded'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
// import Uploadeds from './uploads'
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import axios from "axios";
import { useAuth } from '@/services/AuthContext'
import Uploaded from '@/components/Uploaded'
// import { useToast } from '@/components/ui/use-toast'
import * as XLSX from "xlsx";



function Uploads() {

  const { user } = useAuth();
  

  console.log(user?.token);

  console.log('Super:',user?.superToken);

  const superrToken = user?.superToken;


const handleExportExcel = () => {
        
  // Replace this with your hardcoded data
const customData = [
['Employee Number', 'Name', 'Eligible Email'],
['123456', 'Charles Osegbue', 'charlesosegbue@gmail.com'],
['246810', 'Daniel Ukaji', 'danielukaji@gmail.com'],
// Add more rows as needed
];

  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.aoa_to_sheet(customData);
  XLSX.utils.book_append_sheet(wb, ws, 'Sample Voting Data');

  XLSX.writeFile(wb, 'SampleVoting.xlsx');

};


  return (
    <div>
      <Navbar />
      
      {superrToken === '0' ? (
        <div className="flex items-center justify-center h-screen mx-auto font-extrabold font-sora text-red-500">
        YOU DO NOT HAVE ACCESS TO THIS PAGE
      </div>
      ) : (
        <>
        <div className='max-w-6xl mx-auto mt-20'>
        {/* <h1 className='font-bold text-3xl md:text-4xl mb-5'>Upload bulk Document</h1> */}

        <div className='grid grid-cols-1 md:grid-cols-3 gap-y-4 md:gap-y-4 py-6 gap-x-8'>
          {/* Feed */}

          {/* Download Document */}
          <div className='overflow-hidden h-fit rounded-lg border border-gray-200 order-first md:order-last'>
            <div className='bg-emerald-100 px-6 py-4'>
              <p className='font-semibold py-3 flex items-center gap-1.5'>
                <Download className='w-4 h-4' />
                Download
              </p>
            </div>

            <div className='-my-3 divide-y divide-gray-100 px-6 py-4 text-sm leading-6'>
              <div className='flex justify-between gap-x-4 py-3'>
                <p className='text-zinc-500'>
                  Download the Excel template for uploading bulk candidates
                </p>
              </div>

              <Button onClick={handleExportExcel} className="w-full mt-4 mb-6">Download</Button>

            </div>
          </div>          

          {/* Download Document */}
          <div className='overflow-hidden h-fit rounded-lg border border-gray-200 order-first md:order-last'>
            <div className='bg-emerald-100 px-6 py-4'>
              <p className='font-semibold py-3 flex items-center gap-1.5'>
                <Landmark className='w-4 h-4' />
                Upload a Single Candidate
              </p>
            </div>

            <div className='-my-3 divide-y divide-gray-100 px-6 py-4 text-sm leading-6'>
              <div className='flex justify-between gap-x-4 py-3'>
                <p className='text-zinc-500'>
                  You can click on the button below to upload a single candidate
                </p>
              </div>

              {/* <Link className={buttonVariants({
                className: 'w-full mt-4 mb-6'
              })} href='/r/create'>Download</Link> */}

            <Sheet>
              <SheetTrigger asChild>
                <Button className="w-full mt-4 mb-6">Open</Button>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle>Upload a Single Voter</SheetTitle>
                  <SheetDescription>
                    You can upload a single voter here by putting the name of the voter.
                  </SheetDescription>
                </SheetHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="name" className="text-right">
                      Name
                    </Label>
                    <Input  
                      type="text"
                      placeholder="Enter voter name"
                    //   value={plotName}
                    //   onChange={(e) => setPlotName(e.target.value)} 
                      className="col-span-3 outline-none" 
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="name" className="text-right">
                      Employee Number
                    </Label>
                    <Input  
                      type="text"
                      placeholder="Enter voter name"
                    //   value={plotName}
                    //   onChange={(e) => setPlotName(e.target.value)} 
                      className="col-span-3 outline-none" 
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="name" className="text-right">
                      Email
                    </Label>
                    <Input  
                      type="text"
                      placeholder="Enter voter name"
                    //   value={plotName}
                    //   onChange={(e) => setPlotName(e.target.value)} 
                      className="col-span-3 outline-none" 
                    />
                  </div>
                </div>
                <SheetFooter>
                  <SheetClose asChild>
                  {/* <Button onClick={handleSubmit} className="mb-10" disabled={isLoading}>
                  {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    Submit
                  </>
                )}
                  </Button>           */}
              </SheetClose>
                </SheetFooter>
              </SheetContent>
            </Sheet>
            </div>
          </div>
        </div>

        {/* Render the Uploaded component */}
        <div className='flex items-center space-x-28'>
          <Uploaded />
          {/* <Uploadeds /> */}
          {/* Download Document */}
          <div className='overflow-hidden h-fit rounded-lg border border-gray-200 order-first md:order-last'>
            <div className='bg-emerald-100 px-6 py-4'>
              <p className='font-semibold py-3 flex items-center gap-1.5'>
                <Download className='w-4 h-4' />
                See all candidates
              </p>
            </div>

            <div className='-my-3 divide-y divide-gray-100 px-6 py-4 text-sm leading-6'>
              <div className='flex justify-between gap-x-4 py-3'>
                <p className='text-zinc-500'>
                  Click here to view all the eligible candidates added
                </p>
              </div>

              <Link href="/candidates" className="w-full">
                <Button className="mb-5">
                  See all candidates
                </Button>
              </Link>

            </div>
          </div>

        </div>
      </div>
        </>
      )}
      
    </div>
  )
}

export default Uploads;