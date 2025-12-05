// Input sanitization middleware
exports.sanitizeInput = (req, res, next) => {
  // Remove dangerous characters from inputs
  const sanitize = (obj) => {
    for (let key in obj) {
      if (obj[key] && typeof obj[key] === 'string') {
        // Remove HTML tags and script tags
        obj[key] = obj[key]
          .replace(/<script[^>]*>.*?<\/script>/gi, '')
          .replace(/<[^>]+>/g, '')
          .trim();
      }
    }
  };

  if (req.body) sanitize(req.body);
  if (req.query) sanitize(req.query);
  if (req.params) sanitize(req.params);

  next();
};

// CORS headers middleware
exports.corsHeaders = (req, res, next) => {
  res.header('X-Content-Type-Options', 'nosniff');
  res.header('X-Frame-Options', 'DENY');
  res.header('X-XSS-Protection', '1; mode=block');
  res.header('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  next();
};

// Helmet-like security headers
exports.securityHeaders = (req, res, next) => {
  res.setHeader('Content-Security-Policy', "default-src 'self'");
  res.setHeader('X-Powered-By', 'Express');
  next();
};

// Request logging
exports.requestLogger = (req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl} - ${res.statusCode} (${duration}ms)`);
  });
  next();
};
