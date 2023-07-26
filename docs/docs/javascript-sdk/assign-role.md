---
layout: default
title: Assign Role
parent: Javascript SDK
nav_order: 4
---

# Assign Role
{: .no_toc }

---


## Table of contents
{: .no_toc .text-delta }

1. TOC
{:toc}

---

Roles can be assigned to: 
- **Wallets**
-  **NFTs** 
-  **NFT Collections**

The [`solCerberus.assignRole()`] method provided by the [JS SDK], supports the following params:

## solCerberus.assignRole()

- `role` string: The name of the role to assign.
- `addressType` string: Either `'wallet'`, `'nft'` or `'collection'`.
- `address` PublicKey: The Solana address (or wildcard `'*'`) to which the role is assigned. A wilcard `"*"` means that role will be applied to everyone.
- `options` (optional): Additional parameters to customize behavior:
  - `expiresAt` (optional) Date: The time at which the role won't be valid anymore.
  - `getIx` (optional) Boolean: When True returns the instruction instead of executing the command on Solana's RPC.
  - `confirmOptions` (optional) Object containing the RPC confirm options:
    - `skipPreflight` (optional) boolean; Disables transaction verification step.
    - `commitment` (optional) "processed", "confirmed" or "finalized":  Desired commitment level.
    - `preflightCommitment` (optional) Commitment: Preflight commitment level.
    - `maxRetries` (optional) number: Maximum number of times for the RPC node to retry.
    - `minContextSlot` (optional) number: The minimum slot that the request can be evaluated at.


### With Javascript:
Minimum example using plain Javascript:

```js
import { Keypair, PublicKey, Connection, clusterApiUrl} from "@solana/web3.js";
import { solCerberus, getProvider } from "sol-cerberus-js";
import * as anchor from "@project-serum/anchor";

/** Create a connection. **/
const connection = new Connection(clusterApiUrl("mainnet-beta"), "confirmed");
/**  NOTE: Replace the following Uint8Array by your own wallet private key **/
const wallet = Keypair.fromSecretKey(Uint8Array.from([174, 47, ...]));
 
const solCerberus = new SolCerberus(connection, wallet, {appId: new PublicKey("PASTE_YOUR_SOL_CERBERUS_APP_ID_HERE")});
// Assign role to address:
solCerberus.assignRole(
  "myRole", 
  "wallet",  
  new PublicKey("THE_WALLET_ADDRESS_GETTING_THE_ROLE"), 
  {
    expiresAt: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1) // The assigned Role will expire in 24h
  } 
  )  // Async func
```

### With React:
Small example using React:

```tsx
import React, { startTransition, useEffect, useState } from "react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { RoleType, SolCerberus } from "sol-cerberus-js";
import { PublicKey } from "@solana/web3.js";

export default function MyReactComponent({ router }) {
  const [solCerberus, setSolCerberus] = useState<SolCerberus | null>(null);
  const { connection } = useConnection();
  const { publicKey, wallet } = useWallet();
  const [role, setRole] = useState({
    role: "",
    addressType: "wallet",
    expiresAt: null,
  } as any);
  const [success, setSuccess] = useState(false);

  const clearStates = () => {
    if (solCerberus) {
      solCerberus.disconnect(); // Remove Websockets listeners
      startTransition(() => setSolCerberus(null));
    }
  };

  const handleAssignRole = async (e) => {
    e.preventDefault();
    await solCerberus.assignRole(
      role.role,
      role.addressType,
      new PublicKey(role.address),
      {
        expiresAt: role.expiresAt ? new Date(role.expiresAt) : null,
      }
    );
    startTransition(() => setSuccess(true));
  };

  // STEP 1: Init Sol Cerberus
  useEffect(() => {
    // Clear all data when user's wallet has been disconnected
    if (!publicKey) {
      return clearStates();
    }
    if (solCerberus) return;
    startTransition(() =>
      setSolCerberus(
        new SolCerberus(connection, wallet, {
          appId: new PublicKey("PASTE_YOUR_SOL_CERBERUS_APP_ID_HERE"),
        })
      )
    );
    return () => clearStates();
  }, [publicKey]);

  return (
    <div>
      {!!solCerberus && !success && (
        <form onSubmit={handleAssignRole}>
          <div>
            <label>
              Role:{" "}
              <input
                required
                minLength={1}
                maxLength={16}
                type="text"
                value={role.role ?? ""}
                onChange={(e) => setRole({ ...role, role: e.target.value })}
              />
            </label>
          </div>
          <div>
            <label>
              Address type:
              <select
                onChange={(e) =>
                  setRole({ ...role, addressType: e.target.value })
                }
              >
                <option value={"wallet"}>Wallet</option>
                <option value={"nft"}>NFT</option>
                <option value={"collection"}>NFT Collection</option>
              </select>
            </label>
          </div>
          <div>
            <label>
              Address:{" "}
              <input
                required
                minLength={43}
                maxLength={44}
                type="text"
                value={role.address ?? ""}
                onChange={(e) => setRole({ ...role, address: e.target.value })}
              />
            </label>
          </div>

          <div>
            <label>
              Expires:{" "}
              <input
                type="datetime-local"
                value={role.expiresAt ? role.expiresAt : ""}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setRole({
                    ...role,
                    expiresAt: e.target.value,
                  })
                }
              />
            </label>
          </div>
          {!!role.role && <input type="submit" value={"Assign value"} />}
        </form>
      )}
      {success && <div>Role successfully added</div>}
    </div>
  );
}
```

---

<div class="prev-next">
<div markdown="1">
[Delete Sol Cerberus APP]
</div>
<div markdown="1">
[Delete Assigned Role]
</div>
</div>

[`solCerberus.assignRole()`]: https://js-sdk.solcerberus.com/classes/SolCerberus.html#assignRole
[JS SDK]: https://www.npmjs.com/package/sol-cerberus-js
[Delete Sol Cerberus APP]: ../delete-sol-cerberus-app
[Delete Assigned Role]: ../delete-assigned-role