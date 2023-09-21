---
layout: default
title: Delete Rule
parent: Javascript SDK
nav_order: 7
---

# Delete Rule (JS SDK)
{: .no_toc }

---


## Table of contents
{: .no_toc .text-delta }

1. TOC
{:toc}

---

The [`solCerberus.deleteRule()`] method provided by the [JS SDK], supports the following params:

## solCerberus.deleteRule()

- `role` string: The role name.
- `resource` string: The resource name.
- `permission` string: The permission name.
- `options` (optional): Additional parameters to customize behavior:
  - `namespace` (optional) integer: Defines the type of rules: 0: Default rule, 1: AssignRole rule, etc..
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
// Delete existing rule:
await solCerberus.deleteRule("myRule", "myResource", "myPermission"); // Async func
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
  const [rules, setRules] = useState(null);
  const [updated, setUpdated] = useState(0);

  const clearStates = () => {
    if (solCerberus) {
      solCerberus.disconnect(); // Remove Websockets listeners
      startTransition(() => setSolCerberus(null));
    }
  };

  const handleDeleteRule = async (role, resource, permission) => {
    await solCerberus.deleteRule(role, resource, permission);
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
          rulesChangedCallback: () => setUpdated(new Date().getTime()),
        })
      );
      setUpdated(new Date().getTime());
    });
    return () => clearStates();
  }, [publicKey]);

  // STEP 2: Refresh all rules
  useEffect(() => {
    if (solCerberus) {
      (async () => {
        setRules(await solCerberus.fetchPerms());
      })();
    }
  }, [updated]);

  return (
    <div>
      {!!rules &&
        Object.entries(rules).map(([_namespace, roles]) =>
          Object.entries(roles).map(([role, resources]) =>
            Object.entries(resources).map(([resource, permissions]) =>
              Object.entries(permissions).map(([permission, values]) => (
                <div key={`${role}-${resources}-${permission}`}>
                  {role} -&gt; {resource} -&gt; {permission}{" "}
                  <button
                    onClick={() => handleDeleteRule(role, resource, permission)}
                  >
                    Delete
                  </button>
                </div>
              ))
            )
          )
        )}
    </div>
  );
}
```

---

<div class="prev-next">
<div markdown="1">
[Add Rule]
</div>
<div markdown="1">
</div>
</div>

[`solCerberus.deleteRule()`]: https://js-sdk.solcerberus.com/classes/SolCerberus.html#deleteRule
[JS SDK]: https://www.npmjs.com/package/sol-cerberus-js
[Delete Sol Cerberus app]: ../delete-sol-cerberus-app
[Add Rule]: ../add-rule