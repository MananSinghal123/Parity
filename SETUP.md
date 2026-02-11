# Setup Guide

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

This will install:
- Next.js 14.2.3
- React 18.3.1
- TypeScript 5.4.5
- TailwindCSS 3.4.3
- Zustand 4.5.2
- Lucide React 0.378.0

### 2. Run Development Server

```bash
npm run dev
```

The application will start at [http://localhost:3000](http://localhost:3000)

### 3. Navigate the Application

The app will automatically redirect from `/` to `/markets`.

## Page Routes

| Route | Description |
|-------|-------------|
| `/markets` | Token list with prices and risk scores |
| `/markets/APT` | Trading interface for APT with hedging panel |
| `/markets/OP` | Trading interface for OP with hedging panel |
| `/markets/ETH` | Trading interface for ETH with hedging panel |
| `/markets/ARB` | Trading interface for ARB with hedging panel |
| `/portfolio` | Portfolio overview with holdings and hedges |
| `/risk-dashboard` | Risk analysis and hedge recommendations |
| `/settings` | Account and preference settings |

## What to Expect

### Markets Page
- See 4 tokens: APT, OP, ETH, ARB
- Each shows current price, 24h change, volume, and risk score
- Click any token to start trading

### Trading Page (e.g., `/markets/APT`)

**Left Side - Trading Interface:**
- Price chart placeholder (ready for TradingView integration)
- Real-time order book with bids and asks
- Buy/Sell toggle
- Limit/Market order types
- Amount input with 25%, 50%, 75%, 100% shortcuts
- Estimated cost calculator
- Confirm button (shows alert for demo)

**Right Side - Hedging Panel:**
- 3 event markets per token
- Each card shows:
  - Event question
  - YES/NO probabilities
  - Current share price
  - Liquidity amount
  - Time until expiration
  - Info tooltip with details
- Click YES or NO to select outcome
- Enter number of shares
- Buy button to confirm (shows alert for demo)

### Portfolio Page
- **Summary Cards:**
  - Total portfolio value
  - Total P&L (profit/loss)
  - Number of active hedges
- **Token Holdings Table:**
  - Token, amount, entry price, current value, P&L
- **Event Positions Table:**
  - Event description, shares held, value
- **Hedge Analysis:**
  - Shows how hedges protect your positions

### Risk Dashboard
- **Token Selector:** Switch between APT, OP, ETH, ARB
- **Risk Metrics:**
  - Current price with 24h change
  - Volatility level (Low/Medium/High)
  - Number of active risks
  - Your position size
- **Top Risks Table:**
  - Lists highest probability events
  - Shows severity and potential impact
- **Hedge Recommendation:**
  - Calculates suggested hedge size (30% of position)
  - Explains how the hedge works
  - Shows example calculation
  - Link to view hedge markets

### Settings Page
- Account settings (wallet address)
- Notification preferences
- Risk tolerance settings
- Theme selection

## User Flow Examples

### Example 1: Trading and Hedging APT

1. Go to `/markets`
2. Click on "Trade" button for APT
3. On the trading page:
   - Left side: Buy 250 APT at market price
   - Right side: See event "Will APT drop >30% in 14 days?"
   - Click on YES card (22% probability)
   - Enter 100 shares
   - Click "Buy YES" button
4. Check `/portfolio` to see your positions
5. Check `/risk-dashboard` to see hedge effectiveness

### Example 2: Monitoring Risk

1. Go to `/risk-dashboard`
2. Select APT from token selector
3. Review:
   - Current price: $8.40
   - Volatility: Medium (3.24% change)
   - Active risks: 3 events
   - Position: 250 tokens
4. Read hedge recommendation:
   - Suggested hedge: $630 (30% of position)
   - Buy 100 YES shares at $0.22 = $22 cost
   - Potential payout: $100 if event occurs
5. Click button to view hedge markets for APT

## Mock Data Details

### Token Prices
- **APT**: $8.40 (-3.24% / 24h), $124.5M volume, Medium Risk
- **OP**: $3.12 (+1.87% / 24h), $89.2M volume, Low Risk
- **ETH**: $2,800.00 (+0.45% / 24h), $8.95B volume, Low Risk
- **ARB**: $1.50 (-1.12% / 24h), $156.7M volume, Medium Risk

### Event Probabilities
All event markets have realistic probabilities:
- Price drop events: 18-28% probability
- Network incidents: 8-15% probability
- Token unlocks: 35% probability

### Portfolio Holdings
Pre-loaded with:
- 250 APT (entry $8.65, current value $2,100, -2.89% P&L)
- 1.5 ETH (entry $2,750, current value $4,200, +1.82% P&L)
- 100 event shares (event market #1, $22 value)

Total portfolio value: $6,322.00

## Testing the Application

### Test Trading Flow
1. Go to `/markets/APT`
2. Try changing order type between Limit and Market
3. Switch between Buy and Sell
4. Enter different amounts
5. Click percentage shortcuts (25%, 50%, 75%, 100%)
6. Click confirm button (will show alert)

### Test Hedging Flow
1. On trading page right panel
2. Hover over info icon to see event details
3. Click YES or NO outcome
4. Enter share amount
5. See estimated cost calculation
6. Click Buy button (will show alert)

### Test Portfolio View
1. Go to `/portfolio`
2. Review token holdings table
3. Review event positions
4. Check hedge analysis section

### Test Risk Dashboard
1. Go to `/risk-dashboard`
2. Switch between different tokens (APT, OP, ETH, ARB)
3. Review risk metrics
4. Read top risks table
5. Review hedge recommendation

## Customization Tips

### Change Mock Prices
Edit `lib/mock-data.ts`:
```typescript
price: 8.40, // Change this number
```

### Add More Tokens
Edit `lib/mock-data.ts` and add to `MOCK_TOKENS` array:
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

### Add More Events
Edit `lib/mock-data.ts` and add to `MOCK_EVENT_MARKETS` array:
```typescript
{
  id: 10,
  token: "SOL",
  question: "Will SOL reach $150 in 7 days?",
  yesProbability: 0.40,
  noProbability: 0.60,
  liquidity: 60000,
  description: "Resolution details...",
  expiresIn: "7 days",
}
```

### Modify Colors
Edit `tailwind.config.ts`:
```typescript
colors: {
  primary: "#f0b90b", // Binance yellow
  success: "#0ecb81", // Green
  danger: "#f6465d",  // Red
}
```

## Troubleshooting

### Port Already in Use
```bash
# Kill process on port 3000
npx kill-port 3000

# Or use a different port
npm run dev -- -p 3001
```

### Module Not Found Errors
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

### TypeScript Errors
```bash
# Rebuild TypeScript
npm run build
```

### Styling Issues
```bash
# Rebuild Tailwind
rm -rf .next
npm run dev
```

## Browser Compatibility

- Chrome/Edge: ✅ Fully supported
- Firefox: ✅ Fully supported
- Safari: ✅ Fully supported
- Mobile browsers: ⚠️ Not optimized (desktop-first design)

## Performance Notes

- All data is mock/static (no API calls)
- No backend connections
- Instant page loads
- No database queries
- Pure frontend rendering

## Next Steps

After familiarizing yourself with the MVP:

1. **Add real data**: Replace mock data with API calls
2. **Integrate Web3**: Add wallet connection (RainbowKit, Wagmi)
3. **Add charts**: Integrate TradingView or Recharts
4. **Smart contracts**: Deploy event market contracts
5. **Backend API**: Add order matching, user accounts
6. **Mobile responsive**: Optimize for mobile screens
7. **Testing**: Add unit and integration tests

## Support

This is a demonstration project. For questions or issues, refer to the main README.md file.

---

**Happy Trading & Hedging! 📈🛡️**
