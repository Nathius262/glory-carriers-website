//
export const render_giving_view = async (req, res) => {
  try {
    res.status(200).render('giving')
  } catch (error) {
    res.status(404).render('/errors/404', {error: error.message})
  }
}
