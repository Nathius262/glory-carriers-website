export const render_event_view = async (req, res) =>{
  try {
    res.status(200).render('event');
  } catch (error) {
    res.status(500).render('errors/500', {error:error.message})
  }
}