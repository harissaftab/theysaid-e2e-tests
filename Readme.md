# TheySaid AI — Playwright E2E Test Suite

End-to-end automated tests for [evo.dev.theysaid.io](https://evo.dev.theysaid.io), built with Playwright + TypeScript, running **4 parallel workers**.

## 🎥 Session Recording

**[View Assessment Recording on Google Drive](YOUR_GOOGLE_DRIVE_LINK_HERE)**
_(Replace this link after uploading your recording)_

---

## 📋 Test Coverage

| File | Flow |
|------|------|
| `01-login.spec.ts` | Login with valid credentials |
| `02-create-project.spec.ts` | Create a new AI project |
| `03-teach-ai.spec.ts` | Upload a document via Teach AI |
| `04-publish-survey.spec.ts` | Publish a project and take its survey |

---

## ⚡ Setup

```bash
npm install
npx playwright install chromium
```

## 🚀 Run Tests

```bash
npm test
```

---

## 🐛 Bonus Bug Report

### Bug: Password Change Does Not Invalidate Existing Sessions (Broken Session Expiry)

**Severity:** High
**Type:** Security — Broken Authentication / Session Management
**CWE:** CWE-613 — Insufficient Session Expiration

---

### Description

When a user changes their password, all previously active sessions remain valid and are not invalidated. A user logged in on another device or browser can continue using the application indefinitely after a password change, with no forced re-authentication.

---

### Steps to Reproduce

1. Log in to `evo.dev.theysaid.io` on **Browser A** (e.g. Chrome)
2. Log in to the same account on **Browser B** (e.g. a different browser or incognito window)
3. On **Browser A**, change the account password
4. Switch to **Browser B** — the session is still active and fully functional
5. Continue performing actions on **Browser B** without re-authenticating

**Expected:** Changing the password should immediately invalidate all other active sessions and force re-login on all devices.

**Actual:** The session on Browser B remains active. The user can continue browsing, creating projects, and accessing all data without being asked to log in again.

---

### Business Impact

| Scenario | Risk |
|----------|------|
| User logs into a public computer and forgets to log out | Attacker retains access even after victim changes password from another device |
| User's device is stolen | Victim cannot revoke the stolen device's session by changing password |
| Account takeover | Attacker who gains access to an account cannot be kicked out by the legitimate owner changing their password |
| Compliance | Violates OWASP Session Management best practices and may affect SOC2 / ISO 27001 compliance |

---

### Recommendation

1. **Invalidate all sessions on password change** — store a `password_changed_at` timestamp and reject any session token issued before that timestamp
2. **Add a "Log out all devices" option** in account settings so users can forcefully revoke all active sessions
3. **Notify the user** via email when a new session is created from an unrecognised device, giving them the option to revoke it
4. **Set session expiry** — sessions should have a reasonable absolute expiry (e.g. 24 hours) regardless of activity

---

### References

- [OWASP Session Management Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html)
- [CWE-613: Insufficient Session Expiration](https://cwe.mitre.org/data/definitions/613.html)