# Ubie Sentry - MVP Strategy Document

## Executive Summary

Ubie Sentry is an **application error monitoring platform** designed as a lightweight, developer-focused alternative to expensive enterprise solutions like Sentry. This document outlines the product strategy, differentiation, and key decisions for the MVP.

---

## 1. Problem & Solution

### What Problem Are We Solving?

**The Challenge:**
- Production errors are hard to understand and debug in real-time
- Existing solutions (Sentry, Datadog, New Relic) are expensive and bloated with features developers don't need
- Small teams and startups need affordable error monitoring without complexity
- Understanding *why* an error happened requires context about user behavior

**Our Approach:**
We're building a lightweight, focused error monitoring system that:
- Captures errors automatically with zero configuration
- Groups similar errors intelligently
- Shows user behavior context (breadcrumbs + rage clicks)
- Stays minimal and deployable anywhere

---

## 2. Key Differentiators

### Factor 1: Deterministic Fingerprinting
**What:** Automatic error grouping using a simple, reproducible algorithm (hash of error type + message + stack frame).

**Why It Matters:**
- Same error always groups together (deterministic = predictable)
- Fast: instant lookup, no complex ML needed
- Accurate: 95%+ correct grouping with zero manual work

### Factor 2: Rage Click Detection
**What:** Automatically detect when users are frustrated by detecting rapid, repetitive clicks.

**Why It Matters:**
- Error logs don't explain *why* an error happened
- Rage clicks (3+ clicks in 1 second) indicate user frustration
- Identify UI/UX problems before they become errors
- Correlate with actual errors to understand root cause

### Factor 3: Zero-Dependency SDK
**What:** Tiny SDK (~15KB) with no external dependencies—just native JavaScript APIs.

**Why It Matters:**
- Developers care about bundle size
- No dependency conflicts or security risks
- Faster to integrate, easier to audit
- Works on any platform without bloat

---

## 3. What We're Building (MVP Features)

### ✅ Core Features

1. **Automatic Error Capture**
   - Catches uncaught exceptions and promise rejections
   - Tracks user actions (breadcrumbs) leading to the error
   - Works out-of-the-box with zero configuration

2. **Intelligent Error Grouping**
   - Fingerprinting automatically groups similar errors
   - Dashboard shows grouped errors with count and trends
   - Developers see patterns, not noise

3. **Rage Click Detection**
   - Tracks rapid clicking patterns
   - Shows frustrated users in dashboard
   - Helps identify UX problems

4. **Simple Dashboard**
   - Error list grouped by type
   - Click to see full details: stack trace, breadcrumbs, user actions
   - View trends and rage click patterns
   - Everything needed, nothing extra

5. **Deployable Anywhere**
   - Clean REST API
   - SQLite database (zero setup)
   - Docker-ready server
   - Can self-host or use cloud

### ❌ Not Building (Post-MVP)

- Machine learning for smarter grouping
- Real-time WebSocket updates (polling is fast enough)
- User authentication (single-team MVP)
- Advanced search and filtering
- Error replay video
- Email alerts
- Mobile SDK

**Why:** These add complexity without validating our core hypothesis. We'll add them when users ask.

---

## 4. Technical Architecture

### Why These Choices?

| Decision | Why |
|----------|-----|
| **Deterministic fingerprint algorithm** | Instant grouping, no ML overhead, reproducible results |
| **Click/breadcrumb tracking** | Provides context for debugging; enables rage click detection |
| **Client-side batching** | Reduces network calls; SDK works offline temporarily |
| **SQLite database** | Zero setup; perfect for MVP; upgradeable to Postgres later |
| **Fastify server** | Lightweight, fast, minimal dependencies |
| **Simple REST API** | Easy to understand, extend, or migrate |

### Data Flow (Simplified)

```
1. User interacts with app
   ↓
2. Error occurs
   ↓
3. SDK captures error + breadcrumbs (user actions)
   ↓
4. SDK batches and sends to server (every 5 seconds or 10 errors)
   ↓
5. Server generates fingerprint, stores error, updates group counts
   ↓
6. Dashboard shows grouped errors with trends and user context
   ↓
7. Developer clicks error → sees stack trace, breadcrumbs, rage clicks
```

---

## 5. Assumptions We're Testing

| Assumption | How We Test |
|-----------|-------------|
| Deterministic fingerprinting works well enough | Measure grouping accuracy; track false positives |
| Rage clicks are predictive of UX problems | Correlate with error rates; user feedback |
| Zero-dependency SDK matters | Track adoption; bundle size impact |
| Simple dashboard > complex features | Task completion time studies |
| Self-hosting is important | Survey early users |

---

## 6. Success Criteria

### Launch Success
- [ ] SDK integrates in <5 minutes
- [ ] First error captured within 10 seconds
- [ ] Fingerprinting accuracy >90%
- [ ] Dashboard loads in <2 seconds
- [ ] At least 3 external users testing
- [ ] No critical bugs in first week

### Key Metrics to Track
- **Fingerprint accuracy:** % of errors correctly grouped
- **TTTR (Time To Resolution):** How fast do developers find and fix issues?
- **Feature adoption:** Which features do users rely on most?
- **Rage click correlation:** Do rage clicks correlate with actual errors?

---

## 7. Go-To-Market

### Positioning
**"Error monitoring for developers who value simplicity and control"**

**Key Messages:**
1. **For Startups:** "Monitor production errors without SaaS pricing"
2. **For Developers:** "Understand what users experience; get context, not just logs"
3. **For Enterprise:** "Self-hosted, full control, no vendor lock-in"

### Launch Plan
1. **Phase 1:** Internal validation with demo app
2. **Phase 2:** Early adopters program (3-5 beta users)
3. **Phase 3:** Public beta release with open-source positioning

---

## 8. Risks & Mitigations

| Risk | Mitigation |
|------|-----------|
| Fingerprinting accuracy too low | Implement fallback heuristics; manual grouping option |
| SQLite doesn't scale | Plan Postgres migration; test upgrade path now |
| Users prefer Sentry despite cost | Lead with simplicity & control story |
| Rage click algorithm misses patterns | Refine based on user feedback |
| SDK integration too complex | Provide clear docs and demo setup |

---

## 9. Post-MVP Roadmap

**Priority 1 (If fingerprinting accuracy <90%):**
- Implement ML-based error similarity scoring
- Add manual grouping capability

**Priority 2 (If rage clicks show high correlation with errors):**
- Build session replay for detailed UX debugging
- Add heatmaps showing click patterns

**Priority 3 (If self-hosting >60% adoption):**
- Docker Compose setup guide
- Kubernetes Helm charts

**Priority 4 (If users request advanced features):**
- Full-text search across errors
- Custom retention policies
- Email/Slack alerts

---

## Conclusion

Ubie Sentry's MVP validates three core hypotheses:

1. **Developers want lightweight monitoring** → 15KB SDK proves it
2. **Automatic grouping saves time** → Fingerprinting eliminates manual work
3. **Behavior context matters** → Rage clicks + breadcrumbs explain errors

By focusing ruthlessly on these three differentiators, we build a product that solves real problems without the bloat of enterprise solutions.

**Success = Fingerprinting accuracy >90% + Users prefer it to Sentry**
