const pageNotFound = (req, res, next) => {
    res.status(404).render('./error/404', { url: `${req.protocol}://${req.get('host')}${req.originalUrl}` });
};

const internalServerError = (err, req, res, next) => {
    console.error(err.stack);
    res.status(500).render('./error/500', { message: 'Internal Server Error', error: err.message });
};

export {internalServerError, pageNotFound}