// confirm if the route is an admin
const conditionalRendering = (req, res, next) => {
  res.locals.isAdmin = req.path.startsWith('/admin');
  next();
};


export default conditionalRendering;