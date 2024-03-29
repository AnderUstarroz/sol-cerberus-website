---
layout: default
title: Introduction
nav_order: 1
description: "Sol Cerberus is an fine-grained RBAC (Role-based access control) system designed to enhance the security of Solana Blockchain applications."
permalink: /
---

# Introduction
{: .fs-9 }

Sol Cerberus is a fine-grained [RBAC] (Role-based access control) system designed to enhance the security of Solana applications.
{: .fs-6 .fw-300 }

[Get started](/docs/get-started){: .btn .btn-primary .fs-5 .mb-4 .mb-md-0 .mr-2 }
[View Demo][Demo]{: .btn .btn-green .fs-5 .mb-4 .mb-md-0 }

---

In the current digital era, ensuring data privacy and security on-chain has become a critical concern. With Sol Cerberus, developers can easily meet these standards without having to manually implement complicated access control policies by themselves.


## How is security improved?

Sol Cerberus empowers you to customize access control policies and restrict access to specific resources based on user roles. By doing so, you can effectively limit the scope of potential security threats and safeguard sensitive data from unauthorized access.

Sol Cerberus automates this entire process abstracting away the complexity and providing intuitive tools for managing roles and permissions.

## Wallet and NFT access out of the box
Sol Cerberus includes built-in authentication for added convenience:

- **Wallet:** Grant access to specific Wallet.
- **NFT:** Grant access to owners of specific NFTs.
- **NFT collection:** Grant access to owners of NFTs which belong to specific collections.

## How does it work?
Sol Cerberus provides [Rust] and [NPM] packages to easily integrate a powerful [RBAC] system into your [Solana Anchor programs] and frontends. 

Let's take a quick look at our [Anchor demo program] (which can be seen in action on the [Demo] site), just by using the `#[rule(Square, Add)]` annotation, we can restrict the execution of the `add_square()` instruction only to users whose assigned role has the `Add` permission on the `Square` resource:

```rust
#[program]
pub mod sol_cerberus_demo {
    use super::*;

    #[rule(Square, Add)]
    pub fn add_square(ctx: Context<Add>, color: String, size: u16) -> Result<()> {
        instructions::add::add(ctx, "square", &color, size)
    }

    ...
}
```
This is just a simple example. Developers can define any `role`, `resource` and `permission` in their own dApps.

---

<div class="prev-next">
<div markdown="1">
</div>
<div markdown="1">
[Get started]
</div>
</div>


[RBAC]: https://en.wikipedia.org/wiki/Role-based_access_control
[Demo]: https://demo.solcerberus.com/
[Rust]: https://crates.io/crates/sol-cerberus
[NPM]: https://www.npmjs.com/package/sol-cerberus-js
[Solana Anchor programs]: https://book.anchor-lang.com/introduction/what_is_anchor.html
[Anchor demo program]: https://github.com/AnderUstarroz/sol-cerberus-demo
[Demo]: https://demo.solcerberus.com/
[Get started]: docs/get-started
