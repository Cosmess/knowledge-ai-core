export function maskSensitiveData(value: string): string {
  return value
    .replace(/Bearer\s+[A-Za-z0-9._-]+/g, "Bearer [REDACTED]")
    .replace(/(api[_-]?key|token|secret)=([^&\s]+)/gi, "$1=[REDACTED]");
}
