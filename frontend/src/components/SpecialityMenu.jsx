import React from 'react'
import { specialityData } from '../assets/assets'
import { Link } from 'react-router-dom'

const SpecialityMenu = () => {
  return (
    <div className='flex flex-col items-center gap-6 py-20 bg-white text-gray-800' id='speciality'>
      <h1 className='text-4xl font-bold animate-fade-in'>Find by Speciality</h1>
      <p className='sm:w-1/2 text-center text-base font-light animate-fade-in'>Simply browse through our extensive list of trusted doctors, schedule your appointment hassle-free</p>
      <div className='flex sm:justify-center gap-6 pt-6 w-full overflow-x-auto scrollbar-hide px-4'>
        {
          specialityData.map((item, index) => (
            <Link 
              onClick={() => scrollTo(0, 0)} 
              className='flex flex-col items-center gap-2 cursor-pointer flex-shrink-0 hover:scale-105 transform transition-all duration-500 bg-gray-100 p-4 rounded-xl shadow-md animate-zoom-in' 
              key={index} 
              to={`/doctors/${item.speciality}`}>
              <img className='w-20 sm:w-24 object-contain' src={item.image} alt={item.speciality} />
              <p className='text-sm font-medium'>{item.speciality}</p>
            </Link>
          ))
        }
      </div>
    </div>
  )
}

export default SpecialityMenu
