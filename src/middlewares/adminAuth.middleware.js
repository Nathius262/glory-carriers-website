import { verifyToken } from '../modules/auth/services/Auth.service.js';

// Middleware to protect admin routes
export const adminAuthMiddleware = (req, res, next) => {
    const is_admin_route = req.path.startsWith('/admin');
    if (is_admin_route){
        const token = req.cookies.token; // Get token from the 'adminToken' cookie

        if (!token) {
            //res.status(401).json({ message: 'Access Denied: No Token Provided' });
            return res.redirect('/auth/admin/login');

        }

        try {
            const verified = verifyToken(token);

            if (verified.role !== 'admin') {
                return res.status(403).json({ message: 'Access Denied: Not Authorized' });
            }

            req.user = verified; // Attach the user data to the request
            next();
        } catch (error) {

            return res.status(400).redirect('/auth/admin/login') //res.status(400).json({ message: 'Invalid Token' });
        }
    }
    else{
        next();
    }
};
