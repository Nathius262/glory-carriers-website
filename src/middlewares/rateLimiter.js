import rateLimit from "express-rate-limit";

/**
 * Generic rate limiter factory
 * @param {Object} options
 * @param {number} options.windowMs
 * @param {number} options.max
 * @param {string} options.message
 */
export const createRateLimiter = ({
    windowMs = 15 * 60 * 1000, // default 15 mins
    max = 100, // default global limit
    message = "Too many requests, please try again later",
} = {}) => {
    return rateLimit({
        windowMs,
        max,
        standardHeaders: true,
        legacyHeaders: false,

        handler: (req, res) => {
            return res.status(429).json({
                success: false,
                message,
            });
        },
    });
};