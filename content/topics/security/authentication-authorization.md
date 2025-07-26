---
title: "Authentication and Authorization in Web Applications"
category: "security"
difficulty: "intermediate"
estimatedReadTime: 30
tags: ["security", "authentication", "authorization", "jwt", "oauth", "api-security"]
lastUpdated: "2024-07-26"
---

# Authentication and Authorization in Web Applications

## Introduction

Authentication and authorization are fundamental pillars of web application security. While often used interchangeably, they represent distinct but complementary processes crucial for securing user data and controlling access to resources.

## Core Concepts

### Authentication

Authentication is the process of verifying who a user is. It confirms the identity of an individual or entity trying to access a system.

### Common Authentication Methods

1.  **Password-based Authentication**: Users provide a username and password. The password should be hashed and salted before storage.
2.  **Multi-Factor Authentication (MFA)**: Requires two or more verification factors to gain access to an account.
3.  **OAuth 2.0**: An authorization framework that enables applications to obtain limited access to user accounts on an HTTP service.
4.  **OpenID Connect (OIDC)**: An identity layer on top of OAuth 2.0, allowing clients to verify the identity of the end-user based on authentication performed by an Authorization Server.
5.  **JSON Web Tokens (JWT)**: A compact, URL-safe means of representing claims to be transferred between two parties. Often used for stateless authentication.

### JSON Web Tokens (JWT) Overview

JWTs consist of three parts, separated by dots (`.`): Header, Payload, and Signature.

*   **Header**: Typically consists of two parts: the type of the token (JWT) and the signing algorithm (e.g., HMAC SHA256 or RSA).
*   **Payload**: Contains the claims. Claims are statements about an entity (typically, the user) and additional data.
*   **Signature**: Used to verify that the sender of the JWT is who it says it is and to ensure that the message hasn't been tampered with.

```javascript
// Example of a decoded JWT payload
{
  "sub": "1234567890",
  "name": "John Doe",
  "iat": 1516239022,
  "exp": 1516242622 // Expiration time
}
```

## Authorization

Authorization is the process of determining what a user is allowed to do. Once a user's identity is authenticated, authorization decides their access rights to specific resources or functionalities.

### Common Authorization Models

1.  **Role-Based Access Control (RBAC)**: Permissions are granted to roles, and users are assigned to roles. Simplifies management for large systems.
2.  **Attribute-Based Access Control (ABAC)**: Access is granted based on attributes (characteristics) of the user, resource, action, and environment. More fine-grained control.
3.  **Access Control Lists (ACLs)**: Directly assigns permissions to individual users or groups for specific resources. Can become complex in large systems.

## Implementation Considerations

### Server-side Authentication (Example with JWT in Node.js/Express)

```javascript
// Example: JWT Issuance (Login)
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  // 1. Find user in database
  const user = await User.findOne({ username });
  if (!user) {
    return res.status(400).send('Invalid credentials');
  }
  // 2. Compare password
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(400).send('Invalid credentials');
  }
  // 3. Generate JWT
  const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
  res.json({ token });
});

// Example: JWT Verification Middleware
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token == null) return res.sendStatus(401); // Unauthorized

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403); // Forbidden
    req.user = user; // Attach user payload to request
    next();
  });
}

// Example: Authorization Middleware (RBAC)
function authorizeRoles(roles) {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).send('Forbidden: Insufficient permissions');
    }
    next();
  };
}

// Protected route
app.get('/admin/dashboard', authenticateToken, authorizeRoles(['admin']), (req, res) => {
  res.send('Welcome to the Admin Dashboard!');
});
```

## Security Best Practices

*   **Secure Password Storage**: Always hash and salt passwords (e.g., bcrypt).
*   **HTTPS Everywhere**: Encrypt all communication.
*   **Input Validation**: Prevent injection attacks (SQL, XSS).
*   **Rate Limiting**: Protect against brute-force attacks.
*   **Session Management**: Secure session IDs, use short session lifetimes.
*   **Token Revocation**: Implement mechanisms to revoke JWTs if compromised.
*   **Least Privilege**: Grant users only the minimum necessary permissions.
*   **Logging and Monitoring**: Track authentication and authorization attempts.

## Interview Questions & Answers

### Question 1: What is the difference between authentication and authorization?
**Difficulty**: Junior
**Category**: Security

