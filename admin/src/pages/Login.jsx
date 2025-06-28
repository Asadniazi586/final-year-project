import React, { useContext, useState } from 'react'
import {assets} from '../assets/assets'
import { AdminContext } from '../context/AdminContext'
import axios from 'axios'
import { toast } from 'react-toastify'
import { DoctorContext } from '../context/DoctorContext'
const Login = () => {
    const [state,setState] = useState('Admin')
    const [email,setEmail] = useState('')
    const [password,setPassword] = useState('')
    const {setAToken,backendUrl} = useContext(AdminContext)
    const {setDToken} = useContext(DoctorContext)
    const onSubmitHandler = async (e) => {
        e.preventDefault();
        try {
            if (state === 'Admin') {
                const { data } = await axios.post(`${backendUrl}/api/admin/login`, { email, password });
    
                if (data.success) {
                    localStorage.setItem('aToken', data.token);
                    setAToken(data.token);
                    toast.success("Login successful!", { autoClose: 1500 });
                    console.log(data.token);
                } else {
                    toast.error(data.message || "Invalid credentials!");
                }
            }else{
                const { data } = await axios.post(`${backendUrl}/api/doctor/login`, { email, password });
                if (data.success) {
                    localStorage.setItem('dToken', data.token);
                    setDToken(data.token);
                    toast.success("Login successful!", { autoClose: 1500 });
                    console.log(data.token);
                } else {
                    toast.error(data.message || "Invalid credentials!");
                }
            }
        }catch (error) {
            console.error("Login Error:", error.response ? error.response.data : error.message);
    
            if (error.response) {
                // If the server responded with an error message
                toast.error(error.response.data.message || "Invalid credentials!", { autoClose: 1500 });
            } else if (error.request) {
                // If the request was made but no response was received
                toast.error("No response from server. Please try again later.");
            } else {
                // If something else went wrong
                toast.error("Something went wrong. Please try again!");
            }
        }
    };
    
  return (
    <form onSubmit={onSubmitHandler} action="" className='min-h-[80vh] flex items-center'>
        <div className='flex flex-col gap-3 m-auto items-start p-8 min-w-[340px] sm:min-w-96 border rounded-xl text-[#5E5E5E] text-sm shadow-lg'>
            <p className='text-2xl font-semibold m-auto'><span className='text-[#5F6FFF]'>{state}</span>Login</p>
            <div className='w-full'>
                <p>Email</p>
                <input onChange={(e)=>setEmail(e.target.value)} value={email} className='border border-[#DADADA] rounded w-full p-2 mt-1' type="email" required />
            </div>
            <div className='w-full'>
                <p>Password</p>
                <input onChange={(e)=>setPassword(e.target.value)} value={password} className='border border-[#DADADA] rounded w-full p-2 mt-1' type="password" required />
            </div>
            <button className='bg-[#5F6FFF] text-white w-full py-2 rounded-md text-base'>Login</button>
            {
                state === 'Admin' ? <p>Doctor Login? <span className='text-[#5F6FFF] underline cursor-pointer' onClick={()=>setState('Doctor')}>Click here</span></p>:
                <p>Admin Login? <span className='text-[#5F6FFF] underline cursor-pointer' onClick={()=>setState('Admin')}>Click here</span></p>
            }
        </div>
    </form>
  )
}

export default Login