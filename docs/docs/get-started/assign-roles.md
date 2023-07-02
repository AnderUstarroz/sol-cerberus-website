---
layout: default
title: Assign roles
parent: Get started
nav_order: 4
---

# Assign roles
{: .no_toc }

---


## Table of contents
{: .no_toc .text-delta }

1. TOC
{:toc}

---

Roles are defined by the system administrator to ensure that users can only perform actions that are appropriate for their role and level of responsibility. 

Roles can be assigned to:

- The address of some specific `Wallet`
- The address of some specific `NFT`
- The address of some specific `NFT Collection`

## Assigning role to a Wallet

Roles can be assigned using the `assignRole()` instruction provided by the [JS SDK]: 

```js
import { SolCerberus, addressType } from "sol-cerberus-js";

// Replace the following line using your own APP ID:
const scAppId = new PublicKey("CZE2m73MW8V3APLEs6fhiYxWqxSGJibdxFGdTAzsBj2m");

const solCerberus = new SolCerberus(scAppId, provider);
const role = "SquareMaster";
// The Wallet receiving the role "SquareMaster"
const walletAddress = new PublicKey("A1Psm73MW8V3APLEs6fhiYxWqxSGJibdxFGdTAzsur19");

// Assigning Role to Wallet
await solCerberus.program.methods
  .assignRole({
    address: walletAddress,
    role: role,
    addressType: addressType.Wallet,
    expiresAt: null,
  })
  .accounts({
    role: await sc_role_pda(scAppId, role, walletAddress),
    solCerberusApp: await solCerberus.getAppPda(),
    solCerberusRole: null,
    solCerberusRule: null,
    solCerberusToken: null,
    solCerberusMetadata: null,
    solCerberusSeed: null,

  })
  .rpc();
```
Check out a working example from our demo program: [Assign role to a wallet](https://github.com/AnderUstarroz/sol-cerberus-demo/blob/main/tests/2_square.ts#L38-L49).

## Assigning role to a NFT
To apply a role to the owner of some specific NFT, just add the mint address of the NFT into the `address` param and set `addressType.NFT`:

```js
// Assigning Role to NFT
await solCerberus.program.methods
  .assignRole({
    address: new PublicKey("HERE_THE_MINT_ADDRESS_OF_YOUR_NFT"),
    role: role,
    addressType: addressType.NFT,
    expiresAt: null,
  })
  .accounts({
    role: await sc_role_pda(scAppId, role, walletGettingRole),
    solCerberusApp: await solCerberus.getAppPda(),
    solCerberusRole: null,
    solCerberusRule: null,
    solCerberusToken: null,
    solCerberusMetadata: null,
    solCerberusSeed: null,

  })
  .rpc();
```
Check out a working example from our demo program: [Assign role to a NFT](https://github.com/AnderUstarroz/sol-cerberus-demo/blob/main/tests/3_circle.ts#L53-L64).

## Assigning role to an entire NFT Collection
Applying a role to a collection means that every owner of a NFT belonging to that specific collection will get the role. To apply a role to an entire NFT collection, just add the collection mint address into the `address` param and set `addressType.Collection`:

```js
// Assigning Role to an entire NFT Collection
await solCerberus.program.methods
  .assignRole({
    address: new PublicKey("HERE_THE_COLLECTION_MINT_ADDRESS"),
    role: role,
    addressType: addressType.Collection,
    expiresAt: null,
  })
  .accounts({
    role: await sc_role_pda(scAppId, role, walletGettingRole),
    solCerberusApp: await solCerberus.getAppPda(),
    solCerberusRole: null,
    solCerberusRule: null,
    solCerberusToken: null,
    solCerberusMetadata: null,
    solCerberusSeed: null,
  })
  .rpc();
```
Check out a working example from our demo program: [Assign role to an entire NFT collection](https://github.com/AnderUstarroz/sol-cerberus-demo/blob/main/tests/4_triangle.ts#L64-L75).

{: .note }
We have used the role `"SquareMaster"` as an example. You can use any other name, but it must be composed only by alphanumeric characters (`a-z`, `A-Z`,`0-9`) and have 16 characters max.

---

<div class="prev-next">
<div markdown="1">
[Setup]
</div>
<div markdown="1">
[Add permissions]
</div>
</div>

[JS SDK]: https://www.npmjs.com/package/sol-cerberus-js
[Setup]: ../setup
[Add permissions]: ../add-permissions