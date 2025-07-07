---
title: "Security & Monitoring - Revision Summary"
category: "revision"
difficulty: "advanced"
estimatedReadTime: 10
tags: ["security", "monitoring", "authentication", "authorization", "logging", "observability", "revision"]
lastUpdated: "2024-01-15"
printFriendly: true
---

# Security & Monitoring - Revision Summary

## Authentication & Authorization

### Key Concepts
- **Authentication**: Verifying identity (who you are)
- **Authorization**: Verifying permissions (what you can do)
- **JWT**: JSON Web Tokens for stateless authentication
- **OAuth 2.0**: Authorization framework for third-party access

### JWT Implementation
```javascript
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

// User Registration
const registerUser = async (userData) => {
  const hashedPassword = await bcrypt.hash(userData.password, 12);
  const user = await User.create({
    ...userData,
    password: hashedPassword
  });
  
  const token = jwt.sign(
    { userId: user.id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: '24h' }
  );
  
  return { user: { id: user.id, email: user.email }, token };
};

// Authentication Middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }
  
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
};

// Role-based Authorization
const authorize = (roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }
    
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Insufficient permissions' });
    }
    
    next();
  };
};

// Usage
app.post('/admin/users', authenticateToken, authorize(['admin']), createUser);
```

### OAuth 2.0 Flow
```javascript
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: "/auth/google/callback"
}, async (accessToken, refreshToken, profile, done) => {
  try {
    let user = await User.findOne({ googleId: profile.id });
    
    if (!user) {
      user = await User.create({
        googleId: profile.id,
        name: profile.displayName,
        email: profile.emails[0].value,
        avatar: profile.photos[0].value
      });
    }
    
    return done(null, user);
  } catch (error) {
    return done(error, null);
  }
}));

// Routes
app.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
app.get('/auth/google/callback', 
  passport.authenticate('google', { failureRedirect: '/login' }),
  (req, res) => {
    const token = jwt.sign({ userId: req.user.id }, process.env.JWT_SECRET);
    res.redirect(`/dashboard?token=${token}`);
  }
);
```

## Input Validation & Sanitization

### Data Validation
```javascript
const Joi = require('joi');
const validator = require('validator');

// Schema Validation
const userSchema = Joi.object({
  name: Joi.string().min(2).max(50).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(8).pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])')).required(),
  age: Joi.number().integer().min(18).max(120),
  role: Joi.string().valid('user', 'admin', 'moderator').default('user')
});

const validateUser = (req, res, next) => {
  const { error, value } = userSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ 
      error: 'Validation failed', 
      details: error.details.map(d => d.message) 
    });
  }
  req.validatedData = value;
  next();
};

// SQL Injection Prevention
const getUserById = async (id) => {
  // Bad: Vulnerable to SQL injection
  // const query = `SELECT * FROM users WHERE id = ${id}`;
  
  // Good: Parameterized query
  const query = 'SELECT * FROM users WHERE id = ?';
  return await db.query(query, [id]);
};

// XSS Prevention
const sanitizeInput = (input) => {
  return validator.escape(input); // Escapes HTML characters
};

// CSRF Protection
const csrf = require('csurf');
const csrfProtection = csrf({ cookie: true });
app.use(csrfProtection);

app.get('/form', (req, res) => {
  res.render('form', { csrfToken: req.csrfToken() });
});
```

### Rate Limiting
```javascript
const rateLimit = require('express-rate-limit');
const RedisStore = require('rate-limit-redis');
const redis = require('redis');

const redisClient = redis.createClient();

// Basic Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

// Redis-based Rate Limiting
const distributedLimiter = rateLimit({
  store: new RedisStore({
    sendCommand: (...args) => redisClient.call(...args),
  }),
  windowMs: 15 * 60 * 1000,
  max: 100,
});

// API-specific Rate Limiting
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: (req) => {
    if (req.user && req.user.role === 'premium') {
      return 1000; // Premium users get higher limits
    }
    return 100; // Regular users
  },
  keyGenerator: (req) => {
    return req.user ? req.user.id : req.ip;
  }
});

app.use('/api/', apiLimiter);
```

