import { authenticate, authorize } from './auth.middleware.js';

const prefixRoleMap = {
  '/admin': ['admin'],
  '/user': ['user'],
  //'/staff': ['staff'],
};

export const authorizeByPrefix = (req, res, next) => {
  const matchedPrefix = Object.keys(prefixRoleMap).find((prefix) => req.originalUrl.startsWith(prefix));

  if (!matchedPrefix) return next(); // public route

  authenticate(req, res, () => {
    const allowedRoles = prefixRoleMap[matchedPrefix];
    authorize(...allowedRoles)(req, res, next);
  });
};
