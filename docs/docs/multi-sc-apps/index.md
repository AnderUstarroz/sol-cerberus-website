---
title: Multiple SC apps
nav_order: 4
has_children: false
permalink: /docs/multi-sc-apps
---

# Multiple Sol Cerberus apps
{: .no_toc }

---


Solana programs can have several Sol Cerberus implementations:

- [**Single Sol Cerberus app**](./multi-sc-apps#single-sc-app): Usual setup for managing your program access rules (`1 fixed SC app per Solana program`).
- [**Multiple Sol Cerberus apps**](./multi-sc-apps#multiple-sol-cerberus-apps-1): The SC apps are selected dynamically during runtime (`many SC apps per Solana program`).
- [**Mixed setup**](./multi-sc-apps#mixed-setup): Both combined.



## Single SC app
Single SC apps are defined in the `SOL_CERBERUS_APP_ID` at the top of your program's `lib.rs` file: 

```rust
# File: ./programs/NAME-OF-YOUR-PROGRAM/src/lib.rs

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

## Multiple Sol Cerberus apps
To use multiple SC apps within your program just add the `sol_cerberus_app_id` variable as the first line of your functions using the `#[rule()]` macro:

- `let sol_cerberus_app_id: Pubkey = THE_SC_APP_ID;` 

For instance, using a [code example](https://github.com/AnderUstarroz/sol-cerberus-demo/blob/main/programs/sol-cerberus-demo/src/lib.rs#L29-L33) from our [demo](https://demo.solcerberus.com/?id=CeRb3rUsjWE23E3xizPUhefZKmpMrMXNBVfoxQ7WXCRR) program:

```rust
# File: ./programs/sol-cerberus-demo/src/lib.rs

# Your program ID (will be different on each program)
declare_id!("testX83crd4vAgRrvmwXgVQ2r69uCpg8xzh8A5X124x");

#[program]
pub mod sol_cerberus_demo {

    use super::*;

    #[rule(Square, Add)]
    pub fn add_square(ctx: Context<Add>, color: String, size: u16) -> Result<()> {
        let sol_cerberus_app_id: Pubkey = ctx.accounts.demo.sol_cerberus_app;
        instructions::add::add(ctx, "square", &color, size)
    }

    ...
}
```
Here the `sol_cerberus_app_id` variable is defined using the **SC app ID** stored in [`ctx.accounts.demo.sol_cerberus_app`](https://github.com/AnderUstarroz/sol-cerberus-demo/blob/main/programs/sol-cerberus-demo/src/state/demo.rs#L53)

## Mixed setup
Combining both previous setups. A typical use case would be when you want to use a specific Sol Cerberus app for managing the access rules of your Solana program but also want to use dynamic SC apps for your users. 

<div class="prev-next">
<div markdown="1">
</div>
<div markdown="1">
</div>
</div>

