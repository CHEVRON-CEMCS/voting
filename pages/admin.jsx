import Image from 'next/image'
import { Inter } from 'next/font/google'
import Navbar from '@/components/Navbar'
import Hero from '@/components/Hero'
import SmallBanner from '@/components/SmallBanner'
import { useAuth } from '@/services/AuthContext'
import { useRouter } from 'next/router'
import { useEffect } from 'react'

const inter = Inter({ subsets: ['latin'] })

export default function Admin() {
  const { user } = useAuth();
  const router = useRouter();

  console.log(user?.token);

  console.log('Super:',user?.superToken);

  // Use the useEffect hook to check if the user is logged in
  useEffect(() => {
    if (!user) {
      router.push('/signin');
    }
  }, [user, router]);

  return (
    <main>
      <Navbar />
      <Hero />
      <SmallBanner />
    </main>
  )
}
