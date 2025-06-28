import express from 'express'
import { registerUser,loginUser, getProfile, updateProfile, bookAppointment, listAppointment, cancelAppointment, createPaymentIntent, updateAppointmentPaymentStatus, handleStripeWebhook } from '../controllers/userController.js'
import authUser from '../middlewares/authUser.js'
import upload from '../middlewares/multer.js'

const userRouter = express.Router()

userRouter.post('/register',registerUser)
userRouter.post('/login',loginUser)
userRouter.get('/get-profile',authUser,getProfile)
userRouter.post('/update-profile',upload.single('image'),authUser,updateProfile)
userRouter.post('/book-appointment',authUser,bookAppointment)
userRouter.get('/appointments',authUser,listAppointment)
userRouter.post('/cancel-appointment',authUser,cancelAppointment)
userRouter.post('/create-payment-intent', authUser, createPaymentIntent);
userRouter.post('/update-appointment-payment', authUser, updateAppointmentPaymentStatus);
userRouter.post('/stripe-webhook', express.raw({ type: 'application/json' }), handleStripeWebhook);


export default userRouter