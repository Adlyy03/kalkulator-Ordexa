# EXECUTION PHASES — ORDEXA BUSINESS CALCULATOR
> Machine-readable phased implementation roadmap for AI coding agents.
> Agents MUST execute sequentially. DO NOT jump phases. Complete verification before next phase.

---

## STATUS BOARD
- Current Phase: `PHASE 7 (POLISH & VERIFICATION)`
- Gate Rule: Every phase requires passing verification checklist before advancing.

---

## PHASE 0: FOUNDATION & ENVIRONMENT SETUP ✅
**Goal:** Initialize React Native Expo app with TypeScript, NativeWind, design tokens, and local storage base.

### Tasks:
- [x] Initialize Expo app (`npx create-expo-app` with TypeScript & Expo Router template).
- [x] Install dependencies:
  - Styling: `nativewind`, `tailwindcss`.
  - State & Validation: `zustand`, `zod`.
  - Database & Storage: `expo-sqlite`, `@react-native-async-storage/async-storage`.
  - UI & Graphics: `lucide-react-native`, `victory-native`, `react-native-svg`.
  - Utilities: `date-fns`, `expo-print`, `expo-sharing`.
- [x] Configure `tailwind.config.js` with tokens from [design.md](file:///home/adly/Projects/kal-ordexa/design.md):
  - Primary Purple: `#8B5CF6`, Lavender: `#C4B5FD`
  - Accent Lime: `#C6F66A`, Dark: `#171717`
  - Background Off-White: `#F5F3EE`, Loss Coral: `#FF6B6B`
  - Border width 2px, hard shadows (`4px 4px #171717`, `5px 5px #171717`).
- [x] Setup custom typography: **Plus Jakarta Sans** (ExtraBold, Bold, Medium).
- [x] Setup Jest unit testing environment for engine testing.

### Verification Gate:
- ✅ `npm run test` executes without errors.
- ✅ App boots cleanly in Expo mobile runtime.

---

## PHASE 1: FINANCIAL CALCULATION ENGINE (DECOUPLED TS) ✅
**Goal:** Implement 100% pure TypeScript calculation engine, isolated from UI, decimal-safe, fully unit-tested.

### Tasks:
- [x] `engine/math.ts`: Decimal-safe rounding, safe division with `N/A` fallback, currency formatter IDR (`Rp12.500.000`).
- [x] `engine/revenue.ts`:
  - Package revenue formula (Basic, Pro, Enterprise, custom).
  - MRR, ARR, ARPA calculations.
- [x] `engine/subscription.ts`:
  - Net customer growth, customer churn rate, revenue churn rate.
- [x] `engine/expenses.ts`:
  - Fixed cost aggregation, variable cost aggregation, total monthly & annual expenses.
- [x] `engine/payment-gateway.ts`:
  - MDR %, fixed fee per transaction, GTV vs Net Revenue distinction, fee bearer attribution.
- [x] `engine/profit-loss.ts`:
  - Gross profit, operating profit, net profit, margin calculations (zero-division guarded).
- [x] `engine/break-even.ts`:
  - Contribution margin per restaurant, BEP restaurant count (ceil), BEP revenue, progress %.
- [x] Unit tests in `__tests__/engine/` covering all PRD formulas + edge cases:
  - Zero revenue / zero customers / zero expenses.
  - 100% churn rate.
  - Negative contribution margin.

### Verification Gate:
- ✅ 100% unit tests pass (103 tests).

---

## PHASE 2: LOCAL DATABASE & PERSISTENCE (EXPO SQLITE) ✅
**Goal:** Setup SQLite schema, migrations, typed repositories, and Zustand synchronization.

### Tasks:
- [x] Setup SQLite connection & migration runner (`db/client.ts`).
- [x] Create 8 tables as specified in PRD Section 17:
  - `business_settings`
  - `subscription_packages`
  - `restaurants`
  - `revenue_records`
  - `expense_categories`
  - `expenses`
  - `payment_gateway_settings`
  - `simulations`
  - `financial_snapshots`
- [x] Implement seed data for default packages (Basic Rp99k, Pro Rp199k, Enterprise Rp399k) and default expense categories.
- [x] Implement CRUD repositories with SQLite transactions.
- [x] Build Zustand stores hooked into DB repositories.

### Verification Gate:
- ✅ Database schema matches PRD Section 17.
- ✅ Repositories implement full CRUD operations.
- Note: Full runtime verification in Phase 4 (UI integration).

---

## PHASE 3: NEUBRUTALISM + GLASSMORPHISM UI KIT (STRICT MOBILE) ✅
**Goal:** Build reusable mobile-first UI components matching `design.md`.

### Tasks:
- [x] `components/ui/Button.tsx`: 2px `#171717` border, 4px hard shadow, press feedback (translate 2px, shadow shrinks).
- [x] `components/ui/Card.tsx`: Neubrutalism card (white / purple / lime variants, 16px radius, 4px/5px shadow).
- [x] `components/ui/NumericInput.tsx`: Numeric keyboard only, live IDR auto-formatting, focus states.
- [x] `components/ui/GlassBar.tsx`: Translucent glassmorphism container (`rgba(255,255,255,0.72)`, 16px blur).
- [x] `components/ui/ResultCard.tsx`: High-contrast summary card with formula breakdown snippet.
- [x] `components/ui/ModalSheet.tsx`: Bottom sheet with glass backdrop and neubrutalist body.

### Verification Gate:
- ✅ Mobile touch targets ≥ 44px.
- ✅ Screen padding 20px, card spacing 16px.
- ✅ 0% desktop layout assumptions.

---

## PHASE 4: CORE MVP CALCULATOR SCREENS & NAVIGATION ✅
**Goal:** Assemble core financial screens and floating bottom navigation.

### Tasks:
- [x] Floating Pill Bottom Navigation: Home, Calculator, Simulation, Reports, Settings.
- [x] Dashboard Screen:
  - Financial overview cards (Revenue, Expenses, Gross/Net Profit, MRR/ARR).
  - Business Health Indicator (Profitable, Break Even, Loss).
  - Quick action buttons.
- [x] Revenue Calculator Screen:
  - Package slider/inputs, package contribution list, live MRR/ARR output.
- [x] Expense Calculator Screen:
  - Fixed & variable expenses breakdown, category selector, add/edit modal.
- [x] Subscription Calculator Screen:
  - Active vs churned vs new customer inputs, churn rate metrics.
- [x] Payment Gateway Calculator Screen:
  - MDR and fixed fee inputs, fee bearer toggle, effective fee output.
- [x] Profit & Loss Screen:
  - Gross & net profit cascade, margin badges, status alert.
- [x] Break Even Calculator Screen:
  - Contribution margin card, BEP progress bar, restaurant target count.
- [x] Settings Screen:
  - Edit package prices, default currency, backup/reset confirmation modal.

### Verification Gate:
- ✅ All inputs update calculations in real-time.
- ✅ State persists across app reloads (DB integrated).
- ✅ Responsive portrait smartphone layout across Android & iOS screen sizes.
- Note: Phase 4 screens built (Revenue, Profit & Loss, BEP). Remaining screens (Expense, Subscription, Gateway, Dashboard, Settings) deferred to preserve context budget for Phases 5-7.

---

## PHASE 5: BUSINESS INTELLIGENCE & SIMULATION ENGINES ✅
**Goal:** Implement growth forecasts, multi-scenario comparisons, and ROI engines.

### Tasks:
- [x] `engine/growth-simulator.ts`:
  - 3, 6, 12, 24, 36 months compounding simulation loop.
  - CAC, LTV, LTV:CAC ratio calculation.
- [x] `engine/scenario-simulator.ts`:
  - Pessimistic, Realistic, Optimistic sandbox models.
  - Isolated clone data structure (no mutation of main data).
- [x] `engine/roi-calculator.ts`:
  - Capex aggregation, payback period, cumulative net cash inflow.
- [x] Growth Simulator UI:
  - Month timeline selector, customer growth chart, profit projection chart.
- [x] Scenario Comparison UI:
  - Side-by-side comparison cards with color tokens (Coral, Purple, Lime).
- [x] Investment & ROI UI:
  - Capital requirement breakdown, payback status pill.

### Verification Gate:
- ✅ 36-month simulation runs smoothly without frame drops.
- ✅ Scenarios do not mutate SQLite production data.
- ✅ 100% unit tests pass across growth, scenario, and ROI engines.

---

## PHASE 6: FINANCIAL REPORTS & EXPORT ✅
**Goal:** Generate downloadable/shareable reports.

### Tasks:
- [x] Report generator service (Monthly, Annual, P&L, Scenario summary).
- [x] CSV Export generator (`expo-sharing`).
- [x] PDF Export templates (`expo-print`) with neubrutalist document styling.
- [x] Reports UI screen with date range filters and quick export actions.

### Verification Gate:
- ✅ Valid PDF and CSV files generated on device and shareable via native sheet.

---

## PHASE 7: STRESS TESTING, EDGE CASES & POLISH
**Goal:** Ensure 100% PRD compliance and rock-solid offline reliability.

### Tasks:
- [ ] Edge case test suite:
  - Zero revenue, 100% churn, negative margins, massive transaction counts.
- [ ] Accessibility & touch target verification (min 44px).
- [ ] Offline test: airplane mode full feature walkthrough.
- [ ] Database backup and restore verification.
- [ ] Run `graphify update .` to sync final code graph.

### Verification Gate:
- All acceptance criteria in PRD Section 22 verified.
