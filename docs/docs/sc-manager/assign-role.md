---
layout: default
title: Assign Role
parent: SC Manager
nav_order: 4
---

# Assign Role (SC Manager)
{: .no_toc }

---

## Table of contents
{: .no_toc .text-delta }

1. TOC
{:toc}

---
In order to control access to an app, at least one Role is necessary. Roles are simply text strings 
(names). The role can be assigned to either:

- A wallet address
- A NFT address
- All owners of NFTs belonging to a specific collection address.
- Everyone (using the `"*"` wildcard) 

## Assign role
To assign a role, follow these steps inside your [SC app](https://solcerberus.com/app):

- Click on **Roles** section.
- Click Assign Role.
- Pick a name.
- Choose Type of address.
- Enter the address. 
- Click on `Save changes` to upload changes to the blockchain.

#### Temporary roles
Role assignments can be temporary, click the `Temporary` checkbox and set an UTC time at which the role assignment will expire. 

{: .note }
You can assign the same role to several wallets/NFTs/Collections, or any mix thereof. Click Add, next to 
the role name, or use Assign and enter the same role name again.


---
<div class="prev-next">
<div markdown="1">
[Delete Sol Cerberus app]
</div>
<div markdown="1">
[Delete Assigned Role]
</div>
</div>

[Delete Sol Cerberus app]: ../delete-sol-cerberus-app
[Delete Assigned Role]: ../delete-assigned-role
