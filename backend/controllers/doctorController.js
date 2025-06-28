import doctorModel from "../models/doctormodel.js";
import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken'
import appointmentModel from "../models/appointmentModel.js";
const changeAvailability = async (req,res)=>{
    try {
      const {docId} = req.body
      const docData = await doctorModel.findById(docId)
      await doctorModel.findByIdAndUpdate(docId,{available: !docData.available})
      res.json({success:true,message:'Availability Changed'})  
    } catch (error) {
        console.error("Server Error:", error);
        res.status(500).json({ success: false, message: error.message }); 
    }
}

const doctorList = async (req,res)=>{
  try {
    const doctors = await doctorModel.find().select(['-password','-email'])
    res.json({success:true,doctors})
  } catch (error) {
    console.error("Server Error:", error);
    res.status(500).json({ success: false, message: error.message }); 
  }
}
//api for doctor login
const loginDoctor = async (req,res)=>{
    try {
      const {email,password} = req.body
      const doctor = await doctorModel.findOne({email})
      if(!doctor){
        return res.status(404).json({success:false,message:'Doctor not found'})
      }
      const isMatch = await bcrypt.compare(password,doctor.password)
      if (isMatch) {
        const token = jwt.sign({id:doctor._id},process.env.JWT_SECRET)
        res.json({success:true,message:'Logged in',token})
      }else{
        res.status(401).json({success:false,message:'Invalid credentials'})
      }
    } catch (error) {
        console.error("Server Error:", error);
        res.status(500).json({ success: false, message: error.message }); 
    }
}
//api to get doctor appointments from admin panel
const appointmentsDoctor = async (req, res) => {
  try {
    const docId = req.doc.docId; // ✅ FIXED: direct access

    const appointments = await appointmentModel.find({ docId });

    res.json({ success: true, appointments });
  } catch (error) {
    console.error("Server Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};
// API to mark appointment as completed for doctor panel
const appointmentComplete = async (req, res) => {
  try {
    const docId = req.doc.docId;
    const { appointmentId } = req.body;

    const appointmentData = await appointmentModel.findById(appointmentId);
    if (appointmentData && appointmentData.docId.toString() === docId) {
      const updatedAppointment = await appointmentModel.findByIdAndUpdate(
        appointmentId,
        { isCompleted: true },
        { new: true } // optional: to return the updated doc
      );
      return res.json({
        success: true,
        message: "Appointment completed",
        appointment: updatedAppointment,
      });
    } else {
      return res
        .status(404)
        .json({ success: false, message: "Appointment not found" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
};
// API to cancel appointment as completed for doctor panel
const appointmentCancel = async (req, res) => {
  try {
    const docId = req.doc.docId;
    const { appointmentId } = req.body;

    const appointmentData = await appointmentModel.findById(appointmentId);
    if (appointmentData && appointmentData.docId.toString() === docId) {
      const updatedAppointment = await appointmentModel.findByIdAndUpdate(
        appointmentId,
        { cancelled: true },
        { new: true } // optional: to return the updated doc
      );
      return res.json({
        success: true,
        message: "Appointment Cancelled",
        appointment: updatedAppointment,
      });
    } else {
      return res
        .status(404)
        .json({ success: false, message: "Cancellation Failed" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

//api to get dashboard data for doctor panel
   const doctorsDashboard = async (req,res)=>{
    try {
    const docId = req.doc.docId;
    const appointments = await appointmentModel.find({ docId });
    let earnings = 0
    appointments.map((item)=>{
      if(item.isCompleted || item.payment){
        earnings += item.amount
      }
    })
    let patients = []
    appointments.map((item)=>{
      if(!patients.includes(item.userId)){
        patients.push(item.userId)
      }
    })
    const dashData = {
      earnings,
      appointments: appointments.length,
      patients: patients.length,
      latestAppointments: appointments.reverse().slice(0,5)
    }
    res.json({success:true,dashData})
    } catch (error) {
      console.log(error);
      res.status(500).json({ success: false, message: error.message });
    }
   }
   //api to get doctor profile data for doctor panel
   const doctorProfile = async (req,res)=>{
    try {
      const docId = req.doc.docId;
      const doctor = await doctorModel.findById(docId).select('-password')
      res.json({success:true,doctor})
    } catch (error) {
      console.log(error);
      res.status(500).json({ success: false, message: error.message });
    }
   }
   //api to update doctor profile data for doctor panel
   const doctorProfileUpdate = async (req,res)=>{
    try {
      const docId = req.doc.docId;
      const {fees,address,available} = req.body
      await doctorModel.findByIdAndUpdate(docId,{fees,address,available})
      res.json({success:true,message:'Profile Updated'})
    }
    catch (error) {
      console.log(error);
      res.status(500).json({ success: false, message: error.message });
    }
    }

export {changeAvailability,doctorList,loginDoctor,appointmentsDoctor,appointmentCancel,appointmentComplete,doctorsDashboard,doctorProfile,doctorProfileUpdate}