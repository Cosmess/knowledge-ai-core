# API Authentication

The API must validate authentication and authorization on every sensitive endpoint.

## MVP Options

Preferred corporate option:

```txt
External identity provider
  -> JWT
  -> API validates issuer, audience, signature and roles
```

Acceptable MVP option:

```txt
POST /auth/login
  -> API issues short-lived JWT
  -> frontend sends Authorization: Bearer
```

## Roles

```txt
admin
developer
operations
product
support
viewer
```

## Authorization Dimensions

- role
- space
- audience
- documentType
- system
- source
