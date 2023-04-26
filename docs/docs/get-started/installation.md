---
layout: default
title: Installation
parent: Get started
nav_order: 2
---

# Installation
{: .no_toc }

---


## Table of contents
{: .no_toc .text-delta }

1. TOC
{:toc}

---

Sol Cerberus integration is divided into two parts, the [Anchor packages] and the [Javascript SDK], which facilitates the interaction with the Sol Cerberus program, allowing the use of a succinct and neat syntax to perform authenticated requests.

## Anchor installation

Add the following dependencies into the `Cargo.toml` file of your Anchor program located at `./programs/NAME-OF-YOUR-PROGRAM/Cargo.toml`:

```toml
[dependencies]
anchor-spl = { version = "0.27.0", features = ["metadata"] }
sol-cerberus = { version = "0.1.5", features = ["cpi"] }
solana-program = "1.15.2"
```

## Frontend installation

The Sol Cerberus [Javascript SDK] package is used to facilitate the interaction with the Sol Cerberus program.

To install the package add the following dependencies into the `package.json` file of your frontend:

```json
{
  "dependencies": {
    "sol-cerberus-js": "latest"
    "@metaplex-foundation/js": "^0.18.3",
  },
}
```

{: .note }
The `@metaplex-foundation/js` package is actually optional and only necessary if you intend to use NFT authentication.

---

<div class="prev-next">
<div markdown="1">
[Requirements]
</div>
<div markdown="1">
[Setup]
</div>
</div>

[Anchor packages]: https://crates.io/crates/sol-cerberus
[Javascript SDK]: https://www.npmjs.com/package/sol-cerberus-js
[Requirements]: ../requirements
[Setup]: ../setup
