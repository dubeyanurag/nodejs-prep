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
