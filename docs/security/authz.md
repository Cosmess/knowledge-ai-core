# Authorization

Authorization must be enforced in the API.

The frontend may hide UI actions, but the API is the source of truth.

## Dimensions

- role
- user
- tenant/company if applicable
- spaceKey
- audience
- documentType
- system

## Examples

`developer` can access technical docs and API docs for allowed spaces.

`operations` can access operational processes, FAQs and business rules for allowed spaces.

`admin` can trigger ingestion and reindex jobs.
