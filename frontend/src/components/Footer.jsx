import React from 'react'
import { assets } from '../assets/assets'

const Footer = () => {
  return (
    <div className='md:mx-10'>
        <div className='flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-14 my-10 mt-40 text-sm'>
            {/* -----Left Section */}
            <div>
                <img className='mb-5 w-20' src={assets.logo} alt="" />
                <p className='w-full md:w-2/3 text-gray-600 leading-6'>At Al-Fazal Hospital Webiste, we are committed to connecting you with top healthcare professionals in your area. Our platform makes it easy to find the right doctor for your needs, book appointments instantly, and manage your healthcare effortlessly.</p>
            </div>
            {/* -----Center Section */}
            <div>
                <p className='text-xl font-medium mb-12'>COMPANY</p>
                <ul className='flex flex-col gap-2 text-gray-600'>
                    <li>Home</li>
                    <li>About us</li>
                    <li>Contact us</li>
                    <li>Privacy policy</li>
                </ul>
            </div>
            {/* -----Right Section */}
            <div>
                <p className='text-xl font-medium mb-12'>GET IN TOUCH</p>
                <ul className='flex flex-col gap-2 text-gray-600'>
                    <li>+92 419443582</li>
                    <li>drazharnaeem@gmail.com</li>
                </ul>
            </div>
        </div>
        {/* ---Copyright----*/}
        <div>
            <hr />
            <p className='py-5 text-sm text-center'>Copyright &copy; 2022 Al-Fazal Hospital. All rights reserved.</p>
        </div>
    </div>
  )
}

export default Footer