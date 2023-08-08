---
layout: default
title: Delete Assigned Role
parent: Javascript SDK
nav_order: 5
---

# Delete Assigned Role (JS SDK)
{: .no_toc }

---


## Table of contents
{: .no_toc .text-delta }

1. TOC
{:toc}

---

The [`solCerberus.deleteAssignedRole()`] method provided by the [JS SDK], supports the following params:

## solCerberus.deleteAssignedRole()

- `role` string: The role name.
- `addressType` string: Either `'wallet'`, `'nft'` or `'collection'`.
- `address` PublicKey/string: The Solana address (or wildcard `'*'`) to which the role is assigned. A wilcard `"*"` means that role will be applied to everyone.
- `options` (optional): Additional parameters to customize behavior:
  - `collector` (optional) PublicKey: The wallet receiving the funds (defaults to authority)
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
// Delete existing assigned role:
await solCerberus.deleteAssignedRole(
  "myRole", 
  "wallet",  
  new PublicKey("THE_WALLET_ADDRESS_WHO_HAD_THE_ROLE"), 
) // Async func
```

### With React:
Small example using React:

```tsx
import React, { startTransition, useEffect, useState } from "react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { SolCerberus } from "sol-cerberus-js";
import { PublicKey } from "@solana/web3.js";

export default function MyReactComponent({ router }) {
  const [solCerberus, setSolCerberus] = useState<SolCerberus | null>(null);
  const { connection } = useConnection();
  const { publicKey, wallet } = useWallet();
  const [roles, setRoles] = useState(null);
  const [updated, setUpdated] = useState(0);

  const clearStates = () => {
    if (solCerberus) {
      solCerberus.disconnect(); // Remove Websockets listeners
      startTransition(() => setSolCerberus(null));
    }
  };

  const handleDeleteAssignedRole = async (role, addressType, address) => {
    await solCerberus.deleteAssignedRole(role, addressType, address);
  };

  // STEP 1: Init Sol Cerberus
  useEffect(() => {
    // Clear all data when user's wallet has been disconnected
    if (!publicKey) {
      return clearStates();
    }
    if (solCerberus) return;
    startTransition(() => {
      setSolCerberus(
        new SolCerberus(connection, wallet, {
          appId: new PublicKey("PASTE_YOUR_SOL_CERBERUS_APP_ID_HERE"),
          rolesChangedCallback: () => setUpdated(new Date().getTime()),
        })
      );
      setUpdated(new Date().getTime());
    });
    return () => clearStates();
  }, [publicKey]);

  // STEP 2: Refresh all assigned roles when updated
  useEffect(() => {
    if (solCerberus) {
      (async () => {
        setRoles(await solCerberus.fetchAllRoles());
      })();
    }
  }, [updated]);

  return (
    <div>
      {!!roles &&
        Object.entries(roles).map(([address, role]) =>
          Object.entries(role).map(([role, values]) => (
            <div key={`${role}-${address}`}>
              {role}, {values.addressType}: {address}{" "}
              <button
                onClick={() =>
                  handleDeleteAssignedRole(role, values.addressType, address)
                }
              >
                Delete
              </button>
            </div>
          ))
        )}
    </div>
  );
}
```

---

<div class="prev-next">
<div markdown="1">
[Assign Role]
</div>
<div markdown="1">
[Add Rule]
</div>
</div>

[`solCerberus.deleteAssignedRole()`]: https://js-sdk.solcerberus.com/classes/SolCerberus.html#deleteAssignedRole
[JS SDK]: https://www.npmjs.com/package/sol-cerberus-js
[Assign Role]: ../assign-role
[Add Rule]: ../add-rule