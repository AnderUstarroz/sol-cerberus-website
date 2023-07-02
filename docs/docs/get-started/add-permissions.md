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

## Demo program example

`Rules` are easier to understand using our [demo program] as an example.

We created 3 roles:

- `SquareMaster`
- `CircleMaster`
- `TriangleMaster`

We created 3 resources:

- `Square`
- `Circle`
- `Triangle`

We gave `Add`, `Update` and `Delete` permissions to each of the roles but only for their corresponding resource:

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

## Wildcards
`Resource` and `Permission` can be replaced by the wildcard character `*` to represent all resources or all permissions respectively. For instance:

- `SquareMaster` -> `Square` -> `*` (all permission on resource `Square` for `SquareMaster`)
- `SquareMaster` -> `*` -> `*` (all permission on all resources for `SquareMaster`)

## Add permission

 Permissions can be added using the `addRule()` instruction provided by the [JS SDK]: 

```js
import { sc_rule_pda, SolCerberus, namespaces } from "sol-cerberus-js";

// Replace the following line using your own APP ID:
const scAppId = new PublicKey("CZE2m73MW8V3APLEs6fhiYxWqxSGJibdxFGdTAzsBj2m");

const solCerberus = new SolCerberus(scAppId, provider);
const role = "SquareMaster";
const resource = "Square";
const permission = "Add";

await solCerberus.program.methods
  .addRule({
    namespace: namespaces.Rule,
    role: role,
    resource: resource,
    permission: permission,
    expiresAt: null,
  })
  .accounts({
    rule: await sc_rule_pda(scAppId, role, resource, permission)
    solCerberusApp: await solCerberus.getAppPda(),
    solCerberusRole: null,
    solCerberusRule: null,
    solCerberusRule2: null,
    solCerberusToken: null,
    solCerberusMetadata: null,
    solCerberusSeed: null,
  })
  .rpc();
```
Check out a working example from our demo program: [Add permission](https://github.com/AnderUstarroz/sol-cerberus-demo/blob/main/tests/2_square.ts#L93-L106).

---

<div class="prev-next">
<div markdown="1">
[Assign roles]
</div>
<div markdown="1">
[Restrict access]
</div>
</div>

[JS SDK]: https://www.npmjs.com/package/sol-cerberus-js
[demo program]: https://demo.solcerberus.com/
[Assign roles]: ../assign-roles
[Restrict access]: ../restrict-access