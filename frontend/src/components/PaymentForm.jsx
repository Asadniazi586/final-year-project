import React, { useState } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import axios from 'axios';
import { toast } from 'react-toastify';

const PaymentForm = ({ amount, appointmentId, clientSecret, onSuccess }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');

const handleSubmit = async (e) => {
  e.preventDefault();
  if (!stripe || !elements) {
    toast.error("Payment system not ready");
    return;
  }

  setIsProcessing(true);

  try {
    // Confirm card payment
    const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: elements.getElement(CardElement),
        billing_details: { name, email }
      },
      receipt_email: email,
    });

    if (error) throw error;

    // Verify amount matches exactly
    const expectedAmount = Math.round(amount * 100);
    if (paymentIntent.amount !== expectedAmount) {
      throw new Error(`Payment amount mismatch. Expected $${amount}, got $${paymentIntent.amount/100}`);
    }

    // Update backend
    const { data } = await axios.post(
      `${import.meta.env.VITE_BACKEND_URL}/api/user/update-appointment-payment`,
      {
        appointmentId,
        stripePaymentId: paymentIntent.id,
        amountPaid: amount,
        receiptUrl: paymentIntent.charges?.data[0]?.receipt_url
      },
      { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
    );

    if (!data?.success) {
      throw new Error("Failed to verify payment with server");
    }

    toast.success('Payment successful!');
    onSuccess();

  } catch (error) {
    console.error("Payment error:", error);
    toast.error(error.message || "Payment failed");
  } finally {
    setIsProcessing(false);
  }
};

  return (
    <form onSubmit={handleSubmit} className="space-y-1">
      {/* Payment Summary Section */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <h2 className="text-lg font-semibold text-gray-800">Appointment Summary</h2>
        <div className="mt-3 space-y-3">
          <div className="flex justify-between">
            <span className="text-gray-600">Consultation Fee</span>
            <span className="font-medium">${amount.toFixed(2)}</span>
          </div>
          <div className="border-t border-gray-200 pt-2 flex justify-between">
            <span className="text-gray-800 font-semibold">Total Amount</span>
            <span className="text-indigo-600 font-bold">${amount.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* Payment Details Section */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-gray-800">Payment Information</h2>
        
        {/* Email Input */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Email Address
          </label>
          <input
            type="email"
            id="email"
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="your@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        {/* Card Details */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Card Information
          </label>
          <div className="border border-gray-300 rounded-md p-3 bg-white">
            <CardElement
              options={{
                style: {
                  base: {
                    fontSize: '16px',
                    color: '#424770',
                    '::placeholder': {
                      color: '#aab7c4',
                    },
                    ':-webkit-autofill': {
                      color: '#fce883',
                    },
                  },
                  invalid: {
                    color: '#9e2146',
                  },
                },
              }}
            />
          </div>
        </div>

        {/* Cardholder Name */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            Cardholder Name
          </label>
          <input
            type="text"
            id="name"
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Name on card"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        className="w-full bg-indigo-600 text-white py-3 px-4 rounded-md hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        disabled={isProcessing || !stripe}
      >
        {isProcessing ? (
          <span className="flex items-center justify-center">
            <svg className="animate-spin h-5 w-5 mr-2 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Processing Payment...
          </span>
        ) : `Pay $${amount.toFixed(2)}`}
      </button>

      {/* Security Notice */}
      <p className="text-xs text-gray-500 text-center">
        Your payment is secured with 256-bit SSL encryption. We don't store your card details.
      </p>
    </form>
  );
};

export default PaymentForm;