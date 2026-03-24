import * as service from '../services/Mentorship.service.js';
import {
  sendEmail,
  mentorshipUserConfirmationTemplate,
  mentorshipPastorNotificationTemplate
} from "../../../utils/email.js";
import dotenv from 'dotenv';

dotenv.config();

export const create = async (req, res) => {
  try {
    const data = await service.create(req.body);

    // 🚀 Respond immediately (primary operation done)
    res.status(201).json({
      success: true,
      message: "Mentorship request submitted successfully",
      emailWarning: false,
      redirectTo: "/mentorship"
    });

    // --- 🔕 Fire-and-forget email sending ---
    (async () => {
      let emailFailed = false;

      // Send to user
      const userEmailRes = await sendEmail({
        to: data.email,
        subject: "Mentorship Request Received",
        html: mentorshipUserConfirmationTemplate(data.full_name)
      });

      if (userEmailRes?.error) emailFailed = true;

      // Send to pastor
      const pastorEmailRes = await sendEmail({
        to: process.env.DEFAULT_PASTOR_EMAIL,
        subject: "New Mentorship Request",
        html: mentorshipPastorNotificationTemplate({
          name: data.full_name,
          email: data.email,
          phone_number: data.phone_number,
          description: data.description
        })
      });

      if (pastorEmailRes?.error) emailFailed = true;

      if (emailFailed) {
        console.warn("⚠️ Mentorship emails failed for:", data.email);
      }

    })().catch(err => {
      console.error("🔥 Async email error:", err.message);
    });

  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};

export const mentorship_form = (req, res) => {
  try {
    res.render('mentorship_form', { pageTitle: 'Mentorship Form' });
  } catch (error) {
    console.log(error);
    res.status(404).render('error/404', { pageTitle: 'Page Not Found' });
  }
}