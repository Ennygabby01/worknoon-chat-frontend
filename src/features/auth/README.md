# Auth Feature

Owns login, signup, current session state, refresh flow, and logout.

Rules:

- Use backend bearer access tokens for API requests.
- Refresh must be single-flight when multiple requests receive `401`.
- UI must show safe messages, never raw backend errors.
