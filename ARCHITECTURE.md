# Architecture Overview

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Browser (Client)                         │
│                                                              │
│  ┌────────────────────────────────────────────────────┐    │
│  │              Next.js App Router                     │    │
│  │                                                     │    │
│  │  ┌──────────────────────────────────────────┐     │    │
│  │  │  Layout (Sidebar + Header + Content)     │     │    │
│  │  └──────────────────────────────────────────┘     │    │
│  │                                                     │    │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐        │    │
│  │  │ Markets  │  │Portfolio │  │   Risk   │        │    │
│  │  │  Pages   │  │   Page   │  │Dashboard │        │    │
│  │  └──────────┘  └──────────┘  └──────────┘        │    │
│  │                                                     │    │
│  │  ┌───────────────────────────────────────┐        │    │
│  │  │   Components (Trading, Events, etc)   │        │    │
│  │  └───────────────────────────────────────┘        │    │
│  │                                                     │    │
│  │  ┌───────────────────────────────────────┐        │    │
│  │  │   Zustand Store (State Management)    │        │    │
│  │  └───────────────────────────────────────┘        │    │
│  │                                                     │    │
│  │  ┌───────────────────────────────────────┐        │    │
│  │  │      Mock Data (No Backend)           │        │    │
│  │  └───────────────────────────────────────┘        │    │
│  └────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────┘
```

## Component Hierarchy

```
App Layout
├── Sidebar
│   ├── Logo
│   ├── Navigation Links
│   │   ├── Markets
│   │   ├── Portfolio
│   │   ├── Risk Dashboard
│   │   └── Settings
│   └── Portfolio Summary
│
├── Header
│   ├── System Status
│   ├── Notifications
│   └── Wallet Address
│
└── Main Content
    ├── /markets
    │   └── Token List (Table)
    │
    ├── /markets/[symbol]
    │   ├── Trading Panel (Left)
    │   │   ├── Price Chart
    │   │   ├── Order Book
    │   │   └── Trading Form
    │   └── Event Markets (Right)
    │       └── Event Cards
    │           ├── Question
    │           ├── YES/NO Probabilities
    │           ├── Amount Input
    │           └── Buy Buttons
    │
    ├── /portfolio
    │   ├── Summary Cards
    │   ├── Token Holdings Table
    │   ├── Event Positions Table
    │   └── Hedge Analysis
    │
    ├── /risk-dashboard
    │   ├── Token Selector
    │   ├── Risk Metrics
    │   ├── Top Risks Table
    │   └── Hedge Recommendations
    │
    └── /settings
        ├── Account Settings
        ├── Notification Preferences
        ├── Risk Preferences
        └── Appearance
```

## Data Flow

```
┌──────────────┐
│  User Action │
└──────┬───────┘
       │
       ↓
┌──────────────────┐
│  React Component │
└──────┬───────────┘
       │
       ↓
┌──────────────────┐      ┌─────────────┐
│  Zustand Store   │←────→│  Mock Data  │
└──────┬───────────┘      └─────────────┘
       │
       ↓
┌──────────────────┐
│   UI Update      │
└──────────────────┘
```

### State Management Flow

```
Component Mounts
      ↓
useAppStore() hook subscribes to store
      ↓
Component renders with current state
      ↓
User interacts (click, input, etc.)
      ↓
Action called (e.g., setSelectedToken)
      ↓
Store state updates
      ↓
All subscribed components re-render
```

## Page Routing

```
/
└── Redirect to /markets

/markets
└── Display all tokens

/markets/[symbol]
├── Fetch token by symbol from store
├── Fetch related events by token
└── Display trading + hedging UI

/portfolio
├── Fetch portfolio positions
├── Calculate totals and P&L
└── Display holdings and hedges

/risk-dashboard
├── Select token
├── Calculate risk metrics
└── Generate hedge recommendations

