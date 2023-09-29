---
layout: default
title: Add Rule
parent: SC Manager
nav_order: 6
---

# Add Rule (SC Manager)
{: .no_toc }

---


## Table of contents
{: .no_toc .text-delta }

1. TOC
{:toc}

---
The permission rules define which actions are allowed to the holder of a specific role.

## Resources and Permissions
The permission defines which action can be performed on which resource by which role. Sol Cerberus allows defining any combination of roles, resources and permissions, allowing fine-grained access management. 

## Assign rule
Inside your [SC app](https://solcerberus.com/app):

- Click on the **Permissions** section.
- Click New permission.
- Enter a `Role`. 
- Enter a `Resource`. 
- Enter a `Permission`. 
- Click on `Save changes` to upload changes to the blockchain.

#### Temporary Permissions
Permissions can be temporary, click the `Temporary` checkbox and set an UTC time at which the rule will expire. 


{: .note }
Example. Allow guests to open the door, assign a permission rule as... 
Role: Guest, Resource: Door, Permission: Open

{: .note }
Using the Add buttons next to roles or resources helps quickly adding multiple similar rules.

---

<div class="prev-next">
<div markdown="1">
[Delete Assigned Role]
</div>
<div markdown="1">
[Delete Rule]
</div>
</div>

[Delete Assigned Role]: ../delete-assigned-role
[Delete Rule]: ../delete-rule
