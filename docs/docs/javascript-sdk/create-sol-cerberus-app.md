---
layout: default
title: Create Sol Cerberus APP
parent: Javascript SDK
nav_order: 1
---

# Create Sol Cerberus APP (JS SDK)
{: .no_toc }

---


## Table of contents
{: .no_toc .text-delta }

1. TOC
{:toc}

---

The Sol Cerberus APPs can be created in the blockchain using the [`solCerberus.initializeApp()`] method provided by the [JS SDK], it supports the following params:

## solCerberus.initializeApp()

- `name` A name to identify your APP (up to 16 characters).
- `recovery` (optional): Use a secondary wallet's public key as a backup in case the original wallet is stolen or lost.
- `options` (optional): Additional parameters to customize behavior:
  - `cached` (optional) Boolean: Wether the Roles and Permissions should be cached on client side.
  - `getIx` (optional) Boolean: When True returns the instruction instead of executing the command on Solana's RPC 
  - `confirmOptions` (optional) Object containing the RPC confirm options:
    - `skipPreflight` (optional) boolean; Disables transaction verification step.
    - `commitment` (optional) "processed", "confirmed" or "finalized":  Desired commitment level.
    - `preflightCommitment` (optional) Commitment: Preflight commitment level.
    - `maxRetries` (optional) number: Maximum number of times for the RPC node to retry.
    - `minContextSlot` (optional) number: The minimum slot that the request can be evaluated at.


### With Javascript:
Minimum example on how to create the APP with plain Javascript:

```js
import { Keypair, PublicKey, Connection, clusterApiUrl} from "@solana/web3.js";
import { solCerberus, getProvider } from "sol-cerberus-js";
import * as anchor from "@project-serum/anchor";


/** Create a connection. **/
const connection = new Connection(clusterApiUrl("mainnet-beta"), "confirmed");
/** 
 * Generate a new random Private key (Remember to save this keypair, otherwise 
 * you won't be able to access the APP anymore). 
 * 
 **/
const wallet = Keypair.generate() // Using a random private key 
/** 
 * Or alternatively use your own private key :
 *    
 *    const wallet = Keypair.fromSecretKey(Uint8Array.from([
 *      174, 47, 154, 16, 202, 193, 206, 113, 199, 190, 53, 133, 169, 175, 31, 56,
 *      222, 53, 138, 189, 224, 216, 117, 173, 10, 149, 53, 45, 73, 251, 237, 246,
 *      15, 185, 186, 82, 177, 240, 148, 69, 241, 227, 167, 80, 141, 89, 240, 121,
 *      121, 35, 172, 247, 68, 251, 226, 218, 48, 63, 176, 109, 168, 89, 238, 135,
 *    ]));
 * 
 * NOTE: This is just a sample wallet, you must replace this Uint8Array by your own wallet private key
 **/

const solCerberus = new SolCerberus(connection, wallet);
// Create Sol Cerberus APP on-chain:
await solCerberus.initializeApp("myApp", null, {cached: false})  // Async func
console.log(`My APP ID is: ${solCerberus.appId.toBase58()}`)
```

### With React:
Minimum example on how to create the APP with React:

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
    try {
      const appData = await solCerberus.getAppData();
      startTransition(
        () => setApp(appData) // Will fail if APP doesn't exist yet
      );
    } catch {}
  };

  const handleCreateApp = async () => {
    await solCerberus.initializeApp(
      "TheNameOfYourApp",
      new PublicKey("HERE_YOUR_BACKUP_WALLET_ADDRESS"), // OR use null for none backup wallet.
      {
        cached: false
      }
    );
    getAppData();
  };

  // STEP 1: Init Sol Cerberus
  useEffect(() => {
    // Clear all data when user's wallet has been disconnected
    if (!publicKey) {
      return clearStates();
    }
    if (solCerberus) return;
    startTransition(() => setSolCerberus(new SolCerberus(connection, wallet)));
    return () => clearStates();
  }, [publicKey]);

  // STEP 2: Fetch app data (just in case the app already exists)
  useEffect(() => {
    if (solCerberus) getAppData();
  }, [solCerberus]);

  return (
    <div>
      {!!solCerberus && !app && (
        <button onClick={handleCreateApp}>Create Sol Cerberus APP</button>
      )}
      {!!app && (
        <div>
          The APP ID is <strong>{app.id.toBase58()}</strong>
        </div>
      )}
    </div>
  );
}
```

Check out a working example from our demo program: [Create APP](https://github.com/AnderUstarroz/sol-cerberus-demo/blob/main/tests/1_initialize_demo.ts#L48-L50).


{: .note }
Remember to write down your **APP ID** after creating a Sol Cerberus APP, you will need it to access the instance afterwards. If you forgot you can always visit the [Sol Cerberus Manager] to see all your existing APPs.

---

<div class="prev-next">
<div markdown="1">
[Javascript SDK]
</div>
<div markdown="1">
[Update Sol Cerberus APP]
</div>
</div>

[`solCerberus.initializeApp()`]: https://js-sdk.solcerberus.com/classes/SolCerberus.html#initializeApp
[JS SDK]: https://www.npmjs.com/package/sol-cerberus-js
[web3.js package]: https://solana-labs.github.io/solana-web3.js/
[Sol Cerberus Manager]: https://solcerberus.com/app
[Javascript SDK]: /docs/javascript-sdk
[Update Sol Cerberus APP]: ../update-sol-cerberus-app