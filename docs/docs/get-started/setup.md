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

## Create APP

```js
import { PublicKey } from "@solana/web3.js";
import { sc_app_pda } from "sol-cerberus-js";
import * as anchor from "@project-serum/anchor";


const provider = new anchor.AnchorProvider(
    connection,     // The connection returned by useConnection();
    wallet.adapter, // The wallet returned by useWallet();
    anchor.AnchorProvider.defaultOptions()
  )
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
```

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