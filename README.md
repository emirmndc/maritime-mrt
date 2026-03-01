<img src="maritime.png" alt="MARITIME Logo" width="220" />

# MARITIME (MRT)

MARITIME (MRT) is a fixed-supply ERC-20 token deployed on **Polygon PoS**.

## On-chain Details

- **Network:** Polygon PoS (Mainnet)
- **Contract:** `0x94966B292DD32cD3fb82A83e60a56cEB3322D8FE`
- **Name / Symbol:** MARITIME / MRT
- **Decimals:** 18
- **Total Supply:** 100,000,000 MRT (fixed)

## Official Wallet Addresses (Polygon)

These wallets are published for transparency and operational clarity.

| Role | Address | Explorer |
|---|---|---|
| Deploy / Receive Account | `0xB014d095a6E23A08e134eFB9cb411F6b21d0f0cC` | https://polygonscan.com/address/0xB014d095a6E23A08e134eFB9cb411F6b21d0f0cC |
| Owner / Founder Hold | `0x6A306d380D04870126d9ad8426827990A9128648` | https://polygonscan.com/address/0x6A306d380D04870126d9ad8426827990A9128648 |
| Liquidity Pool Wallet | `0xe14A49BD376E9DaC99DfdD76B871CdcC2733141C` | https://polygonscan.com/address/0xe14A49BD376E9DaC99DfdD76B871CdcC2733141C |
| Treasury | `0xb1089ffD8Cf69Dd82d9E34C6f55122e0021954D9` | https://polygonscan.com/address/0xb1089ffD8Cf69Dd82d9E34C6f55122e0021954D9 |
| Community | `0x7045f0db513F1c0Bc85b3EB9Df68F7a38389adb3` | https://polygonscan.com/address/0x7045f0db513F1c0Bc85b3EB9Df68F7a38389adb3 |

### Program Wallets

- **LP Rewards (v1) Reward Wallet:** `0xD48D424146E61806b18E7262218358f19f9e9317`  
  Details: see `LP_REWARDS_v1.md`

## Programs

- **LP Rewards (v1):** [LP_REWARDS_v1.md](./LP_REWARDS_v1.md)

## Source Code

The token contract source is in [`contracts/Maritime.sol`](./contracts/Maritime.sol).

## Official Links

- **Polygonscan:** https://polygonscan.com/token/0x94966B292DD32cD3fb82A83e60a56cEB3322D8FE
- **GitHub:** https://github.com/maritime-mrt/maritime-mrt
- **X (Twitter):** https://x.com/maritime_coin
- **QuickSwap dApp:** https://dapp.quickswap.exchange/swap/best/0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359/0x94966B292DD32cD3fb82A83e60a56cEB3322D8FE
- **DEX Screener:** https://dexscreener.com/polygon/0x3c959fd489cbf4060edf4c4b7133895c1e78edde

## Documentation

- **Whitepaper:** https://github.com/maritime-mrt/maritime-mrt/blob/main/MARITIME_MRT_Whitepaper_v1.4_clean.pdf
- **Transparency Notes:** [TRANSPARENCY.md](./TRANSPARENCY.md)
- **Tokenomics & Wallet Roles:** [TOKENOMICS.md](./TOKENOMICS.md)

## Genesis Logbook

The MRT Genesis Logbook records independent on-chain DEX buy transactions as the market forms.

- Logbook: [GENESIS_LOGBOOK.md](./GENESIS_LOGBOOK.md)
- Update time: 21:00 (UTC+3)

## Security Notes (High-level)

- Fixed supply minted **once** at deployment (constructor).
- No mint function after deployment.
- No owner/admin controls (no pausing, blacklists, or taxes).

## Disclaimer

This repository is provided for transparency and informational purposes only.  
Nothing here constitutes financial advice.
