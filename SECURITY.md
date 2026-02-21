# Security Notes — MARITIME (MRT)

## Summary
MARITIME (MRT) is a minimal ERC-20 implementation using OpenZeppelin ERC20.
Supply is fixed and minted once at deployment.

## Key Properties
- **Fixed Supply:** 100,000,000 MRT (18 decimals)
- **Minting:** Only in constructor (`_mint(msg.sender, INITIAL_SUPPLY)`)
- **Admin Privileges:** None (no Ownable role, no pause/blacklist/tax logic)

## What to Verify On-Chain
- `totalSupply()` equals 100,000,000 * 10^18
- `decimals()` returns 18
- No external/public mint function exists

## Reporting
If you believe you’ve found a security issue, open a GitHub Issue with:
- A clear description
- Steps to reproduce (if any)
- Relevant transaction hashes / addresses
