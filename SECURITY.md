# Security Policy

## Security Architecture

CarbonMind AI implements security controls at multiple layers to protect user data, prevent unauthorized access, and mitigate common web vulnerabilities.

---

## Threat Model & Controls

### 1. Authentication Security
- **Bcrypt Hashing**: User passwords are encrypted using bcrypt with 12 salt rounds before storage. Plaintext passwords are never logged or stored.
- **JWT Session Strategy**: Sessions are maintained using JSON Web Tokens (JWT) signed with a secure 256-bit secret key.
- **Short-Lived Expirations**: JWT tokens expire after 30 days of inactivity.

### 2. Injection Prevention
- **SQL Injection**: All database operations utilize Prisma ORM, which automatically uses parameterized queries to isolate SQL commands from user input parameters.
- **Cross-Site Scripting (XSS)**: Inputs are automatically escaped by React. For user-provided strings where HTML rendering is required, clean sanitization is enforced.

### 3. Input Validation
- **Zod Schema Enforcement**: All incoming payload data (including forms, URL query strings, and API payloads) are parsed and validated using Zod schema validators before execution.
- **File Upload Security**: Uploads on the scan page are limited to 5MB, and validated for proper mime types (`image/jpeg`, `image/png`) to prevent script execution.

### 4. Rate Limiting
- **Token Bucket Limiter**: In-memory rate limiting is applied to all incoming API requests (100 req/min for general API routes, 10 req/min for AI-powered endpoints).

---

## Security Headers (CSP)

The following HTTP response headers are injected via Next.js configuration to harden the application against client-side attacks:

- **Strict-Transport-Security (HSTS)**: Forces all connections over HTTPS.
- **X-Frame-Options**: Set to `SAMEORIGIN` to prevent clickjacking.
- **X-Content-Type-Options**: Set to `nosniff` to prevent content-type sniffing.
- **Referrer-Policy**: Restricts referrer info to `origin-when-cross-origin`.
- **Permissions-Policy**: Disables access to hardware like geolocation, camera, and microphone.
