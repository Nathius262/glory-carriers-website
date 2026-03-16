import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET;

const handleAuthResponse = (req, res, status, message) => {
  const urls = {
    login_url: `${req.protocol}://${req.get("host")}/auth/login`,
    signup_url: `${req.protocol}://${req.get("host")}/auth/signup`,
  };

  const wantsJson =
    req.xhr ||
    (req.get("accept") && req.get("accept").includes("application/json")) ||
    req.path.startsWith("/api");

  if (wantsJson) {
    return res.status(status).json({ message, data: urls });
  }

  // flash message by type
  if (status === 401) req.flash("error", message);
  else if (status === 403) req.flash("warning", message);
  else req.flash("info", message);

  return res.redirect(urls.login_url);
};


// ---------- Authenticate ----------
export const authenticate = (req, res, next) => {
  try {
    let token = req.cookies?.token || req.headers['authorization'];
    if (!token) return handleAuthResponse(req, res, 401, 'No token provided');

    if (token.startsWith('Bearer ')) token = token.slice(7);
    const decoded = jwt.verify(token, JWT_SECRET);

    req.user = decoded; // { id, email, role }
    next();
  } catch {
    return handleAuthResponse(req, res, 401, 'Invalid or expired token');
  }
};

// ---------- Authorize ----------
export const authorize = (...allowedRoles) => (req, res, next) => {
  if (!req.user) return handleAuthResponse(req, res, 401, 'Unauthorized');

  if (!allowedRoles.includes(req.user.role)) {
    return handleAuthResponse(req, res, 403, 'Forbidden: insufficient role');
  }

  next();
};

// ---------- Attach User (global middleware) ----------
export const attachUser = (req, res, next) => {
  try {
    let token = req.cookies?.token || req.headers['authorization'];
    if (!token) {
      req.user = { is_authenticated: false };
      res.locals.user = req.user; // 👈 makes it available in all templates
      return next();
    }

    if (token.startsWith('Bearer ')) token = token.slice(7);

    const decoded = jwt.verify(token, JWT_SECRET);

    req.user = { ...decoded, is_authenticated: true };
    res.locals.user = req.user; // 👈 pass user into template locals
    next();
  } catch (err) {
    req.user = { is_authenticated: false };
    res.locals.user = req.user;
    next();
  }
};

export const requireAuthOrRedirectCookie = (req, res, next) => {
  if (!req.user.is_authenticated) {
    // Store the page they’re trying to view
    res.cookie('redirect_after_auth', req.originalUrl, {
      httpOnly: true,
      maxAge: 10 * 60 * 1000, // 5 min window
      sameSite: 'Strict',
      secure: process.env.NODE_ENV === 'production',
    });
  }
  next(); // continue regardless (don’t block access here)
};