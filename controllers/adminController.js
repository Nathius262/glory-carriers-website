import { verifyToken, isAdmin } from '../middlewares/auth.js';


export const renderAdminDashboard = [
    verifyToken,
    isAdmin,
    async (req, res) => {
        try {
            res.render('./admin/admin');
        } catch (error) {
            res.status(404).send('page not found');
        }
    }
];
