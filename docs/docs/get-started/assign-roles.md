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

## How to assign a role

There are two ways to assign Roles, either:

- [Assign role using the SC manager] (recommended)
- [Assign role using the JS SDK]


## Temporary Roles
Sol Cerberus supports temporary roles. Adding an expiring date when assigning roles will make the roles effective only until the provided date.

## Assigning role to a wildcard address (*) 
Roles can be assigned to a wildcard address `"*"`, meaning that the Role will be applied to everyone. 


---

<div class="prev-next">
<div markdown="1">
[Setup]
</div>
<div markdown="1">
[Add permissions]
</div>
</div>

[Assign role using the SC manager]:  /docs/sc-manager/assign-role
[Assign role using the JS SDK]: /docs/javascript-sdk/assign-role
[Setup]: ../setup
[Add permissions]: ../add-permissions