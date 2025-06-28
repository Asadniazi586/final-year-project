import React, { useEffect, useContext } from 'react'
import { AdminContext } from '../../context/AdminContext'
import { AppContext } from '../../context/AppContext'
import { assets } from '../../assets/assets'

const AllAppointments = () => {
  const { aToken, appointments, getAllAppointments,cancelAppointment} = useContext(AdminContext)
const {calculateAge,slotDateFormat,currency} = useContext(AppContext)
  useEffect(() => {
    if (aToken) {
      getAllAppointments()
    }
  }, [aToken])

  return (
    <div className='w-full max-w-6xl m-5'>
      <p className='mb-3 text-lg font-medium'>All Appointments</p>
      <div className='bg-white border rounded text-sm max-h-[80vh] overflow-y-scroll min-h-[60vh]'>

        <div className='hidden sm:grid grid-cols-[0.5fr_3fr_1fr_3fr_3fr_1fr_1fr] grid-flow-col py-3 px-6 border-b'>
          <p>#</p>
          <p>Patient</p>
          <p>Age</p>
          <p>Date & Time</p>
          <p>Doctor</p>
          <p>Fees</p>
          <p>Actions</p>
        </div>

        {
          appointments && appointments.length > 0 ? (
            appointments.map((item, index) => (
              <div key={index} className='grid sm:grid-cols-[0.5fr_3fr_1fr_3fr_3fr_1fr_1fr] items-center px-6 py-3 border-b hover:bg-gray-100'>
                <p className='max-sm:hidden'>{index + 1}</p>

                <div className='flex items-center gap-2'>
                  <img src={item?.userData?.image || '/default-user.png'} alt="User" className="w-8 aspect-square rounded-full object-cover" />
                  <p>{item?.userData?.name || 'Unknown'}</p>
                </div>
               <p className='max-sm:hidden'>{calculateAge(item?.userData?.dob)}</p>
               <p>{slotDateFormat(item.slotDate)}, {item.slotTime}</p>
               <div className='flex items-center gap-2'>
                  <img src={item?.docData?.image || '/default-user.png'} alt="User" className="w-8 aspect-square rounded-full object-cover bg-gray-200" />
                  <p>{item?.docData?.name || 'Unknown'}</p>
                </div>
                <p>{currency}{item.amount}</p>
                {item.cancelled ? <p className='text-red-400 text-xs font-medium'>Cancelled</p> : item.isCompleted ? <p className='text-green-500 text-xs font-medium'>Completed</p>: <img src={assets.cancel_icon} onClick={()=>cancelAppointment(item._id)} alt="" className='w-10 cursor-pointer'/>}
               
              </div>
            ))
          ) : (
            <p className='p-4 text-gray-500'>No appointments found.</p>
          )
        }
      </div>
    </div>
  )
}

export default AllAppointments