/settings
└── Display configuration options
```

## State Structure

```typescript
AppState {
  selectedToken: string | null
  tokens: Token[]
  eventMarkets: EventMarket[]
  portfolioPositions: PortfolioPosition[]
  hedgePositions: HedgePosition[]
  
  // Actions
  setSelectedToken(symbol)
  getTokenBySymbol(symbol)
  getEventMarketsForToken(symbol)
  addPortfolioPosition(position)
  addHedgePosition(hedge)
}
```

## Data Models

### Token
```typescript
{
  symbol: string         // e.g., "APT"
  name: string          // e.g., "Aptos"
  price: number         // e.g., 8.40
  change24h: number     // e.g., -3.24
  volume24h: number     // e.g., 124500000
  riskScore: string     // "low" | "medium" | "high"
}
```

### Event Market
```typescript
{
  id: number
  token: string         // e.g., "APT"
  question: string      // "Will APT drop >30%?"
  yesProbability: number  // 0.22 (22%)
  noProbability: number   // 0.78 (78%)
  liquidity: number     // 45000
  description: string
  expiresIn: string     // "14 days"
}
```

### Portfolio Position
```typescript
{
  id: string
  type: "token" | "event"
  symbol?: string       // For token positions
  eventId?: number      // For event positions
  amount: number
  entryPrice: number
  currentValue: number
  pnl: number
  pnlPercent: number
}
```

## Styling System

### Color Scheme
```
Background:  #0b0e11 (Very dark blue-gray)
Surface:     #161a1e (Dark gray)
Border:      #2b3139 (Medium gray)
Primary:     #f0b90b (Gold/Yellow - Binance style)
Success:     #0ecb81 (Green)
Danger:      #f6465d (Red)
```

### Layout Structure
```
┌──────────────────────────────────────────┐
│ Header (h-16)                            │
├───────┬──────────────────────────────────┤
│       │                                  │
│ Side  │                                  │
│ bar   │         Main Content             │
│       │         (flex-1)                 │
│ (w-64)│                                  │
│       │                                  │
│       │                                  │
└───────┴──────────────────────────────────┘
```

## Component Responsibilities

### TradingPanel
- Display token price and chart
- Show order book (bids/asks)
- Handle order type selection (limit/market)
- Handle buy/sell toggle
- Calculate estimated costs
- Submit orders (currently shows alerts)

### EventMarketCard
- Display event question
- Show YES/NO probabilities
- Handle outcome selection
- Calculate share costs
- Show liquidity and expiration
- Submit hedge orders (currently shows alerts)

### Sidebar
- Navigation between pages
- Show current route
- Display quick portfolio summary

### Header
- System status indicator
- Notification bell
- Wallet address display

## Security Considerations (For Future Implementation)

### Current State (MVP)
- ✅ No backend = No server vulnerabilities
- ✅ No wallet connection = No signing risks
- ✅ No smart contracts = No exploit risks
- ✅ All data is local/mock

### Future Additions Would Need
- 🔒 Wallet connection security
- 🔒 Transaction signing verification
- 🔒 Smart contract audits
- 🔒 API authentication
- 🔒 Input sanitization
- 🔒 Rate limiting
- 🔒 CSRF protection

## Performance Characteristics

### Current Performance
- **First Load**: ~100-200ms (no data fetching)
- **Page Navigation**: Instant (client-side routing)
- **State Updates**: <16ms (synchronous Zustand)
- **Build Size**: ~200KB gzipped

### Optimization Opportunities
- Code splitting by route (already enabled in Next.js)
- Image optimization (none currently needed)
- Bundle size reduction (minimal dependencies)
- Lazy loading for charts (when added)

## Extension Points

### Where to Add Features

**Real-time Price Updates**
- Location: `lib/store.ts`
- Add: WebSocket subscription
- Update: Token prices in store

**Chart Integration**
- Location: `components/TradingPanel.tsx`
- Replace: Chart placeholder div
- Add: TradingView widget or Recharts

**Wallet Connection**
- Location: `app/layout.tsx`
- Add: RainbowKit provider
- Update: Header component

**Smart Contract Integration**
- Location: New `lib/contracts/` folder
- Add: Contract ABIs and hooks
- Update: Trading and event components

**Backend API**
- Location: New `lib/api/` folder
- Add: Fetch functions
- Replace: Mock data imports

**Database**
- Location: Backend (separate repo)
- Add: PostgreSQL/MongoDB
- Store: User data, orders, events

## Development Workflow

```
1. Edit Code
   ↓
2. Next.js Hot Reload (automatic)
   ↓
3. Browser Updates (automatic)
   ↓
4. Test in Browser
   ↓
5. Repeat
```

### File Watch Pattern
```
src/**/*.{ts,tsx} → TypeScript compilation
app/**/*.{ts,tsx} → Next.js rebuild
**/*.css → Tailwind rebuild
```

## Build Process

```
Development:
npm run dev → next dev
  ↓
- Start dev server
- Enable hot reload
- Source maps included
- No optimization

Production:
npm run build → next build
  ↓
- TypeScript compilation
- Tree shaking
- Code minification
- CSS optimization
- Static page generation
  ↓
npm start → next start
  ↓
- Serve optimized build
- Production mode
```

## Testing Strategy (Future)

### Unit Tests
- Components: React Testing Library
- Utils: Jest
- Store: Zustand testing utilities

### Integration Tests
- User flows: Playwright or Cypress
- API calls: MSW (Mock Service Worker)

### E2E Tests
- Critical paths: Playwright
- Cross-browser: BrowserStack

## Deployment Options

### Static Export (Recommended for MVP)
```bash
npm run build
npm run export
```
Deploy to: Vercel, Netlify, GitHub Pages

### Server Deployment
```bash
npm run build
npm start
```
Deploy to: Vercel, Railway, AWS, DigitalOcean

### Docker (Future)
```dockerfile
FROM node:18-alpine
COPY . .
RUN npm install
RUN npm run build
CMD ["npm", "start"]
```

---

**This architecture is designed for easy extension while maintaining clean separation of concerns.**
