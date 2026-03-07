## Treasury Security Update — Safe Multisig Activated

MARITIME treasury has been upgraded to a **Safe multisig wallet** on Polygon.

### What was implemented
- A new **Safe treasury account** was created on Polygon.
- Treasury control now follows a **2 / 3 multisig policy**.
- This means no single signer can move treasury funds alone.
- Any treasury execution requires **2 out of 3 signer confirmations**.

### Signers
- **DEPLOY / MAIN**
- **OWNER HOLD**
- **MRT BACKUP SIGNER**

### Why this matters
This upgrade improves treasury control, operational discipline, and transparency.

It reduces single-wallet risk at the treasury layer and provides a clearer custody structure for project-held funds.

### Usage clarification
- **Safe Treasury** = treasury custody and controlled execution
- **Liquidity Pool Wallet** = DEX liquidity management
- **Trading / market actions** = separate operational wallet(s), not the treasury Safe

### Current policy
- Treasury transactions require **2 / 3 approvals**
- Treasury movements should be disclosed publicly with transaction references where applicable

### Important note
This multisig setup strengthens treasury control and transparency.  
It does not change the MRT token contract, token supply, or token-level permissions.
