# SAFE MULTISIG

## Treasury & Wallet Governance

MARITIME (MRT) uses a Safe multisig structure for treasury control on Polygon PoS.

This document explains how treasury control is organized, which wallets are involved, and how operational wallet responsibilities are separated.

---

## Treasury Safe

- **Safe Address:** `0xa660454663f30c7EbcE6f90BA0D5F139f5D7789`
- **Network:** Polygon PoS
- **Signers:** 3
- **Threshold:** 2 / 3 confirmations required

No single signer can unilaterally move treasury funds.

All treasury outflows require at least **2 of 3 confirmations** before execution.

---

## Signer Structure

The Treasury Safe is controlled by 3 signer wallets with distinct internal roles:

1. **Operational Signer**  
   Used for core project operations and treasury coordination.

2. **Treasury Governance Signer**  
   Used for treasury oversight and transaction co-approval.

3. **Backup / Incident Signer**  
   Reserved for redundancy, continuity, and recovery scenarios.

This structure is intended to reduce single-point-of-failure risk and improve treasury control integrity.

---

## Treasury Control Policy

All treasury movements are executed through the Safe multisig.

This includes, where applicable:

- treasury fund movements
- treasury-related transfers
- reward funding from treasury-controlled balances
- strategic treasury reallocations
- other material treasury actions requiring internal approval

No single wallet is authorized to move treasury funds on its own.

---

## Liquidity Position

The DEX liquidity position is currently managed through the **LIQUIDITY POOL** wallet for operational simplicity.

This wallet is **separate from the Treasury Safe**.

The liquidity position is **not currently represented as permanently locked liquidity** unless separately disclosed with verifiable on-chain proof.

Any future lock, timelock, migration, or structural change related to the liquidity position will be publicly disclosed.

---

## Operational Wallet Structure

The current wallet architecture is organized as follows:

- **DEPLOY / MAIN** — deployment and operational signer wallet  
- **OWNER HOLD** — founder allocation holder  
- **LIQUIDITY POOL** — DEX liquidity management  
- **TREASURY SAFE** — project treasury (multisig controlled)  
- **COMMUNITY** — community allocation wallet  
- **MRT REWARD WALLET** — LP reward distribution

This separation is intended to distinguish treasury control, allocation holding, liquidity operations, and reward distribution.

---

## Governance Principles

The current wallet design follows these principles:

- separation between treasury and operational wallets
- no unilateral treasury movement by a single signer
- transparent publication of wallet roles
- public disclosure of material structural changes when applicable

---

## Incident & Signer Rotation Policy

If a signer wallet is compromised, lost, or no longer suitable for treasury governance, signer rotation may be performed through the Safe multisig process.

Any material signer structure update may be publicly disclosed through official project channels.

This is intended to preserve continuity while maintaining treasury control standards.

---

## Disclosure Standard

This document describes the current treasury multisig structure as of publication.

If the treasury structure, signer arrangement, or wallet responsibilities materially change, the updated structure may be disclosed through official MARITIME documentation channels.

---

## Notes

This document is intended to describe treasury control structure and wallet governance only.

It does **not** by itself represent:

- a liquidity lock certification
- a vesting contract
- a legal guarantee
- a promise of future treasury actions

Any such mechanism, if implemented, should be disclosed separately with its own documentation and verifiable on-chain references.
