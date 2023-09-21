---
layout: default
title: Test access
parent: Get started
nav_order: 7
---

# Test access
{: .no_toc }

---


## Table of contents
{: .no_toc .text-delta }

1. TOC
{:toc}

---

Now that we have [secured our Anchor instructions], we area ready to test the frontend.

## Testing wallet access
Taking our [demo program] as an example, we will test the [addSquare()](https://github.com/AnderUstarroz/sol-cerberus-demo/blob/main/programs/sol-cerberus-demo/src/lib.rs#L32-L35) instruction. This instruction is restricted to users with the `SquareMaster` role. We are doing the following assumptions:

 - The [`#[rule(Square, Add)]`](https://github.com/AnderUstarroz/sol-cerberus-demo/blob/main/programs/sol-cerberus-demo/src/lib.rs#L32) macro was already added to the instruction on [previous step](../restrict-access/#annotate-anchor-instruction-with-an-access-rule). 
 - The Role `SquareMaster` from the [previous example] is already [assigned to our wallet](../assign-roles/#how-to-assign-a-role).
 - The Rule `SquareMaster` -> `Square` -> `Add` was [already created](../add-permissions/#how-to-add-permissions).

```js
/**
 * Get the connection and wallet from "@solana/web3.js":
 * 
 *      const connection = new Connection(clusterApiUrl("mainnet-beta"), "confirmed");
 *      const wallet = Keypair.fromSecretKey(Uint8Array.from([174, 47, ...])); // Replacing Uint8Array by your own key
 *
 * Or with react using "useConnection" and "useWallet" from the "@solana/wallet-adapter-react" package:
 * 
 *      const { connection } = useConnection();
 *      const { publicKey, wallet } = useWallet();
 * 
 **/
const solCerberus = new SolCerberus(connection, myWallet, {appId: new PublicKey("PASTE_YOUR_SC_APP_ID_HERE")});
await solCerberus.fetchAllRoles()
await solCerberus.fetchPerms()

// Sol Cerberus knows in advance if the user is allowed to perform an action or not
// this makes for a nicer frontend user experience:
if (solCerberus.hasPerm("Square", "Add")){
    try {
        // Add square
        await DEMO_PROGRAM.methods
            .addSquare("ff0000", 50)
            .accounts({
            demo: demoPda,
            signer: myWallet,
            ...(await solCerberus.accounts("Square", "Add")), // Fetches the requires SC accounts
            })
            .rpc();
    } catch (e) {
        // If user is not authorized, you can easily catch the error and inform the user:
        if (solCerberus.isUnauthorizedError(e)) {
            alert("Not authorized!")
        }
    }
}
```
In this example we have created an instance of our [SC app](../setup#create-sol-cerberus-app) in Javascript using:

-  [`new SolCerberus()`](https://js-sdk.solcerberus.com/classes/SolCerberus.html#constructor)
  
Then fetched all roles with:

- [`solCerberus.fetchAllRoles()`](https://js-sdk.solcerberus.com/classes/SolCerberus.html#fetchAllRoles)

And injected all the required SC accounts into our instruction using:

- [`...(await solCerberus.accounts("Square", "Add"))`](https://js-sdk.solcerberus.com/classes/SolCerberus.html#accounts)

{: .note }
Use [`solCerberus.hasPerm()`](https://js-sdk.solcerberus.com/classes/SolCerberus.html#hasPerm) to execute your instruction only when users are allowed to perform the action, this will make for a better user experience (optional)


Check out a [working example](https://github.com/AnderUstarroz/sol-cerberus-demo/blob/main/tests/2_square.ts#L79-L88) from our [demo program].



### Testing NFT acccess
If the roles have been assigned to a NFT or collection, we need to follow a slightly different approach. Assuming that the role `SquareMaster` is assigned to an NFT address which exists in our wallet:

```js
import { Metaplex } from "@metaplex-foundation/js";


const solCerberus = new SolCerberus(connection, myWallet, {appId: new PublicKey("PASTE_YOUR_SC_APP_ID_HERE")});
await solCerberus.fetchAllRoles()
await solCerberus.fetchPerms()

// Fetch all my NFTS
const nfts = await metaplex.nfts().findAllByOwner({ owner: myWallet });
// Authenticate in Sol Cerberus using the NFTS
await solCerberus.login({
    nfts: nfts.map((nft) => {
        const nftMint = nft.mint? nft.mint.address : nft.mintAddress
        const collectionMint = nft.collection? nft.collection.address: nftMint
        return [nftMint, collectionMint]
    })
})
if (solCerberus.hasPerm("Square", "Add")){
    try {
        // Add square
        await DEMO_PROGRAM.methods
            .addSquare("ff0000", 50)
            .accounts({
            demo: demoPda,
            signer: myWallet,
            ...(await solCerberus.accounts("Square", "Add")), // Fetches the requires SC accounts
            })
            .rpc();
    } catch (e) {
        // If user is not authorized, you can easily catch the error and inform the user:
        if (solCerberus.isUnauthorizedError(e)) {
            alert("Not authorized!")
        }
    }
}
```
The only difference is that we have fetched all our NFTs using the `metaplex` library and then used `solCerberus.login()` to authenticate using an array of all our NFTs mints with their corresponding Collections mints, this way Sol Cerberus knows in advance (before calling the instruction) all the roles that are assigned to our wallet and NFTs.


Check out a [working example](https://github.com/AnderUstarroz/sol-cerberus-demo/blob/main/tests/4_triangle.ts#L59-L68) from our [demo program].


{: .warning }
The method `solCerberus.login({nfts:[]})` accepts an array of NFTs: `[NFTMintAddress, CollectionMintAddress]`, therefore it can retrieve the roles for several addresses at once, but we recommend not to use more than 2 or 3 addresses at once. Specially if caching is disabled in your SC app, as it could affect performance and be expensive in terms of RPC network usage.<br/><br/>**Ideally users should choose which NFT would use to authenticate**.

---

<div class="prev-next">
<div markdown="1">
[Restrict access]
</div>
<div markdown="1">
</div>
</div>

[secured our Anchor instructions]: ../restrict-access
[demo program]: https://demo.solcerberus.com/
[previous example]: ../add-permissions/#demo-program-example
[Restrict access]: ../restrict-access
[Add permissions]: ../add-permissions
