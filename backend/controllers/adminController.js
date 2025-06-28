import validator from 'validator';
import bcrypt from 'bcrypt';
import { v2 as cloudinary } from 'cloudinary';
import doctorModel from "../models/doctormodel.js";
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import appointmentModel from '../models/appointmentModel.js';
import userModel from '../models/userModel.js';
// Load environment variables
dotenv.config();

// Debug: Check if environment variables are loaded correctly
console.log("Cloudinary Config:", {
    cloud_name: process.env.CLOUDINARY_NAME || "MISSING",
    api_key: process.env.CLOUDINARY_API_KEY || "MISSING",
    api_secret: process.env.CLOUDINARY_SECRET_KEY ? "Present" : "MISSING!"
});

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_SECRET_KEY
});

// API for adding a doctor
const addDoctor = async (req, res) => {
    try {
        const { name, email, password, speciality, degree, experience, about, fees, address } = req.body;
        const imageFile = req.file;

        // Check for missing fields
        if (!name || !email || !password || !speciality || !degree || !experience || !about || !fees || !address) {
            return res.status(400).json({ success: false, message: 'Missing Details!' });
        }

        // Validate email format
        if (!validator.isEmail(email)) {
            return res.status(400).json({ success: false, message: 'Please enter a valid email!' });
        }

        // Validate strong password
        if (password.length < 8) {
            return res.status(400).json({ success: false, message: 'Password should be at least 8 characters long' });
        }

        // Ensure file is uploaded
        if (!imageFile || !imageFile.path) {
            return res.status(400).json({ success: false, message: 'Image upload failed!' });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Upload image to Cloudinary
        let imageUrl = '';
        try {
            const imageUpload = await cloudinary.uploader.upload(imageFile.path, {
                resource_type: 'image',
                api_key: process.env.CLOUDINARY_API_KEY,  // Explicit API key
                api_secret: process.env.CLOUDINARY_SECRET_KEY  // Explicit API secret
            });
            imageUrl = imageUpload.secure_url;
        } catch (error) {
            console.error('Cloudinary Upload Error:', error);
            return res.status(500).json({ success: false, message: 'Image upload to Cloudinary failed!', error: error.message });
        }

        // Parse Address
        let parsedAddress;
        try {
            parsedAddress = JSON.parse(address);
        } catch (error) {
            return res.status(400).json({ success: false, message: 'Invalid address format!' });
        }

        const doctorData = {
            name,
            email,
            image: imageUrl,
            password: hashedPassword,
            speciality,
            degree,
            experience,
            about,
            fees,
            address: parsedAddress,
            date: Date.now(),
        };

        // Save doctor data to the database
        const newDoctor = new doctorModel(doctorData);
        await newDoctor.save();

        res.status(201).json({ success: true, message: 'Doctor Added Successfully!' });

    } catch (error) {
        console.error('Server Error:', error);
        res.status(500).json({ success: false, message: 'Failed to add doctor!', error: error.message });
    }
};

//Api for admin login
const loginAdmin = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check admin credentials
        if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
            // Create a JWT token with role-based authentication
            const token = jwt.sign(
                { email, role: "admin" }, // Secure payload
                process.env.JWT_SECRET
            );

            return res.status(200).json({ success: true, message: "Login Successful!", token });
        } else {
            return res.status(401).json({ success: false, message: "Invalid Credentials!" });
        }
    } catch (error) {
        console.error("Server Error:", error);
        res.status(500).json({ success: false, message: "Failed to login!", error: error.message });
    }
};
//api to get all doctors list for admin panel
   const allDoctors = async (req,res)=>{
        try {
            const doctors = await doctorModel.find({}).select('-password')
            res.json({success:true,doctors})

        } catch (error) {
            console.error("Server Error:", error);
            res.status(500).json({ success: false, message: "Failed to login!", error: error.message });
        }
   }
   //api to get all appointments list
   const appointmentsAdmin = async(req,res)=>{
    try {
        const appointments = await appointmentModel.find({})
        res.json({success:true,appointments})
    } catch (error) {
        console.log(error);
        res.status(500).json({success:false,message:"Failed to fetch appointments!",error:error.message})
    }
   }
   //api for cancel appointment by admin
   const Appointmentcancel = async (req, res) => {
    try {
        const { appointmentId } = req.body;

        const appointmentData = await appointmentModel.findById(appointmentId);
        if (!appointmentData) {
            return res.status(404).json({ success: false, message: "Appointment not found" });
        }

        // console.log("🔍 User ID from Token:", userId);
        // console.log("🔍 Appointment User ID:", appointmentData.userId.toString());

        // ✅ Cancel appointment
        await appointmentModel.findByIdAndUpdate(appointmentId, { cancelled: true });

        // ✅ Releasing doctor slot
        const { docId, slotDate, slotTime } = appointmentData;
        const doctorData = await doctorModel.findById(docId);
        let slots_booked = doctorData.slots_booked || {};

        slots_booked[slotDate] = slots_booked[slotDate].filter((time) => time !== slotTime);
        await doctorModel.findByIdAndUpdate(docId, { slots_booked });

        res.json({ success: true, message: "Appointment cancelled successfully" });
    } catch (error) {
        console.log("❌ Error:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};
//api to get dashboard data for admin panel
   const adminDashboard = async (req,res)=>{
    try {
        const doctors = await doctorModel.find({})
        const users = await userModel.find({})
        const appointments = await appointmentModel.find({})

        const dashData = {
            doctors: doctors.length,
            appointments: appointments.length,
            patients: users.length,
            latestAppointments: appointments.reverse().slice(0, 5)
        }
        res.json({success:true,dashData})

    } catch (error) {
        console.log(error);
        res.status(500).json({success:false,message:"Failed to fetch dashboard data!",error:error.message})
    }
   }

export { addDoctor,loginAdmin,allDoctors,appointmentsAdmin,Appointmentcancel,adminDashboard };
