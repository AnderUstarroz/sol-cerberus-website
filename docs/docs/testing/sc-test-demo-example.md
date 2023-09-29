---
layout: default
title: SC test demo example
parent: Testing
nav_order: 1
---

# SC Test demo example
{: .no_toc }

---
## Table of contents
{: .no_toc .text-delta }

1. TOC
{:toc}

---

The easiest to understand testing is by looking at the [tests examples](https://github.com/AnderUstarroz/sol-cerberus-demo/tree/main/tests) of the Sol Cerberus [Demo](https://demo.solcerberus.com/) program. 


## Create a Sol Cerberus instance
You can use either a random generated SC app ID or a fixed public key.
```js
solCerberus = new SolCerberus(PROVIDER.connection, PROVIDER.wallet, {
    appId: new PublicKey("REPLACE_BY_YOUR_SC_APP_ID"),
  });
```
[Demo code example](https://github.com/AnderUstarroz/sol-cerberus-demo/blob/main/tests/1_initialize_demo.ts#L18-L20)
  
## Create Sol Cerberus app
Creates a SC app in the block-chain for your Anchor program, using the app ID defined on the previous step.
```js
await solCerberus.initializeApp("SolCerberusRBAC", null, {
    cached: false,
});
``` 
[Demo code example](https://github.com/AnderUstarroz/sol-cerberus-demo/blob/main/tests/1_initialize_demo.ts#L48-L50)

## Assign role to a wallet

  ```js
  await solCerberus.assignRole(
      "MyRole",
      addressTypes.Wallet,
      new PublicKey("HERE_THE_ADDRESS_OF_THE_ALLOWED_WALLET")
    );
  ```
[Demo code example](https://github.com/AnderUstarroz/sol-cerberus-demo/blob/main/tests/2_square.ts#L23C1-L29C1)

## Grant some permission to the role

```js
await solCerberus.addRule("MyRole", "Square", "Add");
```
[Demo code example](https://github.com/AnderUstarroz/sol-cerberus-demo/blob/main/tests/2_square.ts#L71)


## Fetch the updated permissions
  
```js
await solCerberus.fetchPerms();
```
[Demo code example](https://github.com/AnderUstarroz/sol-cerberus-demo/blob/main/tests/2_square.ts#L76)

## Login using the allowed wallet

```js
await solCerberus.login({ wallet: new PublicKey("HERE_THE_ADDRESS_OF_THE_ALLOWED_WALLET") });
```
[Demo code example](https://github.com/AnderUstarroz/sol-cerberus-demo/blob/main/tests/2_square.ts#L75)

## Verify access
Check an instruction of your program using the allowed wallet to verify access
```js
    await DEMO_PROGRAM.methods
    .addSquare("ff0000", 50)
    .accounts({
      demo: demoPda,
      signer: new PublicKey("HERE_THE_ADDRESS_OF_THE_ALLOWED_WALLET"),
      ...(await solCerberus.accounts("Square", "Add")),
    })
    .signers([ALLOWED_WALLET_KEY_PAIR])
    .rpc();
```
[Demo code example](https://github.com/AnderUstarroz/sol-cerberus-demo/blob/main/tests/2_square.ts#L80-L88)

---

<div class="prev-next">
<div markdown="1">
[Testing](/docs/testing)
</div>
<div markdown="1">
</div>
</div>
