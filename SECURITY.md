# CarbonMind AI — Production Security Policy & Threat Model

## 🛡️ Security Architecture

CarbonMind AI implements security controls at multiple layers of the Next.js and Prisma stack to safeguard user telemetry, prevent unauthorized mutation, and comply with SOC2 / GDPR requirements.

---

## 🔒 Threat Model & Control Matrix

| Threat Vector | Potential Impact | Security Control Implemented |
| :--- | :--- | :--- |
| **Cross-Site Request Forgery (CSRF)** | Unauthorized activity logs / account takeover | Strict Origin/Host verification middleware for mutating state-change calls (`POST`, `PUT`, `DELETE`, `PATCH`). |
| **SQL Injection (SQLi)** | Database extraction / data corruption | Strictly parameterized queries utilizing **Prisma ORM** query engines. |
| **Cross-Site Scripting (XSS)** | Session theft / credential harvesting | Strict **Content Security Policy (CSP)** restricting scripts to trusted domains and local hashes. |
| **API Abuse & DoS** | Resource exhaustion / high API bill | In-memory **Token Bucket Rate Limiter** separating standard endpoints (100 req/min) from expensive AI engines (10 req/min). |
| **Information Disclosure** | Leakage of private user activity locations | Fully masked client IP addresses within standard output audit streams (compliance with GDPR/SOC2). |

---

## 🛡️ Next.js Content Security Policy (CSP) & Secure Headers

The application injects the following headers globally on every HTTP response:

*   **Content-Security-Policy**: Enforces strict execution source constraints:
    `default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob: https:; ...`
*   **Strict-Transport-Security (HSTS)**: Set to `max-age=63072000; includeSubDomains; preload` to enforce secure SSL channels.
*   **X-Frame-Options**: Enforced as `DENY` to defeat clickjacking overlays.
*   **X-Content-Type-Options**: Configured with `nosniff` to block MIME sniffing attacks.
*   **X-XSS-Protection**: Configured with `1; mode=block` to trigger client-side XSS filters.

---

## 📋 Compliance & Audit Logging

Structured security audit logs are exported to standard output as serialized JSON:

```json
{
  "timestamp": "2026-06-19T00:33:00.000Z",
  "severity": "WARN",
  "event": "API_RATE_LIMIT_EXCEEDED",
  "userId": "usr_90a3c2e1",
  "ip": "192.168.1.xxx",
  "details": {
    "endpoint": "/api/carbon/forecast"
  }
}
```

Audit logs capture:
1.  Failed login/signup attempts.
2.  High-volume simulated transactions.
3.  Unauthorized route access attempts.
4.  Rate-limit violations.
