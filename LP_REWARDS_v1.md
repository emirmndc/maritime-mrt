# MRT LP Rewards (v1) — 30 Days

## Purpose
This program is designed to increase MRT/USDC liquidity depth and reduce slippage on Polygon.
It is NOT a price guarantee and NOT an investment promise.

---

## Program Summary
- Network: Polygon PoS
- Pair: MRT / USDC
- Duration: 30 days
- Start: 27.02.2026
- End: 29.03.2026
- Payout date: 30.03.2026 (end + 1 day)
- Total rewards: 500,000 MRT (fixed)
- Snapshot time: Daily at 21:00 (UTC+3)
- Reward method: Liquidity + time (NOT trading volume)

---

## How to Participate (Add Liquidity)
1) Open QuickSwap (Polygon)
2) Go to **Pools / Liquidity**
3) Click **Add Liquidity**
4) Select pair **USDC + MRT**
5) If v3 asks for price range, choose **Full Range**
6) Approve USDC (if prompted) → **Supply**

---

## Points (Simple Calculation)
At each daily snapshot time (21:00 UTC+3), every LP wallet earns:

**Daily Points = Your liquidity value in USD at snapshot**

Example:
- If your LP value is **$50** at snapshot → you earn **50 points** for that day.
- If you are not providing liquidity at snapshot → you earn **0 points** for that day.

**Total Points (per wallet) = sum of daily points across 30 days**

---

## Reward Formula
Your share:

**Share = Your Total Points / Total Points (all participants)**

Your reward:

**Reward = 500,000 MRT × Share**

Notes:
- Total reward pool is fixed. Individual rewards change depending on total participation.
- Rewards are based on liquidity + time only. No volume-based rewards (to avoid wash trading incentives).

---

## Fairness & Eligibility
- Any wallet providing liquidity to the MRT/USDC pool at snapshot time is eligible.
- Owner/Team wallets (if any) are excluded from receiving rewards to avoid unfair advantage.

### Registration (Required Info for Payout)
To receive rewards, participants must provide:
1) **Polygon wallet address (0x...)** — rewards will be paid to this address  
2) **QuickSwap v3 Position NFT ID (tokenId)** for the MRT/USDC position

Notes:
- The **tokenId is required** for daily on-chain position valuation and points calculation.
- A **position link is optional** (tokenId is sufficient).
- If a participant has multiple positions, they should submit **each tokenId** (one per line).

---

## Transparency
- Reward Wallet (Polygon): 0xD48D424146E61806b18E7262218358f19f9e9317
- Funding transaction (PolygonScan): https://polygonscan.com/tx/0x08eb8a0066eb0505cc1f9cb88666aded84deeaab0979f8804bb6fca9e7038387
- Rewards are funded from the Community allocation.
- All payouts will be published as on-chain transactions after the program ends.

---

## If No One Participates
If there are no eligible LP participants, no rewards will be distributed.
Unused rewards remain in the Reward Wallet and may be rolled into a future program or returned to the Community allocation.

---

## Risks / Disclaimer
Providing liquidity involves risks, including impermanent loss (IL).
This program does not guarantee profit. Participate at your own discretion.
