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

Sol Cerberus integration is divided into two parts, installing the [Sol Cerberus crate] into your Anchor program and the [Javascript SDK] in the frontend to facilitate the interaction with the Sol Cerberus program, allowing the use of a succinct syntax to perform authenticated requests.

## Anchor installation

Add the following dependencies into the `Cargo.toml` file of your Anchor program located at `./programs/NAME-OF-YOUR-PROGRAM/Cargo.toml`:

```toml
[dependencies]
anchor-spl = { version = "0.29.0", features = ["metadata"] }
sol-cerberus = { version = "0.1.12", features = ["cpi"] }
solana-program = "1.16.20"

idl-build = ["anchor-lang/idl-build", "anchor-spl/idl-build"]

```
And also the `idl-build` into the `features` section:

```toml
[features]
idl-build = ["anchor-lang/idl-build", "anchor-spl/idl-build"]
```


## Frontend installation

The Sol Cerberus [Javascript SDK] package is used to facilitate the interaction with the Sol Cerberus program.

To install the package add the following dependencies into the `package.json` file of your frontend:

```json
{
  "dependencies": {
    "sol-cerberus-js": "latest",
    "@metaplex-foundation/js": "^0.20.1" // Optional (if planning to use NFTs)
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

[Sol Cerberus crate]: https://crates.io/crates/sol-cerberus
[Javascript SDK]: https://www.npmjs.com/package/sol-cerberus-js
[Requirements]: ../requirements
[Setup]: ../setup
