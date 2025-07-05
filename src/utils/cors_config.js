// utils/corsConfig.js
export function getCorsOptions() {
  const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',')
    .map(origin => origin.trim())
    .filter(origin => {
      try {
        new URL(origin); // Validate URL format
        return true;
      } catch {
        return false;
      }
    }) || [];

  return {
    origin: (origin, callback) => {
      // Allow server-to-server requests with no origin
      if (!origin) return callback(null, true);
      
      // Allow all subdomains of your domain
      const originDomain = new URL(origin).hostname.replace(/^www\./, '');
      const isAllowed = allowedOrigins.some(allowed => {
        const allowedDomain = new URL(allowed).hostname.replace(/^www\./, '');
        return originDomain === allowedDomain || 
               originDomain.endsWith(`.${allowedDomain}`);
      });

      isAllowed 
        ? callback(null, true)
        : callback(new Error(`Origin ${origin} not allowed by CORS`));
    },
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    maxAge: 86400, // 24 hours
    credentials: true
  };
}
