# TheySaid AI — Playwright E2E Test Suite

End-to-end automated tests for [evo.dev.theysaid.io](https://evo.dev.theysaid.io), built with Playwright + TypeScript, running up to **4 parallel workers**.

## 🎥 Session Recording

**[View Assessment Recording on Google Drive](YOUR_GOOGLE_DRIVE_LINK_HERE)**  
_(Replace the link above before submitting)_

---

## 📋 Test Coverage

| File | Suite | Tests |
|------|-------|-------|
| `01-login.spec.ts` | Login Flow | Valid login, wrong password, invalid email format, page structure |
| `02-create-project.spec.ts` | Create Project | Open dialog, all type options, create AI User Test, create AI Interview, close dialog, dashboard buttons |
| `03-teach-ai.spec.ts` | Teach AI Upload | Sidebar navigation, page load, upload .txt document, upload .pdf document |
| `04-publish-survey.spec.ts` | Publish + Survey | Toggle publish state, create & verify published, unpublish/republish, settings tab, survey URL, take survey |

---

## ⚡ Setup

```bash
# Install dependencies
npm install

# Install Playwright browsers
npx playwright install chromium
```

---

## 🚀 Run Tests

```bash
# Run all 4 suites (4 parallel workers)
npm test

# Run with browser visible
npm run test:headed

# Run individual suites
npm run test:login
npm run test:create
npm run test:teach
npm run test:publish

# Open HTML report after run
npm run test:report
```

---

## 🏗️ Configuration

| Setting | Value |
|---------|-------|
| Framework | Playwright + TypeScript |
| Browser | Chromium |
| Workers | 4 (parallel) |
| Retries | 1 on CI, 0 local |
| Artifacts | Screenshots + traces on failure |

---

## 🐛 Bonus Bug Report

### Bug: Bot Detection Fingerprinting Active in Dev Environment

**Severity:** Medium — affects CI/CD automation pipelines  
**Environment:** `evo.dev.theysaid.io` (development)  
**Component:** Login page / WorkOS AuthKit `signals` input

**Description:**

The login page includes a hidden `input[name="signals"]` containing a base64-encoded JSON payload. Decoding this payload reveals the app is actively fingerprinting the browser for automation tools:

```json
{
  "playwrightDetected": false,
  "phantomDetected": false,
  "nightmareDetected": false,
  "seleniumDetected": false,
  "puppeteerDetected": false,
  "webdriver": false
}
```

**Why this is a bug:**

The `playwrightDetected` field (among others) is being sent to the server on every login submission. In a **development** environment, this bot-detection signal should either be disabled or allowlisted for test accounts — otherwise automated QA pipelines risk being silently blocked or degraded without any visible error message.

**Steps to Reproduce:**

1. Open `https://evo.dev.theysaid.io/login` in Chrome
2. Open DevTools → Elements tab
3. Find `<input type="hidden" name="signals" value="..."/>`
4. Copy the value and decode with `atob(value)` in the console
5. Observe `playwrightDetected`, `seleniumDetected`, `puppeteerDetected` fields in the JSON

**Expected:** Dev environment should not enforce bot-detection that blocks legitimate test automation  
**Actual:** Bot-detection fingerprinting runs on every login attempt and reports tool detection to the server

**Recommendation:**

- Disable the `signals` input in `evo.dev` or any non-production environment
- Or allowlist test accounts so their automation sessions are not flagged
- Or expose a `X-Test-Bypass` header that disables the fingerprinting check for authorized CI pipelines