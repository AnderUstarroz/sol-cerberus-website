---
layout: default
title: Setup
parent: Get started
nav_order: 3
---

# Setup
{: .no_toc }

---


## Table of contents
{: .no_toc .text-delta }

1. TOC
{:toc}

---

## Create APP ID

Every Sol Cerberus APP requires a unique key which will be used as the APP ID. 
Use one of the following methods to create your APP ID:

- Using [Solana CLI]:

  ```shell
  solana-keygen new --no-outfile --no-bip39-passphrase
  ```
- Using Solana's [web3.js package]:

  ```js
  import { Keypair } from "@solana/web3.js";
  // Generate a new keypair
  console.log(`New public key: ${Keypair.generate().publicKey.toBase58()}`);
  ```
Copy the resulting string, for instance: `CZE2m73MW8V3APLEs6fhiYxWqxSGJibdxFGdTAzsBj2m`

## Create Sol Cerberus APP
The APP need to be created in the blockchain with the `initializeApp()` instruction provided by the [JS SDK]. The following script can be used to initialize a new APP, it requires the following params:

- `id`: The APP ID generated on previous step.
- `name` A name to identify your APP (up to 16 characters).
- `recovery` (Optional): Use a secondary wallet's public key as a backup in case the original wallet used to create this APP is lost.

```js
import { Keypair, PublicKey, Connection, clusterApiUrl} from "@solana/web3.js";
import { solCerberus } from "sol-cerberus-js";
import * as anchor from "@project-serum/anchor";

(async () => {
  /**
  * Create a connection.
  * 
  * With React use Solana's wallet adapter instead.
  * Source: https://github.com/solana-labs/wallet-adapter
  * 
  *     import { useConnection } from "@solana/wallet-adapter-react";
  *     const { connection } = useConnection();
  */
  const connection = new Connection(clusterApiUrl("mainnet-beta"), "confirmed");

  /**
  * Use your own private key within the Uint8Array.
  * 
  * With React use Solana's wallet adapter instead:
  * Source: https://github.com/solana-labs/wallet-adapter
  * 
  *     import { useWallet } from "@solana/wallet-adapter-react";
  *     const { wallet } = useWallet();
  */
  const wallet = Keypair.fromSecretKey(
    Uint8Array.from([
      174, 47, 154, 16, 202, 193, 206, 113, 199, 190, 53, 133, 169, 175, 31, 56,
      222, 53, 138, 189, 224, 216, 117, 173, 10, 149, 53, 45, 73, 251, 237, 246,
      15, 185, 186, 82, 177, 240, 148, 69, 241, 227, 167, 80, 141, 89, 240, 121,
      121, 35, 172, 247, 68, 251, 226, 218, 48, 63, 176, 109, 168, 89, 238, 135,
    ])
  ); 

  const provider = new anchor.AnchorProvider(
    connection, 
    wallet,     // Use wallet.adapter when using React's useWallet()
    anchor.AnchorProvider.defaultOptions()
  )

  // Add the following line using your own APP ID created on previous step:
  const scAppId = new PublicKey("CZE2m73MW8V3APLEs6fhiYxWqxSGJibdxFGdTAzsBj2m");
  const solCerberus = new SolCerberus(scAppId, provider);

  await solCerberus.program.methods
        .initializeApp({
          id: scAppId,
          name: "My auth app",  // up to 16 characters
          recovery: null,       // Recovery wallet (backup)
        })
        .accounts({
          app: await solCerberus.getAppPda(),
        })
        .rpc();
})();

```
Check out a working example from our demo program: [Create APP](https://github.com/AnderUstarroz/sol-cerberus-demo/blob/main/tests/1_initialize_demo.ts#L23-L32).

## Adding APP ID to an Anchor program

Now we need to add the generated ID into our Anchor program. Create a constant called `SOL_CERBERUS_APP_ID` within the `lib.rs` file located at `./programs/NAME-OF-YOUR-PROGRAM/src/lib.rs` of your anchor program:


```rust
declare_id!("s0M3k3ytX83crd4vAgRrvmwXgVQ2r69uCpg8xzh8A5X124x");

# Add the following line using your own APP ID:
const SOL_CERBERUS_APP_ID: Pubkey = pubkey!("CZE2m73MW8V3APLEs6fhiYxWqxSGJibdxFGdTAzsBj2m");

#[program]
pub mod my_anchor_program {

    use super::*;

    ...
}
```

---

<div class="prev-next">
<div markdown="1">
[Installation]
</div>
<div markdown="1">
[Assign roles]
</div>
</div>

[Solana CLI]: https://docs.solana.com/es/wallet-guide/paper-wallet#seed-phrase-generation
[JS SDK]: https://www.npmjs.com/package/sol-cerberus-js
[web3.js package]: https://solana-labs.github.io/solana-web3.js/
[Installation]: ../installation
[Assign roles]: ../assign-roles