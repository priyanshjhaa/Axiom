# Axiom Testing Plan - Final Checklist

## 🎯 Objective
Test all features implemented in this session to ensure everything works correctly before final deployment.

---

## 1. Dodo Payments Removal ✅

### 1.1 Package Dependencies
- [ ] Open `package.json`
- [ ] Verify `dodopayments` package is NOT in dependencies
- [ ] Run `npm install` to ensure no broken dependencies

### 1.2 Code Cleanup
- [ ] Verify `src/lib/dodo-payments.ts` is deleted
- [ ] Verify `src/app/api/webhooks/dodo-payments/` directory is deleted
- [ ] Check no references to `createCheckoutSession` exist

### 1.3 Feature Verification - Invoice Generation
- [ ] Go to Dashboard → Create a new proposal
- [ ] Generate invoice from proposal
- [ ] **Expected:** Invoice generates WITHOUT auto payment link
- [ ] **Expected:** Alert shows currency symbol (not hardcoded $)
  - Example: `Total: ₹5,000` or `Total: €100` (depending on proposal currency)

### 1.4 Invoice Display
- [ ] Open any invoice detail page
- [ ] **Expected:** See "Issue Date" only
- [ ] **Expected:** NO "Due Date" field
- [ ] **Expected:** NO payment status badges
- [ ] **Expected:** NO "Pay Now" button
- [ ] **Expected:** NO payment progress bar

---

## 2. Activity Timeline & View Tracking 🎯

### 2.1 Database Setup
- [ ] Run `npx prisma studio` to verify tables exist:
  - [ ] `Activity` table exists with `ActivityType` enum
  - [ ] `ProposalView` table exists
  - [ ] Both tables are empty or have test data

### 2.2 Activity Logging - Proposal Creation
- [ ] Create a new proposal (Dashboard → Create Proposal)
- [ ] Fill form and submit
- [ ] Go to proposal detail page
- [ ] **Expected:** See "Activity Timeline" section at bottom
- [ ] **Expected:** First entry: ✨ "Proposal created" with timestamp
- [ ] **Expected:** Purple icon for creation

### 2.3 Activity Logging - Share/Send
- [ ] On the proposal detail page, click "Share with Client"
- [ ] Complete the share flow
- [ ] Scroll to Activity Timeline
- [ ] **Expected:** New entry: 🔵 "Proposal shared with client" with timestamp
- [ ] **Expected:** Appears after "created" activity

### 2.4 View Tracking - Client View
- [ ] Copy the proposal share link
- [ ] Open in incognito/private browser window (simulates client)
- [ ] Wait 5 seconds for page to load and track view
- [ ] Go back to proposal detail page (in main browser)
- [ ] Refresh the page
- [ ] **Expected:** New entry: 👁️ "Proposal viewed 1 time"
- [ ] **Expected:** Green eye icon
- [ ] **Expected:** View count badge shows "1 view"

**Advanced Test:**
- [ ] Refresh the shared proposal 2 more times
- [ ] Go back to proposal detail page and refresh
- [ ] **Expected:** Activity updates to "Proposal viewed 3 times"
- [ ] **Expected:** Only ONE "viewed" entry (not 3 duplicates)

### 2.5 Activity Logging - Signing
- [ ] Sign the proposal as freelancer (click "Sign Proposal")
- [ ] Share with client
- [ ] Sign as client (using share link in incognito)
- [ ] Go back to proposal detail page
- [ ] **Expected:** New entry: ✅ "Proposal signed by both parties"
- [ ] **Expected:** Indigo/purple checkmark icon

### 2.6 Activity Logging - Invoice Generation
- [ ] Click "Generate Invoice" button
- [ ] Fill form (set due date to 30 days)
- [ ] Submit
- [ ] **Expected:** New entry: 💰 "Invoice generated: INV-XXXXXX"
- [ ] **Expected:** Yellow/dollar icon
- [ ] **Expected:** Alert shows correct currency symbol

