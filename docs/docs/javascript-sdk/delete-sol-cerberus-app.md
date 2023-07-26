---
layout: default
title: Delete Sol Cerberus APP
parent: Javascript SDK
nav_order: 3
---

# Delete Sol Cerberus APP
{: .no_toc }

---


## Table of contents
{: .no_toc .text-delta }

1. TOC
{:toc}

---

Sol Cerberus APPs can be deleted **recovering the rent which was initially payed in SOL**. The [`solCerberus.deleteApp()`] method provided by the [JS SDK], supports the following params:

{: .important }
Please ensure to first remove all Roles and Rules within the APP to recover 100% of your SOL, otherwise you won't be able to delete the Rules and Roles after deleting the APP.


## solCerberus.deleteApp()

- `options` (optional): Additional parameters to customize behavior:
  - `collector` (optional) PublicKey: The wallet receiving the funds (defaults to authority).
  - `getIx` (optional) Boolean: When True returns the instruction instead of executing the command on Solana's RPC.
  - `confirmOptions` (optional) Object containing the RPC confirm options:
    - `skipPreflight` (optional) boolean; Disables transaction verification step.
    - `commitment` (optional) "processed", "confirmed" or "finalized":  Desired commitment level.
    - `preflightCommitment` (optional) Commitment: Preflight commitment level.
    - `maxRetries` (optional) number: Maximum number of times for the RPC node to retry.
    - `minContextSlot` (optional) number: The minimum slot that the request can be evaluated at.


### With Javascript:
Minimum example on how to delete an APP using plain Javascript:

```js
import { Keypair, PublicKey, Connection, clusterApiUrl} from "@solana/web3.js";
import { solCerberus, getProvider } from "sol-cerberus-js";
import * as anchor from "@project-serum/anchor";


/** Create a connection. **/
const connection = new Connection(clusterApiUrl("mainnet-beta"), "confirmed");
/**  NOTE: Replace the following Uint8Array by your own wallet private key **/
const wallet = Keypair.fromSecretKey(Uint8Array.from([174, 47, ...]));
 
const solCerberus = new SolCerberus(connection, wallet, {appId: new PublicKey("PASTE_YOUR_SOL_CERBERUS_APP_ID_HERE")});
// Delete existing Sol Cerberus APP on-chain:
solCerberus.deleteApp() // Async func
```

### With React:
Small example on how to delete an existing APP with React:

```jsx
import React, { startTransition, useEffect, useState } from "react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { SolCerberus } from "sol-cerberus-js";
import { PublicKey } from "@solana/web3.js";

export default function MyReactComponent({ router }) {
  const [solCerberus, setSolCerberus] = useState<SolCerberus | null>(null);
  const { connection } = useConnection();
  const { publicKey, wallet } = useWallet();
  const [app, setApp] = useState(null);

  const clearStates = () => {
    if (solCerberus) {
      solCerberus.disconnect(); // Remove Websockets listeners
      startTransition(() => setSolCerberus(null));
    }
  };

  const getAppData = async () => {
    const appData = await solCerberus.getAppData();
    startTransition(() => setApp(appData));
  };

  const handleDeleteApp = async () => {
    await solCerberus.deleteApp();
    startTransition(() => setApp(null));
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
    if (!solCerberus) return;
    getAppData();
  }, [solCerberus]);

  return (
    <div>
      {!!solCerberus && (
        <div>
          {!!app && (
            <button onClick={handleDeleteApp}>
              Delete APP: {solCerberus.appId.toBase58()}
            </button>
          )}
          {!app && <div>APP already deleted.</div>}
        </div>
      )}
    </div>
  );
}
```

---

<div class="prev-next">
<div markdown="1">
[Update Sol Cerberus APP]
</div>
<div markdown="1">
[Assign Role]
</div>
</div>

[`solCerberus.deleteApp()`]: https://js-sdk.solcerberus.com/classes/SolCerberus.html#deleteApp
[JS SDK]: https://www.npmjs.com/package/sol-cerberus-js
[Update Sol Cerberus APP]: ../update-sol-cerberus-app
[Assign Role]: ../assign-role