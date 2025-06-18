const setSection = (section) => (req, res, next) => {
    req.section = section;
    next();
  };
  
export default setSection;