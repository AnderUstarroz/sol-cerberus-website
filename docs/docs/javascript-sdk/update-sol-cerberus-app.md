---
layout: default
title: Update Sol Cerberus APP
parent: Javascript SDK
nav_order: 2
---

# Update Sol Cerberus APP
{: .no_toc }

---


## Table of contents
{: .no_toc .text-delta }

1. TOC
{:toc}

---

The Sol Cerberus APPs can be updated with the [`solCerberus.updateApp()`] method provided by the [JS SDK], it supports the following params:

## solCerberus.updateApp()

- `name` A name to identify your APP (up to 16 characters).
- `recovery` (optional): Use a secondary wallet's public key as a backup in case the original wallet is stolen or lost.
- `options` (optional): Additional parameters to customize behavior:
  - `authority` (optional) PubKey: Updates the authority wallet of the Sol Cerberus APP.
  - `cached` (optional) Boolean: Wether the Roles and Permissions should be cached on client side.
  - `getIx` (optional) Boolean: When True returns the instruction instead of executing the command on Solana's RPC.
  - `confirmOptions` (optional) Object containing the RPC confirm options:
    - `skipPreflight` (optional) boolean; Disables transaction verification step.
    - `commitment` (optional) "processed", "confirmed" or "finalized":  Desired commitment level.
    - `preflightCommitment` (optional) Commitment: Preflight commitment level.
    - `maxRetries` (optional) number: Maximum number of times for the RPC node to retry.
    - `minContextSlot` (optional) number: The minimum slot that the request can be evaluated at.


### With Javascript:
Minimum example on how to update an APP using plain Javascript:

```js
import { Keypair, PublicKey, Connection, clusterApiUrl} from "@solana/web3.js";
import { solCerberus, getProvider } from "sol-cerberus-js";
import * as anchor from "@project-serum/anchor";

/** Create a connection. **/
const connection = new Connection(clusterApiUrl("mainnet-beta"), "confirmed");
/**  NOTE: Replace the following Uint8Array by your own wallet private key **/
const wallet = Keypair.fromSecretKey(Uint8Array.from([174, 47, ...]));
 
const solCerberus = new SolCerberus(connection, wallet, {appId: new PublicKey("PASTE_YOUR_SOL_CERBERUS_APP_ID_HERE")});
// Update existing Sol Cerberus APP on-chain:
solCerberus.updateApp("myNewName", null) // Async func
```

### With React:
Small example on how to update an existing APP with React:

```jsx
import React, { startTransition, useEffect, useState } from "react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { SolCerberus } from "sol-cerberus-js";
import { PublicKey } from "@solana/web3.js";

export default function MyReactComponent({ router }) {
  const [solCerberus, setSolCerberus] = useState<SolCerberus | null>(null);
  const { connection } = useConnection();
  const { publicKey, wallet } = useWallet();
  const [newName, setNewName] = useState("");
  const [success, setSuccess] = useState(false);

  const clearStates = () => {
    if (solCerberus) {
      solCerberus.disconnect(); // Remove Websockets listeners
      startTransition(() => setSolCerberus(null));
    }
  };

  const getAppData = async (name = null) => {
    const appData = await solCerberus.getAppData();
    startTransition(() => {
      setNewName(name ?? appData.name);
    });
  };

  const handleUpdateApp = async () => {
    await solCerberus.updateApp(newName);
    getAppData(newName);
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

  // STEP 2: Fetch app data
  useEffect(() => {
    if (solCerberus) getAppData();
  }, [solCerberus]);

  // Removes the success message 7s after the APP is updated
  useEffect(() => {
    const timer = setTimeout(() => setSuccess(false), 7000);
    return () => clearTimeout(timer);
  }, [success]);

  return (
    <div>
      {!!solCerberus && (
        <div>
          <input
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            maxLength={16}
          />
          <button onClick={handleUpdateApp}>Update APP name</button>
          {success && <div>The APP has been updated!</div>}
        </div>
      )}
    </div>
  );
}
```

---

<div class="prev-next">
<div markdown="1">
[Create Sol Cerberus APP]
</div>
<div markdown="1">
[Delete Sol Cerberus APP]
</div>
</div>

[`solCerberus.updateApp()`]: https://js-sdk.solcerberus.com/classes/SolCerberus.html#updateApp
[JS SDK]: https://www.npmjs.com/package/sol-cerberus-js
[Create Sol Cerberus APP]: ../create-sol-cerberus-app
[Delete Sol Cerberus APP]: ../delete-sol-cerberus-app