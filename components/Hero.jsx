import React from 'react'
import { Button, buttonVariants } from './ui/button'
import Link from 'next/link'

function Hero() {
  return (
    <header className='w-full flex justify-center items-center flex-col overflow-x-hidden mt-32'>
      <h1 className='head_text w-10/12 xl:w-full'>CEMCS Voting Platform <br className='max-md:hidden' />
        {/* <span className='orange_gradient'>OpenAI GPT-4</span> */}
      </h1>
      <h2 className='desc w-10/12 xl:w-full'>
        {/* Simplify your reading with Summize, an open-source article
        summarizer that transforms lengthy articles into clear and
        concise summaries */}
      </h2>
      <div>
        <Link href='/uploadNominations' className={buttonVariants()} >Upload Nominations</Link>
      </div>
    </header>
  )
}

export default Hero