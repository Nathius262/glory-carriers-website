import pool from '../config/databaseConfig.js';

export async function searchSermon (req) {
    const searchTerm = req.query.search || '';
    const sermonPage = parseInt(req.query.sermonPage) || 1;
    const itemsPerPage = parseInt(req.query.itemsPerPage) || 1;
    const offset = (sermonPage - 1) * itemsPerPage;

    const sermonResult = await pool.query(
    `
    SELECT * FROM sermons 
    WHERE title ILIKE $1
    ORDER BY date DESC 
    LIMIT $2 OFFSET $3
    `,
    [`%${searchTerm}%`, itemsPerPage, offset]
    );

    const totalSermonResult = await pool.query(
    `
    SELECT COUNT(*) FROM sermons 
    WHERE title ILIKE $1
    `,
    [`%${searchTerm}%`]
    );

    const totalSermonItems = parseInt(totalSermonResult.rows[0].count);
    const totalSermonPages = Math.ceil(totalSermonItems / itemsPerPage);
    return {
        sermons: sermonResult.rows,
        sermonCurrentPage: sermonPage,
        totalSermonPages: totalSermonPages,
        itemsPerPage: itemsPerPage,
        searchTerm: searchTerm // Pass the search term back to the template
    }
}

export async function searchZoeRecord (req) {
    const searchTerm = req.query.search || '';
    const recordPage = parseInt(req.query.recordPage) || 1;
    const itemsPerPage = parseInt(req.query.itemsPerPage) || 12;
    const offset = (recordPage - 1) * itemsPerPage;

    const recordResult = await pool.query(
    `
    SELECT * FROM zoe_record 
    WHERE title ILIKE $1
    ORDER BY date DESC 
    LIMIT $2 OFFSET $3
    `,
    [`%${searchTerm}%`, itemsPerPage, offset]
    );

    const totalRecordResult = await pool.query(
    `
    SELECT COUNT(*) FROM zoe_record 
    WHERE title ILIKE $1
    `,
    [`%${searchTerm}%`]
    );

    const totalRecordItems = parseInt(totalRecordResult.rows[0].count);
    const totalRecordPages = Math.ceil(totalRecordItems / itemsPerPage);
    return {
        records: recordResult.rows,
        recordCurrentPage: recordPage,
        totalRecordPages: totalRecordPages,
        itemsPerPage: itemsPerPage,
        searchTerm: searchTerm // Pass the search term back to the template
    }
}

export async function searchNowword (req) {
    const searchTerm = req.query.search || '';
    const nowwordPage = parseInt(req.query.nowwordPage) || 1;
    const itemsPerPage = parseInt(req.query.itemsPerPage) || 12;
    const offset = (nowwordPage - 1) * itemsPerPage;

    const nowwordResult = await pool.query(
    `
    SELECT * FROM nowword 
    WHERE title ILIKE $1
    ORDER BY date DESC 
    LIMIT $2 OFFSET $3
    `,
    [`%${searchTerm}%`, itemsPerPage, offset]
    );

    const totalNowwordResult = await pool.query(
    `
    SELECT COUNT(*) FROM nowword 
    WHERE title ILIKE $1
    `,
    [`%${searchTerm}%`]
    );

    const totalNowwordItems = parseInt(totalNowwordResult.rows[0].count);
    const totalNowwordPages = Math.ceil(totalNowwordItems / itemsPerPage);
    return {
        nowwords: nowwordResult.rows,
        nowwordCurrentPage: nowwordPage,
        totalNowwordPages: totalNowwordPages,
        itemsPerPage: itemsPerPage,
        searchTerm: searchTerm // Pass the search term back to the template
    }
}