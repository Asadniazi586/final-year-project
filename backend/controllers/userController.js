import mongoose from 'mongoose'
import validator from 'validator'
import bcrypt from 'bcrypt'
import Stripe from 'stripe'
import userModel from '../models/userModel.js'
import jwt from 'jsonwebtoken'
import {v2 as cloudinary} from 'cloudinary'
import doctorModel from '../models/doctormodel.js'
import appointmentModel from '../models/appointmentModel.js'
import { sendAppointmentNotification } from './emailService.js';
const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // ✅ Validate user input
        if (!name || !email || !password) {
            return res.status(400).json({ success: false, message: 'Missing Details' });
        }
        if (!validator.isEmail(email)) {
            return res.status(400).json({ success: false, message: 'Enter a valid email' });
        }
        if (password.length < 8) {
            return res.status(400).json({ success: false, message: 'Password should be at least 8 characters long' });
        }

        // ✅ Check if email already exists
        const existingUser = await userModel.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ success: false, message: 'Email already exists' });
        }

        // ✅ Hashing password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // ✅ Save user to database
        const newUser = new userModel({ name, email, password: hashedPassword });
        const user = await newUser.save();

        // ✅ Generate token
        const token = jwt.sign(
            { userId: user._id }, // ✅ Ensure userId is included
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );        

        // ✅ Send success response
        res.status(201).json({ success: true, message: 'User Registered Successfully', token });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Error occurred while registering user', error: error.message });
    }
};


