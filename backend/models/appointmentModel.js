import mongoose from "mongoose";

const appointmentSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // ✅ Use ObjectId
    docId: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor', required: true }, // ✅ Ensure docId is also an ObjectId
    slotDate: { type: String, required: true },
    slotTime: { type: String, required: true },
    userData: { type: Object, required: true },
    docData: { type: Object, required: true },
    amount: { type: Number, required: true },
    date: { type: Number, required: true },
    cancelled: { type: Boolean, default: false },
    payment: { type: Boolean, default: false },
    isCompleted: { type: Boolean, default: false },
    stripePaymentId: { type: String },
    payment: { type: Boolean, default: false },
  isCompleted: { type: Boolean, default: false },
  stripePaymentId: String,
  paymentDetails: {
    amountPaid: Number,
    currency: String,
    paymentDate: Date,
    receiptUrl: String
  },
});

const appointmentModel = mongoose.models.appointment || mongoose.model('appointment', appointmentSchema);
export default appointmentModel;
