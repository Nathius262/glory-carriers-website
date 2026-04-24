import * as rvpService from '../services/Rvp.service.js';
import { findAll as eventService } from '../services/admin.Event.service.js';
import { rsvpSchema } from '../validators/rsvp.schema.js';
import { validate } from '../../../utils/validate.js';

export const render_event_view = async (req, res) => {
  try {
    const events = await eventService({ limit: 1, offset: 0 });
    res.status(200).render('event', { event: events.events[0] });
  } catch (error) {
    res.status(500).render('errors/500', { error: error.message })
  }
}

export const rvp_event = async (req, res) => {
  try {

    // Honeypot check
    if (req.body.website) {
      return res.status(400).json({
        success: false,
        message: 'Bot detected. RSVP failed.',
      });
    }

    const cleanData = validate(rsvpSchema, req.body);
    const data = await rvpService.create_rvp(cleanData);

    // // TEMP: disable RSVP
    // return res.status(400).json({
    //   success: false,
    //   redirectTo: "/event",
    //   message: 'We are currently not accepting RSVPs for this event. Please check back later.',
    // });

    return res.status(201).json({
      success: true,
      redirectTo: "/event",
      message: 'RSVP created successfully',
    });

  } catch (err) {
    console.error('Create error:', err);

    // ✅ HANDLE VALIDATION ERRORS PROPERLY
    if (err.status === 400 && err.errors) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: err.errors
      });
    }

    // ❌ Only real server errors reach here
    return res.status(500).json({
      success: false,
      message: err.message || 'RSVP failed',
    });
  }
};