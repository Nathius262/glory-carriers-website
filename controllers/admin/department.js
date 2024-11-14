import pool from '../../config/databaseConfig.js';
import { check, validationResult } from 'express-validator';
import dotenv from 'dotenv';
import cloudinary from '../../config/cloudinaryConfig.js';
import { getPublicIdFromUrl } from '../../utils/utils.js'


dotenv.config()

//render create page
export const renderCreateDepartment = async (req, res) => {
    res.render('./admin/department/create', { pageTitle: "GCMI Admin" })
};

//render create page
export const renderUpdatePage = async (req, res) => {
    const departmentId = req.params.id;

    try {
        // Check if the department exists
        const department = await pool.query('SELECT * FROM departments WHERE id = $1', [departmentId]);


        if (department.rows.length === 0) {
            return res.status(404).json({ message: 'name not found' });
        }

        res.render('./admin/department/update', { department: department.rows[0], pageTitle: "GCMI Admin" })

    } catch (err) {
        console.error('Error:', err.message);
        res.status(500).json({ message: 'Server error' });
    }

};

//create department
export const createdepartment = [
    // Validate input
    [
        check('name', 'Name is required').not().isEmpty(),
        check('department_head', 'HOD is required').not().isEmpty(),
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { name, department_head, department_briefing} = req.body;

        try {
            if (!req.files['image']) {
                return res.status(400).json({
                    success: false,
                    message: 'Missing required files',
                });
            }

            const imageResult = req.files['image'][0];

            const department = await pool.query('SELECT * FROM departments WHERE name = $1', [name]);

            if (department.rows.length) {
                return res.status(400).json({ message: `name with "${name}" already exists` });
            }


            // Create the department and add departments based on the checkbox inputs
            const newRole = await pool.query(
                'INSERT INTO departments (name, image_url, department_head, department_briefing) VALUES ($1, $2, $3, $4) RETURNING *',
                [name, imageResult.path, department_head, department_briefing]
            );

            res.status(201).json({
                message: 'Created successfully',
                redirectTo: "/admin/department",
            });

        } catch (err) {
            console.error('Error:', err.message);
            res.status(500).json(err);
        }
    },
];

//list all department name
export const getAllDepartment = async (req, res) => {
    const { page = 1, limit = 10 } = req.query; // Default to page 1 and limit of 10 department name per page

    const offset = (page - 1) * limit; // Calculate the offset for the SQL query

    try {
        // Query to select the total number of department name
        const totalDepartmentResult = await pool.query('SELECT COUNT(*) FROM departments');
        const totalDepartment = parseInt(totalDepartmentResult.rows[0].count, 10);

        // Query to select department name with pagination
        const result = await pool.query(
            'SELECT id, name, image_url, department_head FROM departments ORDER BY id LIMIT $1 OFFSET $2',
            [limit, offset]
        );

        // Calculate total pages
        const totalPages = Math.ceil(totalDepartment / limit);

        // Return the department name with pagination info
        res.status(200).render('./admin/department/list', {
            success: true,
            page: parseInt(page, 10),
            limit: parseInt(limit, 10),
            totalPages,
            totalDepartment,
            pageTitle: "GCMI Admin",
            departments: result.rows,  // This will contain an array of department objects with their ids, emails, usernames, and departments
        });

    } catch (err) {
        console.error('Error:', err.message);
        res.status(500).json({ message: 'Server error' });
    }
};

//update each department
export const updateDepartment = [
    // Validate input
    [
        check('name', 'Name is required').optional().not().isEmpty(),
        check('department_head', 'HOD is required').optional().not().isEmpty(),
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const image = req.files?.['image'] ? req.files['image'][0].path : null;



        const { name, department_head, department_briefing } = req.body;
        const departmentId = req.params.id;

        try {
            // Check if the department exists
            const department = await pool.query('SELECT * FROM departments name WHERE id = $1', [departmentId]);

            if (department.rows.length === 0) {
                return res.status(404).json({ message: 'Not found' });
            }

            const { image_url: currentImageUrl } = department.rows[0];


            // Check if new image is uploaded and delete the old one from Cloudinary
            if (image && currentImageUrl) {
                await cloudinary.uploader.destroy(getPublicIdFromUrl(currentImageUrl, { resource_type: 'image' }));
            }


            // Prepare the fields to update
            const fieldsToUpdate = {};
            if (name) fieldsToUpdate.name = name;


            // Update the department in the database
            const updatedUser = await pool.query(
                `UPDATE departments 
                    SET name = COALESCE($1, name),
                    image_url = COALESCE($2, image_url),
                    department_head = COALESCE($3, department_head),
                    department_briefing = COALESCE($4, department_briefing)
                    WHERE id = $5
                    RETURNING *`,
                    [name, image,  department_head, department_briefing, departmentId]
                );

            res.status(200).json({
                message: 'User updated successfully',
                department: updatedUser.rows[0],
            });

        } catch (err) {
            console.error('Error:', err.message);
            res.status(500).json({ message: err });
        }
    },
];

//delete department
export const deleteDepartment = async (req, res) => {
    const departmentId = req.params.id;

    try {
        // Check if the department exists
        const department = await pool.query('SELECT * FROM departments WHERE id = $1', [departmentId]);

        if (department.rows.length === 0) {
            return res.status(404).json({ message: 'Name not found' });
        }

        const { image_url: imageUrl } = sermon.rows[0];


        if (imageUrl) {
            const imagePublicId = getPublicIdFromUrl(imageUrl);
            const image = await cloudinary.uploader.destroy(imagePublicId, { resource_type: 'image' }); // Specify the resource type as 'image' for images
        }


        // Delete the department
        await pool.query('DELETE FROM departments WHERE id = $1', [departmentId]);

        res.status(200).json({ message: 'Name deleted successfully', redirectTo: "/admin/department" });

    } catch (err) {
        console.error('Error:', err.message);
        res.status(500).json({ message: 'Server error', err });
    }
};
