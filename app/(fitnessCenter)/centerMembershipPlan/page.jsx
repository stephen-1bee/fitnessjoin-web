import React from 'react'
import Link from 'next/link'

const page = () => {
  return (
    <div className='min-h-screen home w-ful/l flex items-center justify-center'>
      <div className='w-[80%] flex flex-col items-center gap-8 p-20'>
          <h1 className='text-3xl font-bold text-white'>Select Membership Plans</h1>
          <div className='bg-white w-full h-[170] p-17'>
              <Link href="/fitnessAuth" className='p-20'> 
                  <h2 className='white'>GHS 60</h2>
              </Link>
          </div>
      </div>
    </div>
  )
}

export default page