## Security Headers & HTTPS

### Security Headers
```javascript
const helmet = require('helmet');

app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "https:"],
      scriptSrc: ["'self'"],
      connectSrc: ["'self'", "https://api.example.com"]
    },
  },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  }
}));

// Custom Security Headers
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  next();
});
```

### HTTPS Configuration
```javascript
const https = require('https');
const fs = require('fs');

const options = {
  key: fs.readFileSync('path/to/private-key.pem'),
  cert: fs.readFileSync('path/to/certificate.pem'),
  // Additional security options
  secureProtocol: 'TLSv1_2_method',
  ciphers: 'ECDHE-RSA-AES128-GCM-SHA256:ECDHE-RSA-AES256-GCM-SHA384',
  honorCipherOrder: true
};

https.createServer(options, app).listen(443, () => {
  console.log('HTTPS Server running on port 443');
});

// Redirect HTTP to HTTPS
const http = require('http');
http.createServer((req, res) => {
  res.writeHead(301, { Location: `https://${req.headers.host}${req.url}` });
  res.end();
}).listen(80);
```

## Logging & Monitoring

### Structured Logging
```javascript
const winston = require('winston');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  defaultMeta: { service: 'user-service' },
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' }),
    new winston.transports.Console({
      format: winston.format.simple()
    })
  ],
});

// Request Logging Middleware
const requestLogger = (req, res, next) => {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    logger.info('HTTP Request', {
      method: req.method,
      url: req.url,
      statusCode: res.statusCode,
      duration,
      userAgent: req.get('User-Agent'),
      ip: req.ip,
      userId: req.user?.id
    });
  });
  
  next();
};

// Security Event Logging
const logSecurityEvent = (event, details) => {
  logger.warn('Security Event', {
    event,
    ...details,
    timestamp: new Date().toISOString()
  });
};

// Usage
app.use(requestLogger);

app.post('/login', async (req, res) => {
  try {
    const user = await authenticateUser(req.body);
    logger.info('User Login', { userId: user.id, email: user.email });
    res.json({ success: true, user });
  } catch (error) {
    logSecurityEvent('LOGIN_FAILED', {
      email: req.body.email,
      ip: req.ip,
      error: error.message
    });
    res.status(401).json({ error: 'Authentication failed' });
  }
});
```

### Application Monitoring
```javascript
const prometheus = require('prom-client');

// Create metrics
const httpRequestDuration = new prometheus.Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route', 'status_code']
});

const httpRequestTotal = new prometheus.Counter({
  name: 'http_requests_total',
  help: 'Total number of HTTP requests',
  labelNames: ['method', 'route', 'status_code']
});

const activeConnections = new prometheus.Gauge({
  name: 'active_connections',
  help: 'Number of active connections'
});

// Middleware to collect metrics
const metricsMiddleware = (req, res, next) => {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = (Date.now() - start) / 1000;
    const route = req.route ? req.route.path : req.path;
    
    httpRequestDuration
      .labels(req.method, route, res.statusCode)
      .observe(duration);
      
    httpRequestTotal
      .labels(req.method, route, res.statusCode)
      .inc();
  });
  
  next();
};

// Health Check Endpoint
app.get('/health', (req, res) => {
  const healthCheck = {
    uptime: process.uptime(),
    message: 'OK',
    timestamp: Date.now(),
    memory: process.memoryUsage(),
    cpu: process.cpuUsage()
  };
  
  res.status(200).json(healthCheck);
});

// Metrics Endpoint
app.get('/metrics', (req, res) => {
  res.set('Content-Type', prometheus.register.contentType);
  res.end(prometheus.register.metrics());
});
```

### Error Tracking
```javascript
const Sentry = require('@sentry/node');

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 1.0,
});

// Error Handler Middleware
const errorHandler = (err, req, res, next) => {
  // Log error details
  logger.error('Application Error', {
    error: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method,
    userId: req.user?.id,
    ip: req.ip
  });
  
  // Send to Sentry
  Sentry.captureException(err, {
    user: req.user,
    extra: {
      url: req.url,
      method: req.method,
      body: req.body
    }
  });
  
  // Don't expose internal errors in production
  if (process.env.NODE_ENV === 'production') {
    res.status(500).json({ error: 'Internal Server Error' });
  } else {
    res.status(500).json({ error: err.message, stack: err.stack });
  }
};

