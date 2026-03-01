# Contract Verification (PolygonScan)

This file records the compile and verification parameters used for the MARITIME (MRT) token contract on PolygonScan.

## Contract
- **Network:** Polygon PoS (Mainnet)
- **Address:** `0x94966B292DD32cD3fb82A83e60a56cEB3322D8FE`
- **PolygonScan:** https://polygonscan.com/token/0x94966B292DD32cD3fb82A83e60a56cEB3322D8FE

## Source
- Main contract file: `contracts/Maritime.sol`
- OpenZeppelin ERC20 base: `@openzeppelin/contracts` (ERC20)

## Compilation / Verification Parameters (used)
- **Solidity compiler version:** `0.8.24`
- **Optimization:** `DISABLED`
- **Optimizer runs:** `200` *(not used because optimization is disabled, kept for record)*
- **License:** MIT
- **Constructor arguments:** None

## Design Notes (high-level)
- Fixed supply minted once at deployment (constructor).
- No mint function after deployment.
- No owner/admin controls (no pausing, blacklists, or taxes).

## Verification Method Note
Because the contract imports OpenZeppelin, verification can be done via:
- **Standard JSON Input** (recommended), or
- **Flattened source** (single-file) including imported OpenZeppelin contracts.
