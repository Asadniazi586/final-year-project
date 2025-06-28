import { createContext, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export const AppContext = createContext();

const AppContextProvider = ({ children }) => {
    const currencySymbol = "$";
    const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:4000";

    const [doctors, setDoctors] = useState([]);
    const [token, setToken] = useState(localStorage.getItem("token") || "");
    const [userData, setUserData] = useState(null);

    // ✅ Login User (New Function)
    const loginUser = (newToken) => {
        console.log("✅ Logging in user with token:", newToken);
        setToken(newToken);
        localStorage.setItem("token", newToken);
    };

    // ✅ Fetch all doctors
    const getDoctorsData = async () => {
        try {
            const { data } = await axios.get(`${backendUrl}/api/doctor/list`);
            if (data.success) {
                setDoctors(data.doctors);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            console.error("❌ Error fetching doctors:", error);
            toast.error(error.response?.data?.message || "Failed to fetch doctors.");
        }
    };

    // ✅ Fetch User Profile
    const loadUserProfileData = async () => {
        if (!token) return;
        try {
            console.log("🔍 Fetching user profile...");
            const { data } = await axios.get(`${backendUrl}/api/user/get-profile`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (data.success) {
                setUserData(data.userData);
            } else {
                console.error("❌ Failed to fetch user:", data.message);
                toast.error(data.message);
                setUserData(null);
            }
        } catch (error) {
            console.error("❌ Error fetching profile:", error.response?.data || error.message);
            toast.error(error.response?.data?.message || "Failed to fetch profile.");
            if (error.response?.status === 401) {
                logoutUser();
            }
        }
    };

    // ✅ Logout user
    const logoutUser = () => {
        console.log("🔴 Logging out user...");
        localStorage.removeItem("token");
        setToken("");
        setUserData(null);
        window.location.href = "/login"; // Redirect to login
    };

    // ✅ Sync token with localStorage
    useEffect(() => {
        if (token) {
            localStorage.setItem("token", token);
            loadUserProfileData();
        } else {
            localStorage.removeItem("token");
            setUserData(null);
        }
    }, [token]);

    // ✅ Fetch Doctors on Load
    useEffect(() => {
        getDoctorsData();
    }, []);

    return (
        <AppContext.Provider value={{ 
            doctors, currencySymbol, token, setToken, loginUser, backendUrl, userData, setUserData, logoutUser, loadUserProfileData, getDoctorsData 
        }}>
            {children}
        </AppContext.Provider>
    );
};

export default AppContextProvider;
