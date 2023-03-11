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

Now that we have [secured our Anchor instructions], we area ready to test them out.

## Testing my instruction
To test our instruction we need to use the JS `solCerberus.assignedRoles()` method to fetch all the roles assigned to our `wallet`, `NFT` or `Collection` address. 

Using our [demo program] as an example, we will try to `Add` (permission) a `Square` (resource). We will be using the wallet address `A1Ps...ur19`, the one to which we applied the role `SquareMaster` on a [previous example].

```js
// The Wallet which received the role "SquareMaster" (replace this by your own wallet or NFT or Collection address)
const allowedAddress = new PublicKey("A1Psm73MW8V3APLEs6fhiYxWqxSGJibdxFGdTAzsur19");

// Fetch the roles assigned to my address
const myRoles = await solCerberus.assignedRoles([allowedAddress]);

// Sol Cerberus knows in advance if the user is allowed to perform an action or not
// this makes for a nicer frontend user experience:
if (solCerberus.hasPerm(myRoles, "Square", "Add")){
    try {
        // Add square
        await DEMO_PROGRAM.methods
            .addSquare("ff0000", 50)
            .accounts({
            demo: demoPda,
            signer: allowedAddress,
            ...(await solCerberus.accounts(myRoles, "Square", "Add")),
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
Check out a working example from our demo program: [Test restricted access](https://github.com/AnderUstarroz/sol-cerberus-demo/blob/main/tests/2_square.ts#L109-L117)

### Retrieving assigned roles for a NFT collection
If the roles have been assigned to an entire NFT collection, the call to the `solCerberus.assignedRoles()` method will be slightly different. We will need to provide the `collection address` and also the `Mint address` of a NFT that we own from that collection to prove our credentials:

```js
// The collection address that received the Role:
const myCollectionAddress = new PublicKey("MycOll3CtIoNeXaMpLeiYxWqxSGJ6bdxFGdTA9sur19");
// An NFT that the user has in his wallet an belongs to the previous collection.
const myNftMint = new PublicKey("MyNFTmInTeXaMpLe6fhiYxWqxSGJib8xFGdTAz87yT");

// Fetch the roles assigned to my NFT collection address
const myRoles = await solCerberus.assignedRoles(
    [myCollectionAddress], 
    {[myCollectionAddress]: myNftMint} // Defines "Collection" to "NFT" mapping.
);
```
Check out a working example from our demo program: [Retrieve roles from NFT collection](https://github.com/AnderUstarroz/sol-cerberus-demo/blob/main/tests/4_triangle.ts#L76-L78)


{: .note }
The method `solCerberus.assignedRoles()` accepts an array of addresses. Therefore it can retrieve the roles for several addresses at once, but we recommend you not to use more than 2 or 3 address at once, as it could affect performance and be expensive in terms of network usage.

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
[previous example]: ../assign-roles#assigning-role-to-a-wallet
[Restrict access]: ../restrict-access
[Add permissions]: ../add-permissions
