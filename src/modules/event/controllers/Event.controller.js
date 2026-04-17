import * as rvpService from '../services/Rvp.service.js';
import { findAll as eventService } from '../services/admin.Event.service.js';

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

    const data = await rvpService.create_rvp(req.body);

    res.status(201).json({
      success: true,
      redirectTo: "/event",
      message: 'RVP to event created Successfully',
    });

  } catch (err) {
    console.error('Create error:', err); // Log for debugging

    res.status(500).json({
      success: false,
      message: `${err.message ? err.message : 'RVP to event failed '}`,
      error: err.message
    });
  }
};