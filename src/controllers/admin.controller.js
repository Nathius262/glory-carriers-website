import { getDashboardData } from "../services/admin.services.js";

export const dashboard_view = async (req, res) => {
    try {

        const dashboard = await getDashboardData();

        return res.render('./admins/dashboard', {
            pageTitle: 'Dashboard',
            layout: 'admin',

            stats: dashboard.stats,

            users: dashboard.data.users,
            sermons: dashboard.data.sermons,
            events: dashboard.data.events,
            rsvps: dashboard.data.rsvps,
            departments: dashboard.data.departments,
            nowwords: dashboard.data.nowwords,
            zoeRecords: dashboard.data.zoeRecords
        });

    } catch (error) {
        console.log(error);
        return res.render('error/500', { error: error.message });
    }
};