### 2.7 Timeline UI Verification
Check the timeline displays correctly:
- [ ] Activities are in chronological order (oldest → newest)
- [ ] Each activity has: Icon + Description + Timestamp
- [ ] Timestamp format: "Jan 15, 2025 at 2:30 PM"
- [ ] Vertical line connects activities (except last one)
- [ ] Total views badge shows in header (if views exist)
- [ ] Background matches dark theme

### 2.8 API Endpoint Testing
Test the new API endpoints directly (optional but recommended):

**Test View Logging:**
```bash
curl -X POST http://localhost:3000/api/proposals/[PROPOSAL_ID]/view \
  -H "Content-Type: application/json" \
  -d '{"ipAddress":"127.0.0.1","userAgent":"Test","referer":""}'
```
- [ ] **Expected:** Returns `{"success":true,"viewCount":1}`

**Test Timeline Fetch:**
```bash
curl http://localhost:3000/api/proposals/[PROPOSAL_ID]/timeline
```
- [ ] **Expected:** Returns `{"activities":[...],"totalViews":1}`

---

## 3. Dashboard Updates 🎨

### 3.1 Stats Tiles Verification
Go to Dashboard page:
- [ ] **Expected:** 3 tiles only (not 4):
  1. Total Proposals
  2. Proposals Sent
  3. Total Invoices
- [ ] **Expected:** NO "Win Rate" tile
- [ ] **Expected:** NO "Win Rate" card in right column
- [ ] **Expected:** Only "Pro Tips" and "Help" sections in right column

### 3.2 Invoice Link
- [ ] Check "Invoices" quick action button
- [ ] **Expected:** Shows correct invoice count
- [ ] Click to go to invoices page

---

## 4. Bug Fixes Verification 🐛

### 4.1 Currency Symbol Fix
- [ ] Create proposal with different currencies:
  - [ ] INR (₹) - Create proposal, generate invoice
  - [ ] USD ($) - Create proposal, generate invoice
  - [ ] EUR (€) - Create proposal, generate invoice
- [ ] **Expected:** Invoice alert shows correct symbol for each

### 4.2 Invoice Date Fields
- [ ] Open invoice detail page
- [ ] **Expected:** Only "Issue Date" visible
- [ ] **Expected:** No "Due Date" anywhere on page
- [ ] Open shared invoice link (incognito)
- [ ] **Expected:** Same - only Issue Date

### 4.3 Win Rate Removal
- [ ] View page source (Cmd+U) and search for "Win Rate"
- [ ] **Expected:** No mentions found (except in comments)
- [ ] Check right column - should only show Tips and Help

---

## 5. Cross-Platform Testing 📱

### 5.1 Desktop Browser
- [ ] Chrome
- [ ] Safari
- [ ] Firefox
**Test:** Create proposal → Generate invoice → Check timeline

### 5.2 Mobile Browser
- [ ] Chrome Mobile
- [ ] Safari Mobile
**Test:** Same flow - ensure responsive layout works
- [ ] Timeline should stack vertically on mobile
- [ ] Icons should be tappable

### 5.3 Shared Proposal (Client View)
- [ ] Open shared proposal link on mobile
- [ ] Verify view tracking works
- [ ] Check layout is mobile-friendly

---

## 6. Edge Cases Testing ⚠️

### 6.1 Empty State
- [ ] Create brand new proposal
- [ ] **Expected:** Timeline shows only "created" activity
- [ ] Open proposal with no activity
- [ ] **Expected:** Timeline section should NOT appear (no activities to show)

### 6.2 Multiple Views
- [ ] View shared proposal 10+ times
- [ ] **Expected:** Single "viewed" entry with correct count
- [ ] **Expected:** Badge shows "10+ views"

### 6.3 Concurrent Activities
- [ ] Have client view proposal while you're viewing detail page
- [ ] Refresh detail page
- [ ] **Expected:** View count updates (may need page refresh)

