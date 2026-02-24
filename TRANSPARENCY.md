# MARITIME (MRT) – Transparency Notes

This document summarizes the current transparency and token-level security posture of MARITIME (MRT).

## Token-Level Design (Current Status)
- **Token standard:** ERC-20 (Polygon PoS)
- **Fixed supply:** 100,000,000 MRT
- **Minting:** No minting after deployment (one-time mint in constructor only)
- **Token tax:** No buy/sell tax
- **Blacklist:** No blacklist
- **Pause:** No pause function
- **Admin mint:** No admin mint function
- **Verified contract:** Yes (source code verified on PolygonScan)

## Ownership / Control Status
- **Ownership status:** Renounced (if applicable – confirm on PolygonScan before publishing)
- The token contract is designed to be minimal and does not include privileged admin controls for tax/blacklist/pause behavior.

## Liquidity & Market Access
- MRT is intended for **open-market trading** through decentralized exchanges (DEXs).
- Liquidity is provided progressively and may start small while the market is being bootstrapped.
- Liquidity and market metadata visibility (DEX tools, token profiles, links, logos) are part of the early market access phase.

## Roadmap Scope Clarification
- **What is live today:** Verified ERC-20 token on Polygon + DEX liquidity
- **What is not live yet (roadmap):** Maritime settlement workflows, dispute layer, reporting/proof modules, integrations

## Important Note
This document is for transparency and informational purposes only. It is not investment advice.
