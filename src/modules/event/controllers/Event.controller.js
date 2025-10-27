import * as rvpService from '../services/Rvp.service.js';
import { sendEmail, kabodRsvpSuccessTemplate } from '../../../utils/email.js';

export const render_event_view = async (req, res) =>{
  try {
    res.status(200).render('event');
  } catch (error) {
    res.status(500).render('errors/500', {error:error.message})
  }
}


export const rvp_event = async (req, res) => {
  try {
    
    const data = await rvpService.create_rvp(req.body);

    await sendEmail({
      to: data.email,
      subject: "✅ Your RSVP for KABOD’25 is Confirmed!",
      html: kabodRsvpSuccessTemplate(data.name),
    });

    res.status(201).json({ 
      success: true, 
      redirectTo: "/event",
      message: 'RVP to event created Successfully', 
    });

  } catch (err) {
    console.error('Create error:', err); // Log for debugging

    res.status(500).json({ 
      success: false, 
      message: 'RVP to event failed',
      error: err.message 
    });
  }
};