**Answer**:
*   **Authentication**: Verifies *who* you are (e.g., username/password, fingerprint).
*   **Authorization**: Determines *what* you are allowed to do after you've been authenticated (e.g., access to specific files, read/write permissions).

### Question 2: How do JSON Web Tokens (JWT) work for authentication?
**Difficulty**: Intermediate
**Category**: Security

**Answer**: JWTs are self-contained tokens that carry claims about a user. After successful authentication, the server generates a JWT, signs it with a secret, and sends it to the client. The client stores the JWT and sends it with subsequent requests. The server then verifies the signature of the JWT to ensure its authenticity and integrity, and extracts the claims (e.g., user ID, roles) to authorize the request. JWTs are stateless because the server doesn't need to store session information.

### Question 3: How do you handle JWT token revocation and refresh tokens?
**Difficulty**: Advanced
**Category**: JWT Security

**Answer**:
*   **Token Revocation (for short-lived access tokens)**: Since JWTs are stateless, direct revocation is not straightforward. Common strategies include:
    1.  **Blacklisting/Denylisting**: Store revoked tokens in a database (e.g., Redis) or cache. Every request checks this list, adding overhead.
    2.  **Short Expiration Times**: Issue access tokens with very short lifespans (e.g., 5-15 minutes). This limits the window of vulnerability for compromised tokens.
    3.  **Change User Passwords**: If a user's password changes, invalidate all existing tokens issued before the change by updating a "password last changed" timestamp in the user's record and including it in the token payload.
*   **Refresh Tokens**: Used to obtain new, short-lived access tokens without requiring the user to re-authenticate.
    1.  **Long-lived, Secure Storage**: Refresh tokens are typically long-lived (e.g., days, weeks) and should be stored securely on the client-side (e.g., HTTP-only cookie) and server-side (database).
    2.  **One-Time Use or Rotation**: For enhanced security, refresh tokens can be designed for one-time use (each use generates a new refresh token) or rotated.
    3.  **Revocation**: Refresh tokens can be revoked directly from the server-side store if compromised or on logout.

### Question 4: Explain OAuth 2.0 flows. When would you use Authorization Code Flow with PKCE?
**Difficulty**: Advanced
**Category**: OAuth 2.0

**Answer**: OAuth 2.0 is an authorization framework that defines several "flows" (grant types) for different client types and use cases.

**Common Flows**:
1.  **Authorization Code Flow**: Most secure. Used by confidential clients (servers, web apps with backend) and public clients (SPAs, mobile apps). Involves exchanging an authorization code for an access token.
2.  **Client Credentials Flow**: Used by applications to access resources on their own behalf (machine-to-machine communication).
3.  **Implicit Flow (Deprecated)**: Used by public clients (SPAs). Access token returned directly. Less secure, vulnerable to token leakage.
4.  **Resource Owner Password Credentials Flow (Deprecated)**: Used by trusted applications to exchange user credentials directly for tokens. Highly discouraged due to security risks.

**Authorization Code Flow with PKCE (Proof Key for Code Exchange)**:
*   **PKCE** is an extension to the Authorization Code Flow designed to prevent authorization code interception attacks, especially for public clients (like mobile apps and SPAs) that cannot securely store a client secret.
*   **How it works**: The client generates a `code_verifier` (a high-entropy cryptographically random string) and a `code_challenge` (a hash of the verifier) before initiating the OAuth flow. The `code_challenge` is sent in the initial authorization request. When the client exchanges the authorization code for an access token, it sends the original `code_verifier`. The authorization server then hashes the `code_verifier` and compares it to the `code_challenge` it received earlier. If they match, the token is issued.
*   **When to use**: **Always use Authorization Code Flow with PKCE for public clients (SPAs, native mobile/desktop apps)**. It provides a robust defense against various attacks without requiring a client secret, which public clients cannot keep confidential.

### Question 5: Compare RBAC and ABAC authorization models. When would you choose one over the other?
**Difficulty**: Advanced
**Category**: Authorization Models

**Answer**:
*   **Role-Based Access Control (RBAC)**:
    *   **Concept**: Permissions are assigned to roles, and users are assigned to one or more roles. Access decisions are based on the user's role.
    *   **Pros**: Simpler to implement and manage, especially for a fixed set of user roles. Easy to audit.
    *   **Cons**: Can lead to "role explosion" if permissions become very granular or context-dependent. Less flexible for dynamic access requirements.
    *   **Use Case**: Enterprise applications with clear, predefined user functions (e.g., Admin, Editor, Viewer).

