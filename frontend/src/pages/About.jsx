import React from 'react'
import { assets } from '../assets/assets'

const About = () => {
  return (
    <div>
      <div className='text-center text-2xl pt-10 text-gray-500 '>
        <p>ABOUT <span className='text-gray-700 font-medium'>US</span> </p>
      </div>
      <div className='my-10 flex flex-col md:flex-row gap-12'>
        <img className='w-full md:max-w-[360px]' src={assets.about} alt="" />
        <div className='flex flex-col justify-center gap-6 md:w-2/4 text-sm text-gray-600'>
          <p>Welcome to Al-Fazal hospital, your one-stop solution for hassle-free doctor appointments. Our platform connects patients with trusted healthcare professionals, making it easier than ever to book consultations, manage medical records, and receive expert care at your convenience.</p>
          <b className='text-gray-800'>Our Mission</b>
          <p>We aim to simplify healthcare access by providing a seamless and efficient online appointment system. Our goal is to bridge the gap between patients and doctors, ensuring timely consultations and better healthcare experiences.</p>
          <b className='text-gray-800'>Our Vision</b>
          <p>We envision a future where healthcare is easily accessible to everyone, eliminating long waiting times and simplifying the appointment process. Our goal is to create a seamless digital healthcare experience that connects patients with trusted doctors efficiently, ensuring timely and quality medical care. </p>
        </div>
      </div>
      <div className='text-xl my-4'>
        <p>WHY <span className='text-gray-700 font-semibold'>CHOOSE US</span></p>
      </div>
      <div className='flex flex-col md:flex-row mb-20'>
        <div className='border px-10 md:px-16 py-8 sm:py-16 flex flex-col gap-5 text-[15px] hover:bg-[#5f6FFF] hover:text-white transition-all duration-300 text-gray-600 cursor-pointer'>
        <b>Efficiency:</b>
        <p>Streamlined appointment scheduling that fits into your busy lifestyle.</p>
        </div>
        <div className='border px-10 md:px-16 py-8 sm:py-16 flex flex-col gap-5 text-[15px] hover:bg-[#5f6FFF] hover:text-white transition-all duration-300 text-gray-600 cursor-pointer'>
        <b>Convenience:</b>
        <p>Access to a network of trusted healthcare professionals in your area.</p>
        </div>
        <div className='border px-10 md:px-16 py-8 sm:py-16 flex flex-col gap-5 text-[15px] hover:bg-[#5f6FFF] hover:text-white transition-all duration-300 text-gray-600 cursor-pointer'>
        <b>Personalization:</b>
        <p>Tailored recommendations and reminders to help you stay on top of your health.</p>
        </div>
      </div>
    </div>
  )
}

export default About