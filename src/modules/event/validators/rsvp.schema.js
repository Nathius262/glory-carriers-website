import { z } from 'zod';

export const rsvpSchema = z.object({
    name: z.string().min(3, 'Name is required').max(100, 'Name must be less than 100 characters'),
    email: z.string().email('Invalid email address').toLowerCase(),
    event_id: z.string().min(1, 'Event ID is required'),
    phone: z.string().min(10, 'Phone number is required').max(20, 'Phone number must be less than 20 characters').optional(),
    state: z.string().min(2, 'State must be at least 2 characters').max(50, 'State must be less than 50 characters').optional(),
    address: z.string().min(5, 'Address must be at least 5 characters').max(200, 'Address must be less than 200 characters').optional(),
    attendance_mode: z.enum(['on_site', 'online'], 'Attendance mode must be either in-person or virtual'),
    gender: z.enum(['male', 'female'], 'Gender must be either male or female'),
}).refine((data) => {
    if (data.attendance_mode === 'on_site') {
        return data.address && data.state;
    }
    return true;
}, 'Address and state are required for on-site attendance');