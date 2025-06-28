import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// ✅ Added connection verification
transporter.verify((error) => {
  if (error) {
    console.error('❌ SMTP Connection Failed:', error);
  } else {
    console.log('✅ SMTP Connection Ready');
  }
});

export const sendAppointmentNotification = async (appointmentDetails) => {
  try {
    console.log('=== STARTING EMAIL PROCESS ===');
    console.log('Environment Variables:', {
      EMAIL_HOST: process.env.EMAIL_HOST,
      EMAIL_PORT: process.env.EMAIL_PORT,
      EMAIL_USER: process.env.EMAIL_USER ? '***' : 'MISSING', // Masked for security
      NOTIFICATION_EMAIL: process.env.NOTIFICATION_EMAIL,
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.NOTIFICATION_EMAIL,
      subject: 'New Appointment Booked',
      html: `
        <h2>New Appointment Details</h2>
        <p><strong>Patient:</strong> ${appointmentDetails.userData?.name || 'N/A'}</p>
        <p><strong>Doctor:</strong> ${appointmentDetails.docData?.name || 'N/A'}</p>
        <p><strong>Date:</strong> ${appointmentDetails.slotDate || 'N/A'}</p>
        <p><strong>Time:</strong> ${appointmentDetails.slotTime || 'N/A'}</p>
        <p><strong>Amount:</strong> $${appointmentDetails.amount || '0'}</p>
      `,
    };

    console.log('Mail Options:', {
      from: mailOptions.from,
      to: mailOptions.to,
      subject: mailOptions.subject,
    });

    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Email Sent Successfully!', {
      messageId: info.messageId,
      response: info.response,
    });

    return true;
  } catch (error) {
    console.error('❌ Email Send Error:', {
      name: error.name,
      message: error.message,
      stack: error.stack, // Full error stack for debugging
    });
    return false;
  }
};