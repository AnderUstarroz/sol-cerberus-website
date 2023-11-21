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

Check out [a real world example](https://github.com/AnderUstarroz/sol-cerberus-demo/blob/main/programs/sol-cerberus-demo/src/instructions/add.rs#L6) from our [demo program](https://demo.solcerberus.com/): 

```rust
#[program]
use sol_cerberus_macros::sol_cerberus_accounts;

#[sol_cerberus_accounts]
#[derive(Accounts)]
pub struct Add<'info> {
    ... /// Your accounts..
    pub system_program: Program<'info, System>,
}
```

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