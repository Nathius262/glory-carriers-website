import { createRateLimiter } from "./rateLimiter.js";

export const strictLimiter = createRateLimiter({
    windowMs: 15 * 60 * 1000,
    max: 20,
    message: "Too many attempts. Try again later.",
});

export const moderateLimiter = createRateLimiter({
    windowMs: 15 * 60 * 1000,
    max: 100,
});

export const looseLimiter = createRateLimiter({
    windowMs: 15 * 60 * 1000,
    max: 300,
});