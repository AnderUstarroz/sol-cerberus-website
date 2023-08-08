---
layout: default
title: Restrict access
parent: Get started
nav_order: 6
---

# Restrict access
{: .no_toc }

---


## Table of contents
{: .no_toc .text-delta }

1. TOC
{:toc}

---

Now that we have [added permissions], we can restrict the access to our Anchor program.

## Restrict access to Anchor instructions
Restricting access to Anchor instructions is a two steps process:

1. [Annotate the Anchor instruction with the corresponding access rule](#annotate-anchor-instruction-with-an-access-rule).
2. [Add the required Sol Cerberus accounts](#add-required-sol-cerberus-accounts).


### Annotate Anchor instruction with an access rule

Simply add the <span class="inline-block">`#[rule(RESOURCE, PERMISSION)]`</span> annotation on top of the Anchor function that you want to limit access to, replacing `RESOURCE` and `PERMISSION` by your own ones. 

For instance we used [`#[rule(Square, Add)]`](https://github.com/AnderUstarroz/sol-cerberus-demo/blob/main/programs/sol-cerberus-demo/src/lib.rs#L32) in our [demo program]:

```rust
use sol_cerberus_macros::rule;

#[program]
pub mod sol_cerberus_demo {

    use super::*;

    #[rule(Square, Add)]
    pub fn add_square(ctx: Context<Add>, color: String, size: u16) -> Result<()> {
        instructions::add::add(ctx, "square", &color, size)
    }

}
```

### Add required Sol Cerberus accounts
Now we need to add the Sol Cerberus accounts required for authentication. Apply the <span class="inline-block">`#[sol_cerberus_accounts]`</span> annotation to the corresponding instruction's Accounts struct. 

Check out [a real world example](https://github.com/AnderUstarroz/sol-cerberus-demo/blob/main/programs/sol-cerberus-demo/src/instructions/add.rs#L17-L30) from our [demo program](https://demo.solcerberus.com/): 

```rust
#[program]
use sol_cerberus_macros::sol_cerberus_accounts;

#[sol_cerberus_accounts]
#[derive(Accounts)]
pub struct Add<'info> {
    ... /// Your accounts..

    /// CHECK: Validated on CPI call
    pub sol_cerberus_app: UncheckedAccount<'info>,
    /// CHECK: Validated on CPI call
    pub sol_cerberus_rule: Option<UncheckedAccount<'info>>,
    /// CHECK: Validated on CPI call
    pub sol_cerberus_role: Option<UncheckedAccount<'info>>,
    /// CHECK: Validated on CPI call
    pub sol_cerberus_token: Option<UncheckedAccount<'info>>,
    /// CHECK: Validated on CPI call
    pub sol_cerberus_metadata: Option<UncheckedAccount<'info>>,
    #[account(mut)]
    pub sol_cerberus_seed: Option<UncheckedAccount<'info>>,
    pub sol_cerberus: Program<'info, SolCerberus>,
    pub system_program: Program<'info, System>,
}
```

{: .note }
On future versions of Anchor using  <span class="inline-block">`#[sol_cerberus_accounts]`</span> would be enough, but at the moment we also need to manually add the following accounts into the `struct` or [Anchor won't be able to generate the IDL file correctly].


---

<div class="prev-next">
<div markdown="1">
[Add permissions]
</div>
<div markdown="1">
[Test access]
</div>
</div>

[demo program]: https://demo.solcerberus.com/
[added permissions]: ../add-permissions
[Anchor won't be able to generate the IDL file correctly]: https://github.com/coral-xyz/anchor/issues/2431
[Add permissions]: ../add-permissions
[Test access]: ../test-access