//api for user login

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if user exists
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.json({ success: false, message: 'User not found' });
        }

        // Compare passwords
        const isMatched = await bcrypt.compare(password, user.password);
        if (isMatched) {  // ✅ Correct Condition
            const token = jwt.sign(
                { userId: user._id, email: user.email },  // ✅ Ensure `userId` is included
                process.env.JWT_SECRET,
                { expiresIn: "7d" }
            );            
            return res.json({ success: true, message: 'User logged in successfully', token });
        } else {
            return res.json({ success: false, message: 'Invalid credentials' });
        }

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

    const getProfile = async (req, res) => {
    try {
        console.log("🔍 Extracted userId from request:", req.user?.userId); // ✅ Log userId

        const userId = req.user?.userId;
        if (!userId) {
            return res.status(400).json({ success: false, message: "User ID not found in request" });
        }

        const user = await userModel.findById(userId).select("-password"); // ✅ Exclude password field

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        console.log("✅ Fetched User Profile:", user); // ✅ Log user data
        res.json({ success: true, userData: user });

    } catch (error) {
        console.error("❌ Profile Fetch Error:", error.message);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};


//api to update user profile data
const updateProfile = async (req, res) => {
    try {
        const { name, phone, address, dob, gender } = req.body;
        const imageFile = req.file;
        const userId = req.user.userId; // Ensure you're getting the user ID from middleware

        if (!name || !phone || !dob || !gender || !address) {
            return res.status(400).json({ success: false, message: "Data missing!" });
        }

        // If address is coming as a JSON string, parse it
        let parsedAddress;
        try {
            parsedAddress = typeof address === "string" ? JSON.parse(address) : address;
        } catch (error) {
            return res.status(400).json({ success: false, message: "Invalid address format!" });
        }

        let updatedFields = { name, phone, address: parsedAddress, dob, gender };

        // If an image file is uploaded, upload to Cloudinary and update the image field
        if (imageFile) {
            try {
                const imageUpload = await cloudinary.uploader.upload(imageFile.path, {
                    resource_type: 'image',
                    api_key: process.env.CLOUDINARY_API_KEY,  // Explicit API key
                    api_secret: process.env.CLOUDINARY_SECRET_KEY  // Explicit API secret
                });
                updatedFields.image = imageUpload.secure_url; // ✅ Save the image URL in the database
            } catch (error) {
                console.error('Cloudinary Upload Error:', error);
                return res.status(500).json({ success: false, message: 'Image upload to Cloudinary failed!', error: error.message });
            }
        }

        // Update user fields
        const updatedUser = await userModel.findByIdAndUpdate(
            userId,
            updatedFields,
            { new: true, runValidators: true } // ✅ Return updated document
        );

        if (!updatedUser) {
            return res.status(404).json({ success: false, message: "User not found!" });
        }

        res.json({ success: true, message: "Profile updated successfully", user: updatedUser });

    } catch (error) {
        console.error("Profile Update Error:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};
//api to book appointment
const bookAppointment = async (req, res) => {
  try {
    let { docId, slotDate, slotTime } = req.body;
    let userId = req.user?.userId;

    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
      console.error("❌ Invalid userId:", userId);
      return res.status(400).json({ success: false, message: "Invalid userId" });
    }

    userId = new mongoose.Types.ObjectId(userId);

    const docData = await doctorModel.findById(docId).select("-password");
    if (!docData || !docData.available) {
      return res.status(400).json({ success: false, message: "Doctor is not available for this slot" });
    }

    let slots_booked = docData.slots_booked || {};

    if (slots_booked[slotDate]?.includes(slotTime)) {
      return res.status(400).json({ success: false, message: "Slot not available" });
    }

    slots_booked[slotDate] = [...(slots_booked[slotDate] || []), slotTime];

    const userData = await userModel.findById(userId).select("-password");
    if (!userData) {
      console.error("❌ User not found:", userId);
      return res.status(400).json({ success: false, message: "User not found" });
    }

    const appointmentData = {
      userId,
      docId,
      userData,
      docData,
      amount: docData.fees, // Ensure this is the correct amount
      slotTime,
      slotDate,
      date: Date.now()
    };

    const newAppointment = new appointmentModel(appointmentData);
    await newAppointment.save();

    await doctorModel.findByIdAndUpdate(docId, { slots_booked });

    // Send email notification
    await sendAppointmentNotification(appointmentData);

    res.json({ success: true, message: "Appointment booked successfully" });

  } catch (error) {
    console.error("❌ Appointment Booking Error:", error);
    res.status(500).json({ success: false, message: "Server Error: " + error.message });
  }
};



//api to get user appointments
const listAppointment = async (req, res) => {
    try {
        console.log("🔍 Extracted userId from request:", req.user?.userId); // ✅ Log userId

        let userId = req.user?.userId; // ✅ Extract userId from `authUser` middleware

        if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ success: false, message: "Invalid userId" });
        }

        userId = new mongoose.Types.ObjectId(userId); // ✅ Convert userId to ObjectId
        const appointments = await appointmentModel.find({ userId });

        console.log("✅ Fetched Appointments:", appointments); // ✅ Log fetched appointments

        res.json({ success: true, appointments });

    } catch (error) {
        console.error("❌ Appointment Fetch Error:", error.message);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};
//api to cancel appointment
const cancelAppointment = async (req, res) => {
    try {
        const { appointmentId } = req.body;
        const userId = req.user.userId; // ✅ Get `userId` from auth middleware

        const appointmentData = await appointmentModel.findById(appointmentId);
        if (!appointmentData) {
            return res.status(404).json({ success: false, message: "Appointment not found" });
        }

        console.log("🔍 User ID from Token:", userId);
        console.log("🔍 Appointment User ID:", appointmentData.userId.toString());

        if (appointmentData.userId.toString() !== userId) { // ✅ Convert to string before comparing
            return res.json({ success: false, message: "You are not authorized to cancel this appointment" });
        }

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
//api for payment using stripe
const stripe = Stripe(process.env.STRIPE_SECRET_KEY); // Get secret key from .env

// API to create a payment intent
// In createPaymentIntent controller
const createPaymentIntent = async (req, res) => {
  try {
    const { appointmentId } = req.body;
    const userId = req.user.userId;

    // Fetch appointment with doctor's fees and user details
    const appointment = await appointmentModel.findById(appointmentId)
      .populate('docId', 'name speciality fees')
      .populate('userId', 'name email address');

    if (!appointment) {
      return res.status(404).json({ success: false, message: "Appointment not found" });
    }

    // Convert fees to cents (Stripe requires integers)
    const amountInCents = Math.round(appointment.docId.fees * 100);

    // Create Payment Intent with metadata
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountInCents,
      currency: 'usd',
      description: `Appointment with Dr. ${appointment.docId.name}`,
      metadata: {
        appointmentId: appointment._id.toString(),
        userId: userId.toString(),
        doctorId: appointment.docId._id.toString(),
        doctorName: appointment.docId.name,
        patientName: appointment.userId.name,
      },
      receipt_email: appointment.userId.email,
      shipping: {
        name: appointment.userId.name,
        address: {
          line1: appointment.userId.address?.line1 || '',
          city: appointment.userId.address?.city || '',
          postal_code: appointment.userId.address?.postalCode || '',
          country: 'US'
        }
      }
    });

    res.json({ 
      success: true,
      clientSecret: paymentIntent.client_secret,
      paymentId: paymentIntent.id,
      amount: appointment.docId.fees
    });

  } catch (error) {
    console.error("PaymentIntent error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};
// API to update the appointment after payment is successful
const updateAppointmentPaymentStatus = async (req, res) => {
  try {
    const { appointmentId, stripePaymentId, amountPaid } = req.body;

    const updatedAppointment = await appointmentModel.findByIdAndUpdate(
      appointmentId,
      {
        payment: true,
        isCompleted: true,
        stripePaymentId,
        paymentDetails: {
          amountPaid,
          currency: 'usd',
          paymentDate: new Date()
        }
      },
      { new: true }
    );

    if (!updatedAppointment) {
      return res.status(404).json({ success: false, message: 'Appointment not found' });
    }

    res.json({ success: true, appointment: updatedAppointment });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

 const handleStripeWebhook = async (req, res) => {
  const sig = req.headers['stripe-signature'];
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event;
  try {
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === 'payment_intent.succeeded') {
    const paymentIntent = event.data.object;
    
    try {
      // Validate metadata exists
      if (!paymentIntent.metadata?.appointmentId) {
        throw new Error('Missing appointmentId in metadata');
      }

      // Update database
      await appointmentModel.findByIdAndUpdate(
        paymentIntent.metadata.appointmentId,
        {
          payment: true,
          isCompleted: true,
          stripePaymentId: paymentIntent.id,
          paymentDetails: {
            amountPaid: paymentIntent.amount / 100,
            currency: paymentIntent.currency,
            paymentDate: new Date(paymentIntent.created * 1000),
            receiptUrl: paymentIntent.charges?.data[0]?.receipt_url
          }
        },
        { new: true }
      );
    } catch (error) {
      console.error('Webhook processing error:', error);
      return res.status(400).json({ error: error.message });
    }
  }

  res.json({ received: true });
};


  







export {registerUser,loginUser,getProfile,updateProfile,bookAppointment,listAppointment,cancelAppointment,createPaymentIntent,updateAppointmentPaymentStatus,handleStripeWebhook}