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
The APP need to be created in the blockchain using the `initializeApp()` instruction of the JS SDK. Required the following params:

- `id`: The APP ID generated on previous step.
- `recovery` (Optional): The Public key of some other wallets as a safety measure in case you loss the original wallet used to create the APP.
- `name` A name to identify your APP.

```js
import { Keypair, PublicKey, Connection, clusterApiUrl} from "@solana/web3.js";
import { sc_app_pda } from "sol-cerberus-js";
import * as anchor from "@project-serum/anchor";


(async () => {
  const connection = new Connection(clusterApiUrl("mainnet-beta"), "confirmed");
  // Or if you prefer using a React component:
  // const { connection } = useConnection();
  
  const wallet = Keypair.fromSecretKey(
    Uint8Array.from([
      174, 47, 154, 16, 202, 193, 206, 113, 199, 190, 53, 133, 169, 175, 31, 56,
      222, 53, 138, 189, 224, 216, 117, 173, 10, 149, 53, 45, 73, 251, 237, 246,
      15, 185, 186, 82, 177, 240, 148, 69, 241, 227, 167, 80, 141, 89, 240, 121,
      121, 35, 172, 247, 68, 251, 226, 218, 48, 63, 176, 109, 168, 89, 238, 135,
    ])
  ); 
  // Or if you prefer using a React component:
  // const { wallet } = useWallet();


  const provider = new anchor.AnchorProvider(
    connection, 
    wallet,     // Use wallet.adapter when using react's useWallet()
    anchor.AnchorProvider.defaultOptions()
  )

  // Add the following line using your own APP ID created on previous step:
  const scAppId = new PublicKey("CZE2m73MW8V3APLEs6fhiYxWqxSGJibdxFGdTAzsBj2m");
  const solCerberus = new SolCerberus(scAppId, provider);

  await solCerberus.program.methods
        .initializeApp({
          id: scAppId,
          recovery: null,       // Recovery wallet (in case you lose access)
          name: "My auth app",  // up to 16 characters
        })
        .accounts({
          app: await solCerberus.getAppPda(),
        })
        .rpc();
})();

```
Now your Sol Cerberus APP exists in the blockchain and is ready to assign Roles.

## Add APP ID to my Anchor program

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
</div>
</div>

[Solana CLI]: https://docs.solana.com/es/wallet-guide/paper-wallet#seed-phrase-generation
[web3.js package]: https://solana-labs.github.io/solana-web3.js/
[Installation]: ../installation