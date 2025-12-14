import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

// --- Transporter Setup ---
let transporter;



// If in development, fake transporter (console log only)
if (process.env.NODE_ENV === 'development') {
  transporter = {
    sendMail: async (mailOptions) => {
      console.log('📧 Simulated Email Sent:');
      console.log('To:', mailOptions.to);
      console.log('Subject:', mailOptions.subject);
      console.log('HTML:', mailOptions.html);
      return { accepted: [mailOptions.to], messageId: 'simulated-dev-id' };
    }
  };
} else {
  // Real transporter for production
  transporter = nodemailer.createTransport({
    host: process.env.ZOHO_HOST,
    port: process.env.ZOHO_PORT,
    secure: false, // true for 465
    auth: {
      user: process.env.ZOHO_USER,
      pass: process.env.ZOHO_PASS,
    },
    tls: {
      ciphers: "SSLv3", // optional; STARTTLS will upgrade automatically
    },
  });

  transporter.verify((err, success) => {
    if (err) console.error("❌ SMTP failed:", err);
    else console.log("✅ SMTP connection OK");
  });
}

// --- Generic Email Sender ---
export const sendEmail = async ({ to, subject, html }) => {
  const mailOptions = {
    from: `"GCMI" <${process.env.ZOHO_USER}>`,
    to,
    subject,
    html,
  };

  try {
    return await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("⚠️ Email send failed:", error.message);
    // Don’t throw – just log it and move on
    return { error: true, message: error.message };
  }
};


// --- Templates ---
export const kabodRsvpSuccessTemplate = (name) => `
  <div style="
    font-family: 'Segoe UI', Arial, sans-serif;
    background-color: #f5f7fa;
    padding: 40px 0;
    color: #333;
  ">
    <div style="
      max-width: 600px;
      margin: 0 auto;
      background-color: #ffffff;
      border-radius: 10px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      overflow: hidden;
    ">
      <div style="background-color: #2e3192; padding: 25px; text-align: center;">
        <h1 style="color: #fff; margin: 0; font-size: 24px;">🎉 KABOD’25 RSVP Confirmed!</h1>
      </div>

      <div style="padding: 30px;">
        <p style="font-size: 16px; margin-bottom: 10px;">Hello <strong>${name}</strong>,</p>

        <p style="font-size: 15px; line-height: 1.6;">
          We’re thrilled to confirm your <strong>successful RSVP</strong> for 
          <strong>KABOD’25</strong> — a life-transforming conference 
          themed <em>"Caught up in Glory"</em>.
        </p>

        <div style="background-color: #f0f3ff; border-left: 4px solid #2e3192; padding: 15px; margin: 20px 0;">
          <p style="margin: 0; font-size: 15px;">
            📅 <strong>Date:</strong> November 27th – 29th, 2025<br>
            📍 <strong>Venue:</strong> Glory Carriers Ministry Headquarters<br>
            🕓 <strong>Time:</strong> 5PM daily
          </p>
        </div>

        <p style="font-size: 15px; line-height: 1.6;">
          Get ready for three days of worship, word, and divine encounter.
          Come expectant — it’s your set time for glory!
        </p>

        <div style="text-align: center; margin-top: 25px;">
          <a href="https://www.glorycarriersministryintl.org/event" 
             style="background-color: #2e3192; color: #fff; padding: 12px 25px; text-decoration: none; 
                    border-radius: 6px; font-size: 15px; font-weight: 600;">
            View Event Details
          </a>
        </div>

        <p style="font-size: 14px; margin-top: 30px; color: #777;">
          If you have any questions or updates regarding your RSVP, 
          please contact us at <a href="mailto:glorycarriersministry@gmail.com" style="color: #2e3192; text-decoration: none;">
          glorycarriersministry@gmail.com</a>.
        </p>

        <p style="font-size: 14px; color: #555;">See you at <strong>KABOD’25</strong>!</p>
      </div>

      <div style="background-color: #f5f5f5; padding: 15px; text-align: center; font-size: 13px; color: #999;">
        &copy; 2025 Glory Carriers Ministry Int'l. All rights reserved.<br>
        <a href="https://www.glorycarriersministryintl.org" style="color: #2e3192; text-decoration: none;">glorycarriersministryintl.org</a>
      </div>
    </div>
  </div>
`;