### 6.4 Deleted Proposals
- [ ] Delete a proposal with activities
- [ ] **Expected:** Activities are cascade deleted (via Prisma relation)

---

## 7. Performance & Database 🚀

### 7.1 Query Performance
- [ ] Create proposal with 10+ activities
- [ ] Load proposal detail page
- [ ] **Expected:** Page loads in < 1 second
- [ ] **Expected:** Timeline renders instantly

### 7.2 Database Size
- [ ] Check `ProposalView` table size
- [ ] **Expected:** Each view = ~100 bytes
- [ ] 1000 views = ~100KB (very efficient)

### 7.3 Index Verification
In Prisma Studio or SQL:
- [ ] `Activity` table has index on `proposalId`
- [ ] `Activity` table has index on `createdAt`
- [ ] `ProposalView` table has index on `proposalId`

---

## 8. Deployment Preparation 🚀

### 8.1 Pre-Deployment Checklist
- [ ] All tests above pass
- [ ] `npm run build` completes successfully
- [ ] No TypeScript errors
- [ ] No console errors in browser
- [ ] Git committed all changes

### 8.2 Environment Variables
- [ ] `.env` file has `DATABASE_URL`
- [ ] No Dodo Payments env vars needed (can remove old ones)

### 8.3 Database Migration
- [ ] Run `npx prisma db push` on production database
- [ ] Verify tables created: `Activity`, `ProposalView`
- [ ] Verify enum `ActivityType` created

### 8.4 Deployment Steps
1. [ ] Commit all changes: `git add . && git commit -m "Final testing complete"`
2. [ ] Push to remote: `git push origin main`
3. [ ] Monitor deployment on Vercel/Netlify
4. [ ] Run smoke tests on production:
   - [ ] Create proposal
   - [ ] Generate invoice
   - [ ] Check timeline appears

---

## 9. User Acceptance Testing (UAT) 👤

### 9.1 Freelancer Workflow
1. [ ] Login → Dashboard
2. [ ] Create new proposal → Fill details → Submit
3. [ ] Open proposal → Verify "created" in timeline
4. [ ] Share with client → Verify "shared" in timeline
5. [ ] Generate invoice → Verify currency symbol correct
6. [ ] Check dashboard → Verify win rate gone

### 9.2 Client Workflow (Simulated)
1. [ ] Open shared proposal link
2. [ ] Wait 5 seconds → Close tab
3. [ ] Freelancer checks → Should see "viewed" activity
4. [ ] Client signs proposal
5. [ ] Freelancer checks → Should see "signed" activity

### 9.3 Invoice Workflow
1. [ ] Generate invoice from proposal
2. [ ] Check invoice detail page
3. [ ] Verify: Only issue date, no due date, no payment buttons
4. [ ] Check timeline → Should see "invoice generated"

---

## 10. Final Sign-Off ✅

### 10.1 Feature Completeness
- [ ] Dodo Payments fully removed
- [ ] Activity timeline working
- [ ] View tracking working
- [ ] All 3 bug fixes applied
- [ ] No regressions detected

### 10.2 Code Quality
- [ ] No hardcoded values
- [ ] Proper error handling
- [ ] TypeScript types correct
- [ ] Clean git history

### 10.3 Ready for Production
- [ ] All tests pass
- [ ] Performance acceptable
- [ ] Mobile responsive
- [ ] Documentation updated

---

## 🎉 Success Criteria

**To mark this as COMPLETE:**
1. ✅ All Dodo Payments code removed
2. ✅ Activity timeline shows all 5 event types
3. ✅ View tracking works with aggregation
4. ✅ Currency symbols display correctly
5. ✅ No due dates on invoices
6. ✅ Win rate removed from dashboard
7. ✅ Build passes without errors
8. ✅ Production deployment successful

**Estimated Testing Time:** 45-60 minutes
**Priority:** HIGH - Test thoroughly before marking complete
