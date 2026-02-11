# Quick Start Guide

## 🚀 Get Running in 60 Seconds

```bash
# 1. Install dependencies (20 seconds)
npm install

# 2. Start development server (5 seconds)
npm run dev

# 3. Open browser
# Visit http://localhost:3000
```

That's it! The app is now running.

## 📸 First Time Setup

### Step 1: Install Dependencies
```bash
npm install
```
Wait for the installation to complete (~20 seconds).

### Step 2: Start Dev Server
```bash
npm run dev
```

You should see:
```
  ▲ Next.js 14.2.x
  - Local:        http://localhost:3000
  - Ready in xxxms
```

### Step 3: Open Browser
Navigate to: **http://localhost:3000**

You'll be automatically redirected to `/markets`

## 🎯 5-Minute Tour

### Minute 1: Markets Page
- You're now at `/markets`
- See 4 tokens: APT, OP, ETH, ARB
- Each shows price, 24h change, volume, risk score
- **Action**: Click "Trade" on APT

### Minute 2: Trading Interface
- Now at `/markets/APT`
- **Left side**: Binance-style trading
  - See price chart placeholder
  - View order book with bids/asks
  - Try the trading form:
    - Click "Buy" or "Sell"
    - Choose "Limit" or "Market"
    - Enter amount (or click 25%, 50%, 75%, 100%)
    - Click confirm button
- **Right side**: Polymarket-style hedging
  - See 3 event markets for APT
  - Each shows YES/NO probabilities

### Minute 3: Event Hedging
- On right panel, find: "Will APT drop >30% in 14 days?"
- **Actions**:
  - Hover over ℹ️ icon to see description
  - Click on "YES" card (22% probability)
  - Enter 100 shares
  - See estimated cost: $22
  - Click "Buy YES" button

### Minute 4: Portfolio
- Click "Portfolio" in left sidebar
- See overview:
  - Total portfolio value: $6,322
  - Total P&L: +$12.50
  - Active hedges: 1
- **Token Holdings Table**:
  - 250 APT (-2.89% P&L)
  - 1.5 ETH (+1.82% P&L)
- **Event Positions Table**:
  - 100 shares in APT risk event
- Scroll down to see hedge analysis

### Minute 5: Risk Dashboard
- Click "Risk Dashboard" in left sidebar
- See risk metrics for APT:
  - Current price: $8.40
  - Volatility: Medium
  - Active risks: 3 events
  - Position size: 250 tokens
- **Review**:
  - Top identified risks table
  - Hedge recommendation (suggests $630 hedge)
  - Detailed explanation of how hedging works

## 🎮 Interactive Demo Flow

### Scenario: Hedge Your APT Position

**Context**: You hold 250 APT tokens worth $2,100. You're worried about a price drop.

**Step 1**: Check your risk
```
Go to /risk-dashboard
Select APT from token selector
Review: Medium volatility, 22% chance of 30%+ drop
```

**Step 2**: View hedge options
```
Go to /markets/APT
Look at right panel "Hedge Risk"
Find event: "Will APT drop >30% in 14 days?"
Current probability: 22% (YES), 78% (NO)
```

**Step 3**: Calculate hedge size
```
Your position: 250 APT × $8.40 = $2,100
30% downside: $630 potential loss
Hedge cost: 100 shares × $0.22 = $22
Potential payout: 100 shares × $1.00 = $100
```

**Step 4**: Place hedge order
```
1. Click YES card (22%)
2. Enter 100 shares
3. See cost: $22
4. Click "Buy YES"
5. (Alert shows for demo - would execute in production)
```

**Step 5**: Monitor in portfolio
```
Go to /portfolio
See your hedge position
View hedge analysis section
```

## 📱 Navigation Guide

### Sidebar Links
- **Markets** → Token list and trading
- **Portfolio** → Your holdings and hedges
- **Risk Dashboard** → Risk analysis and recommendations
- **Settings** → Configuration options