*   **Attribute-Based Access Control (ABAC)**:
    *   **Concept**: Access is granted based on attributes (characteristics) of the user, resource, action, and environment. Policies define rules like "A user with attribute `department=finance` can `read` a `document` with attribute `sensitivity=high` during `business_hours`."
    *   **Pros**: Highly flexible and fine-grained control. Can handle complex, dynamic access requirements. Reduces role explosion.
    *   **Cons**: More complex to design, implement, and audit. Requires a robust policy engine.
    *   **Use Case**: Highly dynamic environments like cloud infrastructure, IoT, or applications with very granular and context-dependent access needs.

**Choosing between them**:
*   **Start with RBAC**: If your authorization needs are relatively simple and can be mapped to distinct roles, RBAC is usually sufficient and easier to implement.
*   **Consider ABAC for complexity**: When RBAC becomes too cumbersome (e.g., too many roles, complex combinations of permissions, dynamic conditions like time-of-day or IP-address-based access), ABAC offers the necessary flexibility. ABAC often complements RBAC by adding a layer of fine-grained control on top of roles.

### Question 6: How do you implement secure session management beyond JWTs?
**Difficulty**: Advanced
**Category**: Session Management

**Answer**: While JWTs offer stateless authentication, many applications still rely on session-based management, particularly for traditional web applications or when strict server-side control over sessions is needed.

**Secure Session Management Best Practices**:
1.  **Cryptographically Secure Session IDs**: Generate session IDs using a cryptographically strong random number generator.
2.  **HTTP-Only Cookies**: Store session IDs in HTTP-only cookies. This prevents client-side JavaScript from accessing the cookie, mitigating XSS attacks.
3.  **Secure and SameSite Cookies**:
    *   `Secure`: Ensures the cookie is only sent over HTTPS.
    *   `SameSite`: Protects against CSRF attacks. Set to `Lax` or `Strict`.
4.  **Short Session Lifetimes**: Use relatively short session expiration times (e.g., 15-30 minutes of inactivity). Implement idle timeouts and absolute timeouts.
5.  **Session Regeneration**: Regenerate the session ID after successful authentication (login) and privilege escalation (e.g., password change, enabling 2FA) to prevent session fixation attacks.
6.  **Server-Side Session Storage**: Store session data on the server (e.g., in Redis, database) rather than in the cookie itself. This allows for server-side invalidation.
7.  **Session Invalidation**: Provide clear logout functionality that explicitly invalidates the server-side session and clears the client-side cookie.
8.  **IP Address/User-Agent Binding**: Optionally, bind sessions to the client's IP address and User-Agent string. If either changes, the session is invalidated. This can cause issues with mobile users or VPNs but adds a layer of security.
9.  **Monitoring and Alerting**: Monitor for suspicious session activity (e.g., multiple logins from different IPs, rapid session invalidations) and alert administrators.

**Example (Node.js with `express-session` and Redis store):**
```javascript
const express = require('express');
const session = require('express-session');
const RedisStore = require('connect-redis').default;
const { createClient } = require('redis');

const app = express();

// Initialize Redis client
const redisClient = createClient({ legacyMode: false });
redisClient.connect().catch(console.error);

// Initialize Redis store for sessions
const redisStore = new RedisStore({
  client: redisClient,
  prefix: 'myapp:',
});

app.use(
  session({
    store: redisStore,
    secret: process.env.SESSION_SECRET, // Strong, long, random string
    resave: false, // Don't save session if unmodified
    saveUninitialized: false, // Don't create session until something is stored
    cookie: {
      secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
      httpOnly: true, // Prevent client-side JS access
      maxAge: 1000 * 60 * 60 * 24, // 24 hours (for absolute timeout)
      sameSite: 'lax', // Protect against CSRF
    },
  })
);

// Login route
app.post('/login', (req, res) => {
  // ... authenticate user ...
  req.session.userId = user.id;
  req.session.regenerate((err) => { // Regenerate session ID on login
    if (err) return res.status(500).send('Login failed');
    res.send('Logged in!');
  });
});

// Logout route
app.post('/logout', (req, res) => {
  req.session.destroy((err) => { // Destroy server-side session
    if (err) return res.status(500).send('Logout failed');
    res.clearCookie('connect.sid'); // Clear session cookie
    res.send('Logged out!');
  });
});
```
