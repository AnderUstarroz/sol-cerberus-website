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

## Create Sol Cerberus APP
The Sol Cerberus APP manages roles and permissions, enforcing the access rules in your Solana program. There are two ways to create your SC APP, you can either:

- [Create SC APP using the SC Manager] (recommended)
- [Create SC APP using the JS SDK]

{: .note }
Use an independent SC APP for each Solana program.


## Adding SC APP ID to an Anchor program
The Anchor program needs to know the SC APP ID in order to be able to authenticate requests. To add the SC APP ID generated on previous step into your Anchor program, create a constant called `SOL_CERBERUS_APP_ID` within the `lib.rs` file located at `./programs/NAME-OF-YOUR-PROGRAM/src/lib.rs` of your anchor program:


```rust
 # Your program ID (will be different on each program)
declare_id!("s0M3k3ytX83crd4vAgRrvmwXgVQ2r69uCpg8xzh8A5X124x");

# Add the following line using your own Sol Cerberus APP ID:
const SOL_CERBERUS_APP_ID: Pubkey = pubkey!("PASTE_HERE_YOUR_SC_APP_ID");

#[program]
pub mod my_anchor_program {

    use super::*;

    ...
}
```

Check out a [real world example] from our [demo program].


---

<div class="prev-next">
<div markdown="1">
[Installation]
</div>
<div markdown="1">
[Assign roles]
</div>
</div>


[Create SC APP using the SC Manager]: /docs/sc-manager/create-sol-cerberus-app
[Create SC APP using the JS SDK]: /docs/javascript-sdk/create-sol-cerberus-app
[Solana CLI]: https://docs.solana.com/es/wallet-guide/paper-wallet#seed-phrase-generation
[JS SDK]: https://www.npmjs.com/package/sol-cerberus-js
[web3.js package]: https://solana-labs.github.io/solana-web3.js/
[real world example]: https://github.com/AnderUstarroz/sol-cerberus-demo/blob/main/programs/sol-cerberus-demo/src/lib.rs#L17
[demo program]: https://demo.solcerberus.com/
[Installation]: ../installation
[Assign roles]: ../assign-roles