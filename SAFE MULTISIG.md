## Treasury & Wallet Structure

### Treasury Safe

- **Safe Address:** 0xa660454663f30c7EbcE6f90BA0D5F139f5D7789
- **Network:** Polygon PoS
- **Signers:** 3
- **Threshold:** 2 / 3 confirmations required

### Signer Wallets

Treasury Safe is controlled by the following signer wallets:

1. DEPLOY / MAIN
2. OWNER HOLD
3. MRT BACKUP SIGNER

Any treasury transaction requires **2 out of 3 confirmations** before execution.

---

### Treasury Control Policy

All treasury movements are executed through the Safe multisig.

No single wallet can unilaterally move treasury funds.

---

### Liquidity Position

The DEX liquidity position is currently managed through the **LIQUIDITY POOL wallet** for operational simplicity.

The liquidity wallet is separate from the treasury Safe.

---

### Operational Wallet Structure

The current wallet architecture is:

- **DEPLOY / MAIN** — deployment and signer wallet  
- **OWNER HOLD** — founder allocation holder  
- **LIQUIDITY POOL** — DEX liquidity management  
- **TREASURY SAFE** — project treasury (multisig controlled)  
- **COMMUNITY** — community allocation wallet  
- **MRT REWARD WALLET** — LP reward distribution  
