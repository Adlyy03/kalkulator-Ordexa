# Graph Report - kal-ordexa  (2026-11-01)

## Corpus Check
- 84 files · ~33,418 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 29 file(s) not represented in the graph (top: .xml 10, (none) 5, .properties 2)

## Summary
- 425 nodes · 898 edges · 47 communities (20 shown, 27 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 1 edges (avg confidence: 0.95)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- Decoupled Financial Calculation Engine
- formatIDR
- package.json
- useFinancialStore.ts
- dependencies
- expo
- AppDelegate
- MainApplication.kt
- MainActivity.kt
- engine/expenses.ts
- GlassBar.tsx
- payment-gateway.ts
- profit-loss.ts
- revenue.ts
- scripts
- AGENT INSTRUCTIONS — ORDEXA BUSINESS CALCULATOR
- subscription.ts
- FloatingTabBar.tsx
- scenario-simulator.ts
- tsconfig.json
- metro.config.js
- ReactSettingsPlugin
- expo-blur
- date-fns@^3.3.1
- expo-dev-client@~4.0.14
- expo-linking@~6.3.1
- expo-print
- expo-sharing
- expo-status-bar@~1.12.0
- @react-native-async-storage/async-storage@1.23.1
- react-native-screens@~3.31.0
- app/_layout.tsx
- victory-native@^37.0.2
- zod@^3.22.0
- zustand

## God Nodes (most connected - your core abstractions)
1. `formatIDR()` - 28 edges
2. `useFinancialStore` - 28 edges
3. `Card()` - 25 edges
4. `react-native` - 23 edges
5. `NumericInput()` - 21 edges
6. `ResultCard()` - 21 edges
7. `react` - 20 edges
8. `Button()` - 19 edges
9. `lucide-react-native` - 16 edges
10. `react-native-safe-area-context` - 16 edges

## Surprising Connections (you probably didn't know these)
- `SimulasiScreen()` --calls--> `simulateGrowth()`  [EXTRACTED]
  app/(tabs)/simulasi.tsx → engine/growth-simulator.ts
- `SimulasiScreen()` --calls--> `compareScenarios()`  [EXTRACTED]
  app/(tabs)/simulasi.tsx → engine/scenario-simulator.ts
- `BreakEvenScreen()` --calls--> `calculateBreakEven()`  [EXTRACTED]
  app/break-even.tsx → engine/break-even.ts
- `PaymentGatewayScreen()` --calls--> `calculatePaymentGateway()`  [EXTRACTED]
  app/payment-gateway.tsx → engine/payment-gateway.ts
- `ProfitLossScreen()` --calls--> `calculateProfitLoss()`  [EXTRACTED]
  app/profit-loss.tsx → engine/profit-loss.ts

## Import Cycles
- 2-file cycle: `db/client.ts -> db/seed.ts -> db/client.ts`

## Hyperedges (group relationships)
- **Financial Calculation Engine Suite** — prd_revenue_calculator, prd_expense_calculator, prd_payment_gateway_calculator, prd_profit_loss_calculator, prd_break_even_calculator [EXTRACTED 1.00]
- **Mobile Neubrutalism Design System** — design_style_hybrid, design_neubrutalism_core, design_mobile_layout, design_color_palette, design_nativewind_tokens [EXTRACTED 1.00]

## Communities (47 total, 27 thin omitted)

### Community 0 - "Decoupled Financial Calculation Engine"
Cohesion: 0.10
Nodes (27): Agent Directives Hub (agents.md), ORDEXA Color System, Floating Glass Bottom Navigation, Glassmorphism Layering Rules, Mobile-First Screen Layout, NativeWind Component Design Tokens, Neubrutalism Core Rules, Design Style: 70% Neubrutalism + 30% Glassmorphism (+19 more)

### Community 1 - "formatIDR"
Cohesion: 0.13
Nodes (47): BiayaOperasionalScreen(), styles, BreakEvenScreen(), styles, styles, CATEGORIES, ModalAwalScreen(), styles (+39 more)

### Community 2 - "package.json"
Cohesion: 0.14
Nodes (19): devDependencies, @babel/core@^7.24.0, jest@^29.7.0, jest-expo@~51.0.0, tailwindcss@^3.4.1, @types/jest@^29.5.12, @types/react@~18.2.79, typescript@~5.3.0 (+11 more)

### Community 3 - "useFinancialStore.ts"
Cohesion: 0.12
Nodes (25): executeMigration(), getDatabase(), runMigrations(), seedDatabase(), initializeDatabase(), CapitalInvestment, capitalRepository, Expense (+17 more)

### Community 4 - "dependencies"
Cohesion: 0.11
Nodes (18): dependencies, expo-router@~3.5.0, expo-sqlite@~14.0.0, lightningcss-linux-x64-gnu@^1.27.0, lucide-react-native@^0.344.0, react@18.2.0, react-dom@^18.2.0, react-native@0.74.0 (+10 more)

### Community 5 - "expo"
Cohesion: 0.08
Nodes (24): backgroundColor, foregroundImage, adaptiveIcon, package, typedRoutes, expo, android, assetBundlePatterns (+16 more)

### Community 6 - "AppDelegate"
Cohesion: 0.13
Nodes (9): AppDelegate, -applicationcontinueUserActivityrestorationHandler, -applicationdidFailToRegisterForRemoteNotificationsWithError, -applicationdidFinishLaunchingWithOptions, -applicationdidReceiveRemoteNotificationfetchCompletionHandler, -applicationdidRegisterForRemoteNotificationsWithDeviceToken, -applicationopenURLoptions, -bundleURL (+1 more)

### Community 9 - "engine/expenses.ts"
Cohesion: 0.38
Nodes (11): calculateExpenses(), calculateFixedCost(), calculateTotalAnnualExpenses(), calculateTotalMonthlyExpenses(), calculateVariableCost(), Expense, ExpenseFrequency, ExpenseResult (+3 more)

### Community 10 - "GlassBar.tsx"
Cohesion: 0.29
Nodes (5): GlassBar(), GlassBarProps, styles, ModalSheetProps, styles

### Community 11 - "payment-gateway.ts"
Cohesion: 0.38
Nodes (10): calculateEffectiveFeeRate(), calculateFixedFee(), calculateGTV(), calculatePaymentGateway(), calculatePercentageFee(), calculateSuccessfulTransactions(), calculateTotalGatewayFee(), GatewayCalculationInput (+2 more)

### Community 12 - "profit-loss.ts"
Cohesion: 0.49
Nodes (8): calculateGrossProfit(), calculateGrossProfitMargin(), calculateNetProfit(), calculateNetProfitMargin(), calculateOperatingProfit(), calculateProfitLoss(), determineStatus(), ProfitLossInput

### Community 13 - "revenue.ts"
Cohesion: 0.56
Nodes (7): calculateARPA(), calculateARR(), calculateMRR(), calculatePackageRevenue(), calculateRevenue(), calculateTotalRestaurants(), RevenueResult

### Community 14 - "scripts"
Cohesion: 0.25
Nodes (8): scripts, android, ios, start, start:dev, test, verify-db, web

### Community 15 - "AGENT INSTRUCTIONS — ORDEXA BUSINESS CALCULATOR"
Cohesion: 0.25
Nodes (7): 1. MANDATORY SKILLS ON EVERY PROMPT, 2. STRICT COMPLIANCE WITH PRD.md, 3. STRICT MOBILE APP UI REQUIREMENT (TAMPILAN WAJIB MOBILE!), 4. STRICT PHASE-BY-PHASE EXECUTION ([PHASES.md](file:///home/adly/Projects/kal-ordexa/PHASES.md)), AGENT INSTRUCTIONS — ORDEXA BUSINESS CALCULATOR, Aturan Inti PRD:, Spesifikasi Tampilan Mobile (Mengacu pada [design.md](file:///home/adly/Projects/kal-ordexa/design.md)):

### Community 16 - "subscription.ts"
Cohesion: 0.54
Nodes (6): calculateCustomerChurnRate(), calculateEndingCustomers(), calculateNetGrowth(), calculateRevenueChurnRate(), calculateSubscriptionMetrics(), SubscriptionMetrics

### Community 17 - "FloatingTabBar.tsx"
Cohesion: 0.38
Nodes (4): TabsLayout(), FloatingTabBar(), styles, TAB_CONFIG

### Community 18 - "scenario-simulator.ts"
Cohesion: 0.10
Nodes (24): BreakEvenInput, calculateBEPProgress(), calculateBEPRestaurants(), calculateBEPRevenue(), calculateBreakEven(), calculateContributionMargin(), GrowthSimulatorInput, GrowthSimulatorResult (+16 more)

### Community 19 - "tsconfig.json"
Cohesion: 0.29
Nodes (6): expo/tsconfig.base, compilerOptions, paths, strict, extends, include

### Community 20 - "metro.config.js"
Cohesion: 0.25
Nodes (7): config, { getDefaultConfig }, { withNativeWind }, expo@~51.0.0, nativewind@^4.0.1, expo, nativewind

### Community 23 - "expo-blur"
Cohesion: 0.33
Nodes (4): expo-blur@~13.0.0, expo-constants@~16.0.2, expo-blur, expo-constants

## Knowledge Gaps
- **15 isolated node(s):** `-applicationdidFinishLaunchingWithOptions`, `-applicationopenURLoptions`, `-applicationcontinueUserActivityrestorationHandler`, `-applicationdidRegisterForRemoteNotificationsWithDeviceToken`, `-applicationdidFailToRegisterForRemoteNotificationsWithError` (+10 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 146 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **27 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react-native` connect `formatIDR` to `package.json`, `dependencies`, `GlassBar.tsx`, `app/_layout.tsx`, `FloatingTabBar.tsx`?**
  _High betweenness centrality (0.053) - this node is a cross-community bridge._
- **What connects `-applicationdidFinishLaunchingWithOptions`, `-applicationopenURLoptions`, `-applicationcontinueUserActivityrestorationHandler` to the rest of the system?**
  _15 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Decoupled Financial Calculation Engine` be split into smaller, more focused modules?**
  _Cohesion score 0.10256410256410256 - nodes in this community are weakly interconnected._
- **Why does `react` connect `formatIDR` to `FloatingTabBar.tsx`, `GlassBar.tsx`, `package.json`, `dependencies`?**
  _High betweenness centrality (0.039) - this node is a cross-community bridge._
- **Should `formatIDR` be split into smaller, more focused modules?**
  _Cohesion score 0.1320669380370873 - nodes in this community are weakly interconnected._
- **Why does `dependencies` connect `dependencies` to `package.json`, `date-fns@^3.3.1`, `expo-dev-client@~4.0.14`, `expo-linking@~6.3.1`, `expo-print`, `expo-sharing`, `expo-status-bar@~1.12.0`, `@react-native-async-storage/async-storage@1.23.1`, `react-native-screens@~3.31.0`, `victory-native@^37.0.2`, `zod@^3.22.0`, `zustand`, `metro.config.js`, `expo-blur`?**
  _High betweenness centrality (0.039) - this node is a cross-community bridge._
- **Should `package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.1368421052631579 - nodes in this community are weakly interconnected._