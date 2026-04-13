# Security Test Plan

## Scope

- Public signup journey covered by the Cypress suite
- Repository configuration hygiene to prevent committed secrets
- Low-noise UI validations mapped to the actual flow available in the codebase

## Risks Covered

- OWASP Top 10 2025: injection, security misconfiguration, data validation weaknesses
- OWASP ASVS and WSTG references for input validation, error exposure and file-upload-related checks

## Approach

- Execute only non-destructive UI validations against the existing signup screen
- Keep security scenarios isolated under `cypress/e2e/security`
- Use repo-side checks for committed secrets and unsafe configuration files

## Automated Scenarios

- Injection-like CPF payloads are rejected
- Malformed email payloads are rejected without stack traces on screen
- Upload remains mandatory on empty submission
- Repository check blocks committed `.env` files and common secret patterns

## Recommended Manual Scenarios

- Validate backend upload restrictions for file type, size and malware scanning in a controlled environment
- Review security headers, CORS and server-side error handling in the target application
- Add DAST and dependency scanning in the platform CI/CD

## Limitations And Assumptions

- The repository does not include the application source or API implementation, so authentication, authorization, tokens, IDOR/BOLA and rate limiting are not applicable for automation here
- The suite intentionally avoids invasive payloads or production dependencies
