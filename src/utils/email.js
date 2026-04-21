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
    secure: true, // true for 465
    auth: {
      user: process.env.ZOHO_USER,
      pass: process.env.ZOHO_PASS,
    },
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

export const zoeRsvpSuccessTemplate = (name) => `
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
        <h1 style="color: #fff; margin: 0; font-size: 24px;">🎉 ZOE CONFERENCE'26 RSVP Confirmed!</h1>
      </div>

      <div style="padding: 30px;">
        <p style="font-size: 16px; margin-bottom: 10px;">Hello <strong>${name}</strong>,</p>

        <p style="font-size: 15px; line-height: 1.6;">
          We’re thrilled to confirm your <strong>successful RSVP</strong> for 
          <strong>ZOE CONFERENCE'26</strong> — a life-transforming conference 
        </p>

        <div style="background-color: #f0f3ff; border-left: 4px solid #2e3192; padding: 15px; margin: 20px 0;">
          <p style="margin: 0; font-size: 15px;">
            📅 <strong>Date:</strong> May 14th – 16th, 2026<br>
            📍 <strong>Venue:</strong> Glory Carriers Ministry Headquarters<br>
            🕓 <strong>Time:</strong> 5PM daily
          </p>
        </div>

        <p style="font-size: 15px; line-height: 1.6;">
          Get ready for three days of worship, word, and divine encounter.
          Come expectant it’s your set time for glory!
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

        <p style="font-size: 14px; color: #555;">See you at <strong>ZOE CONFERENCE'26</strong>!</p>
      </div>

      <div style="background-color: #f5f5f5; padding: 15px; text-align: center; font-size: 13px; color: #999;">
        &copy; 2025 Glory Carriers Ministry Int'l. All rights reserved.<br>
        <a href="https://www.glorycarriersministryintl.org" style="color: #2e3192; text-decoration: none;">glorycarriersministryintl.org</a>
      </div>
    </div>
  </div>
`;

// --- Templates ---
export const passwordResetOtpTemplate = (name, otp) => `
  <div style="font-family: Poppins, sans-serif; background:#f8f9fa; padding:20px;">
    <div style="max-width:600px; margin:auto; background:white; border-radius:8px; padding:20px; border:1px solid #eee;">
      <h2 style="color:#105341;">Password Reset Request</h2>
      <p>Hi ${name},</p>
      <p>You requested to reset your password. Use the OTP below to proceed:</p>
      <div style="background:#defeab; color:#105341; font-size:24px; font-weight:bold; padding:10px; text-align:center; border-radius:6px; letter-spacing:3px;">
        ${otp}
      </div>
      <p style="margin-top:20px;">This OTP is valid for 10 minutes. If you didn’t request this, please ignore this email.</p>
      <p style="color:#212529;">– NexusJs Team</p>
    </div>
  </div>
`;

export const passwordResetSuccessTemplate = (name) => `
  <div style="font-family:Poppins, sans-serif; background:#f8f9fa; padding:20px;">
    <div style="max-width:600px; margin:auto; background:white; border-radius:8px; padding:20px; border:1px solid #eee;">
      <h2 style="color:#105341;">Password Reset Successful</h2>
      <p>Hi ${name},</p>
      <p>Your password has been reset successfully. If this wasn’t you, please contact support immediately.</p>
      <p style="color:#212529;">– NexusJs Team</p>
    </div>
  </div>
`;

export const passwordChangedTemplate = (name) => `
  <div style="font-family:Poppins, sans-serif; background:#f8f9fa; padding:20px;">
    <div style="max-width:600px; margin:auto; background:white; border-radius:8px; padding:20px; border:1px solid #eee;">
      <h2 style="color:#105341;">Password Changed</h2>
      <p>Hi ${name},</p>
      <p>Your password was changed successfully. If this wasn’t you, please <a href="#">reset it immediately</a>.</p>
      <p style="color:#212529;">– NexusJs Team</p>
    </div>
  </div>
`;

export const mentorshipUserConfirmationTemplate = (name) => `
  <div style="font-family:Segoe UI, Arial; background:#f8f9fa; padding:20px;">
    <div style="max-width:600px; margin:auto; background:#fff; padding:25px; border-radius:8px; border:1px solid #eee;">
      
      <h2 style="color:#2e3192;">Mentorship Request Received</h2>

      <p>Hello <strong>${name}</strong>,</p>

      <p>
        We’ve successfully received your mentorship request. 
        Thank you for reaching out to us.
      </p>

      <p>
        Our team will carefully review your submission and the Senior Pastor Prophet Simon Thomas 
        will be notified. You’ll be contacted shortly.
      </p>

      <p style="margin-top:20px;">
        Stay blessed,<br/>
        <strong>Glory Carriers Ministry</strong>
      </p>
    </div>
  </div>
`;

export const mentorshipPastorNotificationTemplate = (data) => `
  <div style="font-family:Segoe UI, Arial; background:#f8f9fa; padding:20px;">
    <div style="max-width:600px; margin:auto; background:#fff; padding:25px; border-radius:8px; border:1px solid #eee;">
      
      <h2 style="color:#2e3192;">New Mentorship Request</h2>

      <p>A new mentorship request has been submitted.</p>

      <hr/>

      <p><strong>Name:</strong> ${data.name}</p>
      <p><strong>Email:</strong> ${data.email}</p>
      <p><strong>Phone:</strong> ${data.phone_number || 'N/A'}</p>
      <p><strong>Message:</strong></p>
      <p style="background:#f1f1f1; padding:10px; border-radius:6px;">
        ${data.description || 'No message provided'}
      </p>

      <hr/>

      <p>Please follow up accordingly.</p>

      <p style="margin-top:20px;">
        – System Notification
      </p>
    </div>
  </div>
`;


export const newMemberWelcomeTemplate = ({
  first_name,
  department_name
}) => {
  return `
    <div style="font-family: Arial, sans-serif; background-color: #f8f9fa; padding: 20px;">
      
      <div style="max-width: 600px; margin: auto; background: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.05);">
        
        <!-- Header -->
        <div style="background-color: #1a3a5f; color: #ffffff; padding: 20px; text-align: center;">
          <h2 style="margin: 0;">Welcome to GCMI</h2>
        </div>

        <!-- Body -->
        <div style="padding: 30px;">
          <h3 style="margin-top: 0;">Hello ${first_name},</h3>

          <p style="line-height: 1.6; color: #333;">
            Your registration was successful, and you have been added as a member of the 
            <strong>${department_name}</strong> department.
          </p>

          <p style="line-height: 1.6; color: #333;">
            We are glad to have you onboard. Stay committed, remain faithful, and be ready to serve diligently.
          </p>

          <p style="line-height: 1.6; color: #333;">
            If you have any questions or need guidance, feel free to reach out to your department leader.
          </p>

          <div style="margin-top: 30px;">
            <p style="margin: 0;">Blessings,</p>
            <p style="margin: 0;"><strong>GCMI Team</strong></p>
          </div>
        </div>

        <!-- Footer -->
        <div style="background-color: #f1f1f1; padding: 15px; text-align: center; font-size: 12px; color: #777;">
          © ${new Date().getFullYear()} GCMI. All rights reserved.
        </div>

      </div>

    </div>
  `;
};