---
layout: default
title: Add Rule
parent: Javascript SDK
nav_order: 6
---

# Add Rule (JS SDK)
{: .no_toc }

---


## Table of contents
{: .no_toc .text-delta }

1. TOC
{:toc}

---

Creates a rule, composed by:

- `Role` -> `Resource` -> `Permission` (and an optional `expiresAt` for temporary rules)


The [`solCerberus.addRule()`] method provided by the [JS SDK], supports the following params:

## solCerberus.addRule()

- `role` string: The role getting the permission, only alphanumeric characters (a-z, A-Z,0-9) and 16 characters max.
- `resource` string: The resource in which the permission will have effect.
- `permission` string: The permission.
- `options` (optional): Additional parameters to customize behavior:
  - `namespace` (optional) integer: Defines the type of rules: 0: Default rule, 1: AssignRole rule, etc..
  - `expiresAt` (optional) Date: The time at which the permission won't be valid anymore.
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
// Add new rule:
await solCerberus.addRule(
  "myRole", 
  "myResource",  
  "myPermission",  
  {
      expiresAt: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1) // The assigned Role will expire in 24h
  }
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
  const [rule, setRule] = useState({
    role: "",
    resource: "",
    permission: "",
    expiresAt: null,
  } as any);
  const [success, setSuccess] = useState(false);

  const clearStates = () => {
    if (solCerberus) {
      solCerberus.disconnect(); // Remove Websockets listeners
      startTransition(() => setSolCerberus(null));
    }
  };

  const handleAddRule = async (e) => {
    e.preventDefault();
    await solCerberus.addRule(rule.role, rule.resource, rule.permission, {
      expiresAt: rule.expiresAt ? new Date(rule.expiresAt) : null,
    });
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
        <form onSubmit={handleAddRule}>
          <div>
            <label>
              Role:{" "}
              <input
                required
                minLength={1}
                maxLength={16}
                type="text"
                value={rule.role ?? ""}
                onChange={(e) => setRule({ ...rule, role: e.target.value })}
              />
            </label>
          </div>
          <div>
            <label>
              Resource:{" "}
              <input
                required
                minLength={1}
                maxLength={16}
                type="text"
                value={rule.resource ?? ""}
                onChange={(e) => setRule({ ...rule, resource: e.target.value })}
              />
            </label>
          </div>
          <div>
            <label>
              Permission:{" "}
              <input
                required
                minLength={1}
                maxLength={16}
                type="text"
                value={rule.permission ?? ""}
                onChange={(e) =>
                  setRule({ ...rule, permission: e.target.value })
                }
              />
            </label>
          </div>
          <div>
            <label>
              Expires:{" "}
              <input
                type="datetime-local"
                value={rule.expiresAt ? rule.expiresAt : ""}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setRule({
                    ...rule,
                    expiresAt: e.target.value,
                  })
                }
              />
            </label>
          </div>
          {!!rule.role && !!rule.resource && !!rule.permission && (
            <input type="submit" value={"Assign value"} />
          )}
        </form>
      )}
      {success && <div>Rule successfully added</div>}
    </div>
  );
}
```
Check out a real world example from our [demo program](https://demo.solcerberus.com/):

- [Adding "Add", "Update" and "Delete" permissions to "SquareMaster" role](https://github.com/AnderUstarroz/sol-cerberus-demo/blob/main/tests/2_square.ts#L71-L73).

---

<div class="prev-next">
<div markdown="1">
[Delete Assigned Role]
</div>
<div markdown="1">
[Delete Rule]
</div>
</div>

[`solCerberus.addRule()`]: https://js-sdk.solcerberus.com/classes/SolCerberus.html#addRule
[JS SDK]: https://www.npmjs.com/package/sol-cerberus-js
[Delete Assigned Role]: ../delete-assigned-role
[Delete Rule]: ../delete-rule