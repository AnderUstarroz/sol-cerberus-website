---
layout: default
title: Update Sol Cerberus app
parent: SC Manager
nav_order: 2
---

# Update Sol Cerberus app (SC Manager)
{: .no_toc }

---



## Table of contents
{: .no_toc .text-delta }

1. TOC
{:toc}

---
By connecting a wallet to the SC Manager, you can see all SolCerberus apps connected to that wallet. 
Click manage on an app in order to update any settings. 

## Caching
By default, the SC Manager will cache permissions and rules on the client side to make the manager interface faster to load and use. The setting can be turned off here if necessary.

## Transfering ownership
If you want to transfer the ownership of the account managed by the Sol Cerberus app, update the authority
under settings. 

{: .caution }
Changing the authority will immediately transfer the ownership of the app. Setting the wrong key here will
result in permanent loss of access. We suggest always having a recovery address, transfer the authority 
first, validate that the transfer is correct and then change the recovery. 

{: .note }
Transfering the authority is a nice way to move control from one of your wallets to another.
 

---

<div class="prev-next">
<div markdown="1">
[Create Sol Cerberus app]
</div>
<div markdown="1">
[Delete Sol Cerberus app]
</div>
</div>

[Create Sol Cerberus app]: ../create-sol-cerberus-app
[Delete Sol Cerberus app]: ../delete-sol-cerberus-app
