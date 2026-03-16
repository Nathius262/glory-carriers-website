export const active_page = (req, res, next) => {
  res.locals.activePage = req.path.split("/")[1] || "home"; 
  next();
};
