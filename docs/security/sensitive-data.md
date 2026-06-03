# Sensitive Data

Never log:

- access tokens
- refresh tokens
- API keys
- passwords
- secrets
- raw sensitive customer data

Mask sensitive data before structured logging.

The `observability` package provides initial masking helpers and should be expanded as concrete data types are identified.
