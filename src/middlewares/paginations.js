// src/middleware/pagination.js

export function withPagination(defaultLimit = 10) {
  return (req, res, next) => {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || defaultLimit;
    const offset = (page - 1) * limit;

    req.pagination = {
      page,
      limit,
      offset,
    };

    next();
  };
}
