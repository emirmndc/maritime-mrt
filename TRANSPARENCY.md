# MARITIME (MRT) Transparency Notes

This document provides a high-level transparency overview for the MARITIME (MRT) token on Polygon PoS.

## Project Status (Important)
- **What exists today:** A live, verified ERC-20 token (MRT) on Polygon PoS and an active DEX liquidity position.
- **What is not live yet:** Maritime settlement workflows, dispute layer, reporting/proof modules, and integrations are **roadmap items**, not currently deployed production utilities.

## Token Basics
- **Name:** MARITIME
- **Symbol:** MRT
- **Network:** Polygon PoS
- **Standard:** ERC-20
- **Decimals:** 18
- **Total Supply:** 100,000,000 MRT (fixed supply)

## Contract Design (High-level)
- **Fixed supply:** Yes
- **Mint after deployment:** **No** (one-time mint at deployment only)
- **Transfer tax / buy-sell tax:** **No**
- **Blacklist function:** **No**
- **Pause function:** **No**
- **Admin mint function:** **No**

## Ownership / Admin Control
- MRT is designed as a minimal ERC-20 implementation with no hidden admin controls for token transfer restrictions, tax updates, or post-deploy minting.
- Ownership/admin status should be verified on the block explorer and source code verification page.

> Users should always verify the contract address and source code directly on PolygonScan before interacting.

## Contract Verification
- **Source code verification:** Completed on PolygonScan
- **Explorer:** PolygonScan token page (official contract address)

## Market & Liquidity Approach
- MRT follows an **open-market** approach.
- Liquidity is formed on decentralized exchanges (DEXs) and may start small, then grow over time.
- Early-stage liquidity may be limited, which can increase slippage and volatility.

## Risk Disclosure (High-level)
MRT is a crypto asset and participation carries risk, including but not limited to:
- market volatility
- low-liquidity slippage
- smart contract interaction risk
- operational wallet security risk
- roadmap execution risk

## What We Are Building Toward (Roadmap)
The long-term vision includes maritime logistics utility modules, such as:
- USDC-based escrow settlement workflows
- milestone-based release logic
- dispute workflow design
- reporting / proof artifacts (including carbon-related reporting concepts)

These are roadmap goals and should not be interpreted as currently live features.

## Official References
- **Contract (Polygon):** `0x94966B292DD32cD3fb82A83e60a56cEB3322D8FE`

---

This transparency note is intended for informational purposes only and does not constitute financial, legal, or tax advice.
