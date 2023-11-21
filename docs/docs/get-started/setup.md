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

## Create Sol Cerberus app
The Sol Cerberus app manages roles and permissions, enforcing the access rules in your Solana program. There are two ways to create your SC app, you can either:

- [Create SC app using the SC Manager] (recommended)
- [Create SC app using the JS SDK]

{: .note }
Normally you would use an independent SC app for each Solana program, but you can also [use multiple SC apps](/docs/multi-sc-apps), allowing your users to setup/manage their own access permissions.



## Adding SC app ID to an Anchor program
The Anchor program needs to know the SC app ID in order to be able to authenticate requests. To add the SC app ID generated on previous step into your Anchor program, create a constant called `SOL_CERBERUS_APP_ID` within the `lib.rs` file located at `./programs/NAME-OF-YOUR-PROGRAM/src/lib.rs` of your anchor program:


```rust
 # Your program ID (will be different on each program)
declare_id!("s0M3k3ytX83crd4vAgRrvmwXgVQ2r69uCpg8xzh8A5X124x");

# Add the following line using your own Sol Cerberus app ID:
const SOL_CERBERUS_APP_ID: Pubkey = pubkey!("PASTE_HERE_YOUR_SC_APP_ID");

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


[Create SC app using the SC Manager]: /docs/sc-manager/create-sol-cerberus-app
[Create SC app using the JS SDK]: /docs/javascript-sdk/create-sol-cerberus-app
[Solana CLI]: https://docs.solana.com/es/wallet-guide/paper-wallet#seed-phrase-generation
[Installation]: ../installation
[Assign roles]: ../assign-roles