app.use(errorHandler);
```

## Quick Reference Cheat Sheet

| Security Aspect | Implementation | Key Points |
|------------------|----------------|------------|
| Authentication | JWT, OAuth 2.0 | Stateless, secure token storage |
| Authorization | RBAC, ABAC | Role/attribute-based access |
| Input Validation | Joi, validator | Sanitize and validate all inputs |
| Rate Limiting | express-rate-limit | Prevent abuse and DoS |
| HTTPS | TLS 1.2+, HSTS | Encrypt data in transit |
| Headers | Helmet.js | CSP, XSS protection |
| Logging | Winston, structured logs | Audit trail, debugging |
| Monitoring | Prometheus, health checks | Performance, availability |

## Common Security Vulnerabilities

### OWASP Top 10 (2021)
1. **Broken Access Control**: Implement proper authorization
2. **Cryptographic Failures**: Use strong encryption, secure storage
3. **Injection**: Parameterized queries, input validation
4. **Insecure Design**: Security by design principles
5. **Security Misconfiguration**: Secure defaults, regular updates
6. **Vulnerable Components**: Dependency scanning, updates
7. **Authentication Failures**: Strong passwords, MFA
8. **Software Integrity Failures**: Code signing, secure CI/CD
9. **Logging Failures**: Comprehensive logging, monitoring
10. **Server-Side Request Forgery**: Input validation, allowlists

### Prevention Strategies
```javascript
// 1. SQL Injection Prevention
const query = 'SELECT * FROM users WHERE email = ? AND status = ?';
const results = await db.query(query, [email, 'active']);

// 2. XSS Prevention
const sanitizedInput = validator.escape(userInput);
const cleanHtml = DOMPurify.sanitize(htmlContent);

// 3. CSRF Prevention
app.use(csrf({ cookie: { httpOnly: true, secure: true } }));

// 4. Command Injection Prevention
const { execSync } = require('child_process');
// Bad: execSync(`ls ${userInput}`);
// Good: Use allowlist and validation
const allowedCommands = ['ls', 'pwd', 'date'];
if (allowedCommands.includes(command)) {
  execSync(command);
}
```

## Monitoring Best Practices

### Key Metrics to Track
- **Response Time**: 95th percentile < 200ms
- **Error Rate**: < 1% of requests
- **Throughput**: Requests per second
- **CPU Usage**: < 80% average
- **Memory Usage**: Monitor heap and RSS
- **Database Performance**: Query time, connection pool
- **Security Events**: Failed logins, suspicious activity

### Alerting Strategy
```javascript
// Alert Configuration
const alerts = {
  highErrorRate: {
    condition: 'error_rate > 5%',
    duration: '5m',
    severity: 'critical'
  },
  highResponseTime: {
    condition: 'response_time_p95 > 1s',
    duration: '10m',
    severity: 'warning'
  },
  securityEvent: {
    condition: 'failed_logins > 10',
    duration: '1m',
    severity: 'high'
  }
};
```

## Common Interview Questions

1. **Authentication vs Authorization**: Explain the difference and implementation
2. **JWT Security**: Pros, cons, and best practices
3. **OWASP Top 10**: Common vulnerabilities and prevention
4. **Rate Limiting**: Strategies and implementation
5. **Logging Strategy**: What to log and how to structure logs
6. **Monitoring**: Key metrics and alerting strategies
7. **HTTPS**: Implementation and security considerations
8. **Input Validation**: Techniques and tools

## Security Checklist

- [ ] Use HTTPS everywhere
- [ ] Implement proper authentication
- [ ] Validate and sanitize all inputs
- [ ] Use parameterized queries
- [ ] Implement rate limiting
- [ ] Set security headers
- [ ] Log security events
- [ ] Monitor application metrics
- [ ] Keep dependencies updated
- [ ] Use environment variables for secrets
- [ ] Implement proper error handling
- [ ] Regular security audits