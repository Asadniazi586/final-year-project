import React from 'react'
import { assets } from '../assets/assets'
import { useNavigate } from 'react-router-dom'

const Banner = () => {
    const navigate = useNavigate()
  return (
    <div className='flex bg-primary rounded-lg px-6 sm:px-10 md:px-14 lg:px-12 my-20 md:mx-10'>
        {/* ------- Left Side ------ */}
        <div className='flex-1 py-8 sm:py-10 md:py-16 lg:py-24 lg:pl-5'>
            <div className='text-lg sm:text-lg md:text-xl lg:text-3xl font-semibold text-white'>
                <p>Your health, our priority—Alfazal Hospital offers seamless online appointment scheduling for quick access to quality medical care.</p>
                {/* <p className='mt-2'>appointment scheduling for quick access to quality medical care</p> */}
            </div>
            <button onClick={()=>{navigate('/login'); scrollTo(0,0)}} className='bg-white text-sm sm:text-base text-gray-600 px-8 py-3 rounded-full mt-6 hover:scale-105 transition-all cursor-pointer'>Create Account</button>
        </div>
        {/* ------- Right Side ------ */}
        <div className='hidden md:block md:w-1/2 lg:w-[340px] relative'>
            <img className='w-full absolute bottom-3.5 rounded-full right-0 max-w-md' src={assets.banner} alt="" />
        </div>
    </div>
  )
}

export default Banner