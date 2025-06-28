import React, { useState, useContext, useEffect } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { AppContext } from "../context/AppContext";
import PaymentForm from "../components/PaymentForm";
import axios from "axios";
import { toast } from "react-toastify";

// Load Stripe once
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const MyAppointments = () => {
  const { backendUrl, token, getDoctorsData } = useContext(AppContext);
  const [appointments, setAppointments] = useState([]);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [loading, setLoading] = useState(false);
  const [clientSecret, setClientSecret] = useState(null);
  const months = ["", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  const slotDateFormat = (slotDate) => {
    const dateArray = slotDate.split('_');
    return dateArray[0] + " " + months[Number(dateArray[1])] + " " + dateArray[2];
  };

  const getUserAppointments = async () => {
    try {
      if (!token) {
        toast.error("Session expired. Please log in again.");
        return;
      }

      const response = await axios.get(`${backendUrl}/api/user/appointments`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const { success, appointments } = response.data;
      if (success && Array.isArray(appointments)) {
        setAppointments(appointments.reverse());
      } else {
        toast.error(response.data.message || "Failed to fetch appointments.");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch appointments.");
    }
  };

  const handlePayOnline = async (appointment) => {
  setLoading(true);
  try {
    const response = await axios.post(
      `${backendUrl}/api/user/create-payment-intent`,
      { 
        appointmentId: appointment._id // Only send appointment ID
      },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    setClientSecret(response.data.clientSecret);
    setSelectedAppointment(appointment);
  } catch (error) {
    console.error("Payment error:", error.response?.data || error);
    toast.error(error.response?.data?.message || "Payment failed");
  } finally {
    setLoading(false);
  }
};
  

  const cancelAppointment = async (appointmentId) => {
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/user/cancel-appointment`,
        { appointmentId },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (data.success) {
        toast.success(data.message);
        getUserAppointments();
        getDoctorsData();
      } else {
        toast.error(data.message || "Failed to cancel appointment.");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to cancel appointment.");
    }
  };

  useEffect(() => {
    if (token) getUserAppointments();
  }, [token]);

  return (
    <div>
      <p className="pb-3 mt-12 font-medium text-zinc-700 border-b">My Appointments</p>
      <div>
        {appointments.length > 0 ? (
          appointments.map((item, index) => (
            <div className="grid grid-cols-[1fr_3fr] gap-4 sm:flex sm:gap-6 py-2 border-b" key={item._id || index}>
              <div>
                <img
                  className="w-30 rounded-full aspect-square object-cover bg-indigo-50"
                  src={item.docData?.image || "/default-avatar.png"}
                  alt={item.docData?.name || "Doctor"}
                />
              </div>
              <div className="flex-1 text-sm text-zinc-600">
                <p className="text-neutral-800 font-semibold">{item.docData?.name || "Unknown Doctor"}</p>
                <p>{item.docData?.speciality || "Speciality not available"}</p>
                <p className="text-zinc-700 font-medium mt-1">Date & Time:</p>
                <p className="text-xs">{slotDateFormat(item.slotDate)} | {item.slotTime || "N/A"}</p>
              </div>
              <div className="flex flex-col gap-2 justify-end">
                {item.payment && item.isCompleted && (
                  <button className="sm:min-w-48 py-2 border border-green-500 rounded text-green-500">
                    Paid
                  </button>
                )}
                {!item.cancelled && !item.payment && !item.isCompleted && (
                  <>
                    <button
                      className="text-sm text-stone-500 sm:min-w-48 py-2 border rounded hover:bg-[#5f6FFF] hover:text-white transition-all"
                      onClick={() => handlePayOnline(item)}
                    >
                      {loading && selectedAppointment?._id === item._id ? "Loading..." : "Pay Online"}
                    </button>
                    <button
                      onClick={() => cancelAppointment(item._id)}
                      className="text-sm text-stone-500 sm:min-w-48 py-2 border rounded hover:bg-red-600 hover:text-white transition-all"
                    >
                      Cancel appointment
                    </button>
                  </>
                )}
                {item.cancelled && !item.isCompleted && (
                  <button className="text-sm text-red-500 sm:min-w-48 py-2 border rounded">
                    Appointment cancelled
                  </button>
                )}
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500 mt-4">No appointments found.</p>
        )}
      </div>

      {/* Stripe Payment Modal */}
      {selectedAppointment && clientSecret && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full relative">
            <h2 className="text-lg font-semibold mb-4">Pay ${selectedAppointment.amount}</h2>
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-black"
              onClick={() => {
                setSelectedAppointment(null);
                setClientSecret(null);
              }}
            >
              ✕
            </button>
            <Elements stripe={stripePromise} options={{ clientSecret }}>
              <PaymentForm
                appointmentId={selectedAppointment._id}
                onSuccess={() => {
                  setSelectedAppointment(null);
                  setClientSecret(null);
                  getUserAppointments();
                  getDoctorsData();
                }}
                amount={selectedAppointment.amount} // ✅ Pass the amount here
                clientSecret={clientSecret}         // ✅ Optional: pass explicitly if needed
              />
            </Elements>

          </div>
        </div>
      )}
    </div>
  );
};

export default MyAppointments;