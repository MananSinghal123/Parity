# Parity - Crypto Risk Hedging Platform

> **A professional crypto trading platform with integrated risk management through event markets.**

**Built with Next.js 14, TypeScript, TailwindCSS, and Zustand.**

🚀 **Status: Complete and Running** | 📱 Visit: http://localhost:3000

## 🎯 Core Concept

Parity combines traditional crypto trading (like Binance) with event-based risk hedging (like Polymarket) to help users manage downside risk on their token positions.

**This is NOT gambling. This is risk management.**

## ✨ Features

- **Token Trading**: Binance-style spot trading interface with order books and limit/market orders
- **Event Markets**: Polymarket-inspired hedging through prediction markets
- **Portfolio Management**: Track token holdings and event positions
- **Risk Dashboard**: Monitor volatility, active risks, and get hedge recommendations
- **Professional UI**: Dark theme with institutional-grade design

## 🏗️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: TailwindCSS
- **State Management**: Zustand
- **Icons**: Lucide React
- **Data**: Mock data only (no smart contracts)

## 📁 Project Structure

```
parity/
├── app/
│   ├── globals.css           # Global styles
│   ├── layout.tsx            # Root layout with sidebar
│   ├── page.tsx              # Redirects to /markets
│   ├── markets/
│   │   ├── page.tsx          # Token list view
│   │   └── [symbol]/
│   │       └── page.tsx      # Trading + hedging interface
│   ├── portfolio/
│   │   └── page.tsx          # Portfolio overview
│   ├── risk-dashboard/
│   │   └── page.tsx          # Risk analysis & recommendations
│   └── settings/
│       └── page.tsx          # Settings page
├── components/
│   ├── Sidebar.tsx           # Left navigation sidebar
│   ├── Header.tsx            # Top header bar
│   ├── TradingPanel.tsx      # Binance-style trading interface
│   └── EventMarketCard.tsx   # Polymarket-style event cards
├── lib/
│   ├── types.ts              # TypeScript interfaces
│   ├── mock-data.ts          # Mock tokens, events, portfolio
│   ├── store.ts              # Zustand state management
│   └── utils.ts              # Utility functions
└── package.json
```

## 🚀 Getting Started

### Installation

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Run the development server**:
   ```bash
   npm run dev
   ```

3. **Open your browser**:
   Navigate to [http://localhost:3000](http://localhost:3000)

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

## 📊 Mock Data

The application uses hardcoded mock data:

### Tokens
- **APT** (Aptos): $8.40
- **OP** (Optimism): $3.12
- **ETH** (Ethereum): $2,800.00
- **ARB** (Arbitrum): $1.50

### Event Markets
Each token has associated risk events:
- Price drop scenarios (e.g., "Will APT drop >30% in 14 days?")
- Network incidents (e.g., "Will Aptos network halt?")
- Token unlock events (e.g., "Will major unlock >5% supply occur?")

### Portfolio
Pre-populated with sample positions:
- 250 APT tokens
- 1.5 ETH
- 100 shares in an event market

## 🎨 UI/UX Highlights

### Markets Page (`/markets`)
- Grid view of all tradeable tokens
- Real-time price, 24h change, volume
- Risk score indicators (low/medium/high)
- Click any token to open trading interface

### Trading Page (`/markets/[symbol]`)
**Left Side (Binance-style)**:
- Price chart placeholder
- Live order book (bids/asks)
- Trading form with limit/market orders
- Buy/sell toggle
- Amount input with percentage shortcuts

**Right Side (Polymarket-style)**:
- "Hedge Risk" panel
- Event market cards with YES/NO probabilities
- Interactive betting interface
- Liquidity and expiration info
- Educational tooltips

### Portfolio Page (`/portfolio`)
- Total portfolio value & P&L
- Token holdings table
- Event positions (hedges)
- Hedge effectiveness analysis

### Risk Dashboard (`/risk-dashboard`)
- Token selector
- Current price & volatility metrics
- Top identified risks table
- Suggested hedge strategy with calculations
- Educational explanations

## 🎯 User Flow Example

1. User views markets and sees APT is down 3.24%
2. User clicks on APT to open trading interface
3. User buys 250 APT tokens using the left panel
4. User sees right panel showing event: "Will APT drop >30% in 14 days?" at 22% probability
5. User buys 100 YES shares for $22 as insurance
6. If APT drops 30%, user receives $100 payout, offsetting losses
7. User monitors everything in Portfolio and Risk Dashboard

## 🔧 Customization

### Adding New Tokens
Edit `lib/mock-data.ts`:
```typescript
export const MOCK_TOKENS: Token[] = [
  {
    symbol: "NEW",
    name: "New Token",
    price: 10.50,
    change24h: 2.5,
    volume24h: 50000000,
    riskScore: "medium",
  },
  // ... other tokens
];
```

### Adding New Event Markets
Edit `lib/mock-data.ts`:
```typescript
export const MOCK_EVENT_MARKETS: EventMarket[] = [
  {
    id: 10,
    token: "NEW",
    question: "Will NEW drop >20% in 14 days?",
    yesProbability: 0.30,
    noProbability: 0.70,
    liquidity: 40000,
    description: "Resolution criteria...",
    expiresIn: "14 days",
  },
  // ... other events
];
```

### Customizing Colors
Edit `tailwind.config.ts`:
```typescript
colors: {
  primary: "#f0b90b",  // Change primary color
  success: "#0ecb81",  // Change success color
  danger: "#f6465d",   // Change danger color
  // ... other colors
}
```

## 🎓 Key Concepts

### Risk Hedging
Instead of stop-loss orders, users can hedge specific risks:
- **Price crashes**: Buy YES on "Will token drop >30%?"
- **Network issues**: Buy YES on "Will network halt?"
- **Token unlocks**: Buy YES on "Will major unlock occur?"

### Payoff Structure
- Buy 100 YES shares at $0.22/share = $22 cost
- If event occurs: Receive $100 (100 shares × $1)
- Net profit: $78 ($100 - $22)
- This offsets losses in your token position

### Why This Works
Traditional stop-losses have problems:
- Can be triggered by wicks
- May sell at worst prices
- Can't be reversed

Event markets provide:
- Defined risk scenarios
- Payoff if specific event occurs
- No forced liquidation
- Can hold both positions

## 🚧 Future Enhancements

This is a frontend-only MVP. Future additions could include:
- Smart contract integration
- Real-time price feeds
- Actual order matching
- User authentication
- Transaction history
- Advanced charting (TradingView)
- Mobile responsive design
- Liquidity pools
- Market maker functionality

## 📝 License

MIT License - feel free to use this project as a starting point for your own applications.

## 🤝 Contributing

This is a demonstration project. Feel free to fork and customize for your needs.

---

**Built with ❤️ for crypto risk management**
