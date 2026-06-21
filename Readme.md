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

## 🐛 Bonus Bug Reports

---

### Bug #1: Password Change Does Not Invalidate Existing Sessions

**Severity:** High
**Type:** Security — Broken Authentication / Session Management
**CWE:** CWE-613 — Insufficient Session Expiration

**Description:**
When a user changes their password, all previously active sessions on other devices or browsers remain valid and are not invalidated. An attacker — or anyone with access to a logged-in session — can continue using the application indefinitely after the account owner changes their password.

**Steps to Reproduce:**
1. Log in to `evo.dev.theysaid.io` on **Browser A** (e.g. Chrome)
2. Log in to the same account on **Browser B** (e.g. a different browser or incognito)
3. On **Browser A**, change the account password
4. Switch to **Browser B** — session is still fully active
5. Continue performing actions on **Browser B** without re-authenticating

**Expected:** Changing the password should immediately invalidate all other active sessions and force re-login on all devices.

**Actual:** The session on Browser B remains active. The user can continue browsing, creating projects, and accessing all data without being asked to log in again.

**Business Impact:**

| Scenario | Risk |
|----------|------|
| User logs into a public computer and forgets to log out | Attacker retains full access even after victim changes password |
| User's device is stolen | Victim cannot revoke the stolen device's session by changing password |
| Account takeover | Attacker who gains access cannot be kicked out by the legitimate owner |
| Compliance | Violates OWASP Session Management best practices and may affect SOC2 / ISO 27001 |

**Recommendation:**
- Invalidate all sessions on password change — reject any session token issued before `password_changed_at`
- Add a **"Log out all devices"** option in account settings
- Notify the user via email when a new session is created from an unrecognised device
- Set a reasonable absolute session expiry (e.g. 24 hours)

**References:**
- [OWASP Session Management Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html)
- [CWE-613: Insufficient Session Expiration](https://cwe.mitre.org/data/definitions/613.html)

---

### Bug #2: Progress Indicator Disappears Too Quickly for Short Messages in Ask AI

**Severity:** Low
**Type:** UX / UI Inconsistency
**Component:** Ask AI chat sidebar — message sending progress indicator

**Description:**
When sending a short message in the Ask AI sidebar, a percentage-based progress indicator appears (`2% Analyzing request`, `3%...`) but disappears almost instantly before reaching 100%. The indicator flashes briefly and vanishes mid-progress, giving the user no meaningful feedback that their message was actually sent or being processed.

**Steps to Reproduce:**
1. Log in to `evo.dev.theysaid.io`
2. Open the **Ask AI** sidebar (bottom right button)
3. Type a short message (e.g. "what's the difference between ask ai and evo?") and send it
4. Observe the `2% Analyzing request` progress indicator

**Expected:** The progress indicator should either complete visibly (0% → 100%) or use a simple spinner — it should not flash briefly at 2-3% and vanish mid-progress.

**Actual:** The percentage jumps from 2% to 3% and immediately disappears, making it appear as though the request was dropped or failed.

**Impact:**
- Users may re-send the same message thinking the first one didn't go through, causing duplicate AI requests
- Creates confusion about whether the message was received
- Inconsistent experience — longer messages show the loader correctly, short messages do not

**Recommendation:**
- Set a minimum display duration for the progress indicator (e.g. at least 800ms) regardless of how fast the request resolves
- Alternatively replace the percentage loader with a simple animated spinner that stays visible until the AI response arrives
- Ensure the transition from "sending" to "AI is thinking..." is smooth and always visible to the user