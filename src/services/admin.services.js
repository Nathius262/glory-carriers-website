import db from '../models/index.cjs';

const {
    User,
    Sermon,
    Event,
    Rvp,
    Department,
    Nowword,
    ZoeRecord,
    Profile
} = db;

export const getDashboardData = async () => {
    try {

        /* -------------------- COUNTS -------------------- */
        const [
            totalUsers,
            totalSermons,
            totalEvents,
            totalRsvps,
            totalDepartments,
            totalNowwords,
            totalZoeRecords
        ] = await Promise.all([
            User.count(),
            Sermon.count(),
            Event.count(),
            Rvp.count(),
            Department.count(),
            Nowword.count(),
            ZoeRecord.count()
        ]);

        /* -------------------- RECENT DATA -------------------- */
        const [
            users,
            sermons,
            events,
            rsvps,
            departments,
            nowwords,
            zoeRecords
        ] = await Promise.all([

            User.findAll({
                limit: 5,
                order: [['createdAt', 'DESC']],
                include: [
                    {
                        model: Profile,
                        as: 'profile',
                        attributes: ['first_name', 'last_name']
                    }
                ]
            }),

            Sermon.findAll({
                limit: 5,
                order: [['createdAt', 'DESC']],
                attributes: ['id', 'title', 'slug']
            }),

            Event.findAll({
                limit: 5,
                order: [['start_date', 'DESC']],
                attributes: ['id', 'title', 'start_date', 'is_headline']
            }),

            Rvp.findAll({
                limit: 5,
                order: [['createdAt', 'DESC']],
                include: [
                    {
                        model: Event,
                        as: 'event',
                        attributes: ['title']
                    }
                ]
            }),

            Department.findAll({
                limit: 5,
                order: [['createdAt', 'DESC']],
                attributes: ['id', 'name']
            }),

            Nowword.findAll({
                limit: 5,
                order: [['createdAt', 'DESC']],
                attributes: ['id', 'title']
            }),

            ZoeRecord.findAll({
                limit: 5,
                order: [['createdAt', 'DESC']],
                attributes: ['id', 'title']
            })

        ]);

        return {
            stats: {
                totalUsers,
                totalSermons,
                totalEvents,
                totalRsvps,
                totalDepartments,
                totalNowwords,
                totalZoeRecords
            },

            data: {
                users,
                sermons,
                events,
                rsvps,
                departments,
                nowwords,
                zoeRecords
            }
        };

    } catch (error) {
        throw error;
    }
};