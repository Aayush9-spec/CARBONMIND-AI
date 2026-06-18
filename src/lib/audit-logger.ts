// =============================================================================
// CARBONMIND AI — Security Audit Logger
// =============================================================================

export type AuditSeverity = 'INFO' | 'WARN' | 'ERROR' | 'CRITICAL';

export interface AuditEvent {
  event: string;
  userId?: string;
  ipAddress?: string;
  details?: Record<string, unknown>;
  severity: AuditSeverity;
}

/**
 * Structured Security Audit Logger complying with compliance guidelines (GDPR/SOC2).
 * Masks sensitive IP addresses and formats log lines in JSON for log processors.
 */
export function logSecurityEvent({ event, userId, ipAddress, details, severity }: AuditEvent) {
  const timestamp = new Date().toISOString();
  
  // Mask IP address (GDPR compliance - mask last octet)
  let maskedIp = 'unknown';
  if (ipAddress) {
    if (ipAddress.includes('.')) {
      const parts = ipAddress.split('.');
      if (parts.length === 4) {
        maskedIp = `${parts[0]}.${parts[1]}.${parts[2]}.xxx`;
      } else {
        maskedIp = 'masked-ipv4';
      }
    } else if (ipAddress.includes(':')) {
      maskedIp = 'masked-ipv6';
    } else {
      maskedIp = ipAddress;
    }
  }

  const payload = {
    timestamp,
    severity,
    event,
    userId: userId || 'anonymous',
    ip: maskedIp,
    details: details || {},
  };

  // Log in JSON format to stdout for easy capture by cloud log forwarders
  console.log(`[AUDIT] ${JSON.stringify(payload)}`);
}
