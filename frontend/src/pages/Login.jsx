import React, { useContext, useEffect, useState } from 'react';
import { AppContext } from '../context/AppContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const { backendUrl, token, loginUser } = useContext(AppContext);
    const navigate = useNavigate();
    const [state, setState] = useState('Sign Up');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const onSubmitHandler = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            let response;
            if (state === 'Sign Up') {
                response = await axios.post(`${backendUrl}/api/user/register`, { name, password, email });
            } else {
                response = await axios.post(`${backendUrl}/api/user/login`, { password, email });
            }

            const { data } = response;

            if (data?.success) {
                toast.success(data.message);

                if (state === 'Sign Up') {
                    // Clear fields and go to login
                    setEmail('');
                    setPassword('');
                    setName('');
                    setState('Login');
                } else {
                    if (!data.token) {
                        throw new Error("Token not received from backend");
                    }

                    loginUser(data.token);
                    navigate('/');
                }
            } else {
                toast.error(data?.message || "Login failed");
            }
        } catch (error) {
            console.error("Login Error:", error.response || error);
            toast.error(error.response?.data?.message || "An unexpected error occurred");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (token) {
            navigate('/');
        }
    }, [token, navigate]);

    return (
        <form onSubmit={onSubmitHandler} className='min-h-[80vh] flex items-center'>
            <div className='flex flex-col gap-3 m-auto items-start p-8 min-w-[340px] sm:min-w-96 border rounded-xl text-zinc-600 text-sm shadow-lg'>
                <p className='text-2xl font-semibold'>{state === 'Sign Up' ? "Create Account" : "Login"}</p>
                <p>Please {state === 'Sign Up' ? "sign up" : "log in"} to book an appointment</p>

                {state === 'Sign Up' &&  
                    <div className='w-full'>
                        <p>Full Name</p>
                        <input className='border border-zinc-300 rounded w-full p-2 mt-1' 
                            type="text" 
                            onChange={(e) => setName(e.target.value)} 
                            value={name} 
                            required />
                    </div>
                }

                <div className='w-full'>
                    <p>Email</p>
                    <input className='border border-zinc-300 rounded w-full p-2 mt-1' 
                        type="email" 
                        onChange={(e) => setEmail(e.target.value)} 
                        value={email} 
                        required />
                </div>
                <div className='w-full'>
                    <p>Password</p>
                    <input className='border border-zinc-300 rounded w-full p-2 mt-1' 
                        type="password" 
                        onChange={(e) => setPassword(e.target.value)} 
                        value={password} 
                        required />
                </div>

                <button type='submit' className='bg-primary text-white w-full py-2 rounded-md text-base'
                    disabled={isLoading}>
                    {isLoading ? "Processing..." : state === 'Sign Up' ? "Create Account" : "Login"}
                </button>

                {state === 'Sign Up' ? 
                    <p>Already have an account? 
                        <span 
                            onClick={() => {
                                setState('Login');
                                setEmail('');
                                setPassword('');
                            }} 
                            className='text-primary underline cursor-pointer'> Login here</span>
                    </p>
                    : 
                    <p>Create a new account? 
                        <span 
                            onClick={() => {
                                setState('Sign Up');
                                setEmail('');
                                setPassword('');
                                setName('');
                            }} 
                            className='text-primary underline cursor-pointer'> Click here</span>
                    </p>
                }
            </div>
        </form>
    );
};

export default Login;
