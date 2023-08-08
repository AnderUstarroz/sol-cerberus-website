---
layout: default
title: Add permissions
parent: Get started
nav_order: 5
---

# Add permissions
{: .no_toc }

---


## Table of contents
{: .no_toc .text-delta }

1. TOC
{:toc}

---

`Permissions` are the actions that a user with specific `role` is allowed to perform within a specific `resource`. Sol Cerberus defines the permissions using sets of `Rules`, which are combinations of the three:

- `Role` -> `Resource` -> `Permission`

## How to add permissions

There are two ways to add permissions:

- [Add permission using the SC manager] (recommended)
- [Add permission using the JS SDK]

## Demo program example

`Rules` are easier to understand using our [demo program] as an example.

We created 3 roles:

- `SquareMaster`
- `CircleMaster`
- `TriangleMaster`

3 resources:

- `Square`
- `Circle`
- `Triangle`

And the `Add`, `Update` and `Delete` permissions for each role's corresponding resource:

| Role | Resource | Permission |
|:-----|:--------|:--------|
| `SquareMaster` | `Square` | `Add` |
| `SquareMaster` | `Square` | `Edit` |
| `SquareMaster` | `Square` | `Delete` |
| `CircleMaster` | `Circle` | `Add` |
| `CircleMaster` | `Circle` | `Edit` |
| `CircleMaster` | `Circle` | `Delete` |
| `TriangleMaster` | `Triangle` | `Add` |
| `TriangleMaster` | `Triangle` | `Edit` |
| `TriangleMaster` | `Triangle` | `Delete` |

## Temporary Permissions
Sol Cerberus supports temporary permissions. Adding an expiring date when adding permissions will make the permissions effective only until the provided date.

## Wildcards
`Resource` and `Permission` can be replaced by the wildcard character `*` to represent all resources or permissions, for instance:

- `SquareMaster` -> `Square` -> `*` (all permission on resource `Square` for the `SquareMaster` role)
- `SquareMaster` -> `*` -> `*` (all permission on all resources for the `SquareMaster` role)

---

<div class="prev-next">
<div markdown="1">
[Assign roles]
</div>
<div markdown="1">
[Restrict access]
</div>
</div>

[Add permission using the SC manager]: /docs/sc-manager/add-rule
[Add permission using the JS SDK]: /docs/javascript-sdk/add-rule
[demo program]: https://demo.solcerberus.com/
[Assign roles]: ../assign-roles
[Restrict access]: ../restrict-access