### Page URLs
- `/markets` - Token list
- `/markets/APT` - Trade APT
- `/markets/OP` - Trade OP
- `/markets/ETH` - Trade ETH
- `/markets/ARB` - Trade ARB
- `/portfolio` - Your positions
- `/risk-dashboard` - Risk analysis
- `/settings` - Configuration

## 🎨 UI Elements Guide

### Token Cards
```
┌────────────────────────────────────┐
│ [APT]  Aptos                       │
│ $8.40          -3.24% ↓            │
│ Volume: $124.5M    Medium Risk     │
│                    [Trade →]       │
└────────────────────────────────────┘
```

### Event Cards
```
┌────────────────────────────────────┐
│ Will APT drop >30% in 14 days?  ℹ️ │
│                                    │
│ [  YES  ]          [   NO   ]      │
│   22%                78%           │
│  $0.22/share       $0.78/share     │
│                                    │
│ Shares: [_____]                    │
│ Estimated: $0.00                   │
│ [Buy YES] or [Buy NO]              │
│                                    │
│ ⏱ 14 days  💰 $45K liquidity       │
└────────────────────────────────────┘
```

### Order Book
```
Price       Amount      Total
$8.42       2,450      $20,604  ← Asks (red)
$8.41       2,450      $20,604
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
$8.40       CURRENT PRICE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
$8.39       1,250      $10,487  ← Bids (green)
$8.38       2,300      $19,274
```

## 🔧 Customization Tips

### Change Token Price
File: `lib/mock-data.ts`
```typescript
{
  symbol: "APT",
  price: 8.40,  // Change this
  // ...
}
```

### Add New Token
File: `lib/mock-data.ts`
```typescript
{
  symbol: "SOL",
  name: "Solana",
  price: 125.50,
  change24h: 5.2,
  volume24h: 2500000000,
  riskScore: "low",
}
```

### Modify Colors
File: `tailwind.config.ts`
```typescript
primary: "#f0b90b",  // Gold/yellow
success: "#0ecb81",  // Green
danger: "#f6465d",   // Red
```

## 💡 Pro Tips

1. **Multiple Tokens**: Try switching between APT, OP, ETH, ARB to see different event markets

2. **Order Types**: 
   - Limit: Set your own price
   - Market: Execute at current price

3. **Percentage Shortcuts**: Use 25%, 50%, 75%, 100% buttons for quick amount selection

4. **Info Icons**: Hover over ℹ️ icons for detailed explanations

5. **Risk Scores**: 
   - 🟢 Low Risk: Stable tokens
   - 🟡 Medium Risk: Moderate volatility
   - 🔴 High Risk: High volatility

## 🐛 Troubleshooting

### Port Already in Use
```bash
# Kill process on port 3000
npx kill-port 3000

# Or use different port
npm run dev -- -p 3001
```

### Module Not Found
```bash
rm -rf node_modules package-lock.json
npm install
```

### Build Errors
```bash
rm -rf .next
npm run dev
```

### Hot Reload Not Working
```bash
# Restart dev server
# Press Ctrl+C, then run:
npm run dev
```

## 📚 Next Steps

1. ✅ **Explore all pages** - Markets, Portfolio, Risk Dashboard, Settings
2. ✅ **Try different tokens** - APT, OP, ETH, ARB
3. ✅ **Understand event markets** - Read descriptions and probabilities
4. ✅ **Check portfolio** - See holdings and hedge positions
5. ✅ **Review risk dashboard** - Understand hedge recommendations

### Ready for More?

- Read `README.md` for full documentation
- Read `ARCHITECTURE.md` to understand the structure
- Read `SETUP.md` for detailed setup guide
- Read `SECURITY.md` before production deployment

## 🎉 You're Ready!

You now have a fully functional crypto risk hedging platform running locally. Explore, experiment, and customize!

**Questions?** Check the other documentation files or create an issue.

---

**Happy Trading & Hedging! 📈🛡️**
