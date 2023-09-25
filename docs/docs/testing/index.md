---
layout: default
title: Testing
nav_order: 5
has_children: true
permalink: /docs/testing
---

# Testing
{: .no_toc }

---

## Requirements
Running local tests on your Anchor program with Sol Cerberus requires the following dependencies:

- [Sol Cerberus](https://github.com/AnderUstarroz/sol-cerberus)
- [MPL Token medata](https://github.com/metaplex-foundation/mpl-token-metadata)

## Create Make file to build the dependencies
Create the file `./Makefile` on the root of your anchor program with [the following content](https://github.com/AnderUstarroz/sol-cerberus-demo/blob/main/Makefile):

```
.PHONY: dependencies

dependencies:
	@if ! [ -d "deps/mpl-token-metadata" ]; then \
		echo "Adding submodule: Metaplex program library"; \
		git submodule add --force https://github.com/metaplex-foundation/mpl-token-metadata deps/mpl-token-metadata; \
	fi
	@if ! [ -d "deps/sol-cerberus" ]; then \
		echo "Adding submodule: Sol Cerberus"; \
		git submodule add --force https://github.com/AnderUstarroz/sol-cerberus deps/sol-cerberus; \
	fi
	@echo "installing npm packages"
	yarn
	@echo "installing submodules"
	git submodule update --recursive --init
	@echo "Building token-metadata program.."
	cd deps/mpl-token-metadata/programs/token-metadata/program && cargo build-bpf && cd ../../../../
	@echo "Building sol-cerberus program.."
	cd deps/sol-cerberus/programs/sol-cerberus && cargo build-bpf && cd ../../../../

```
## Run the Make file
Run `make` at the root folder of your Anchor program. This will clone and build the dependencies in the `./deps` folder of your program.

## Update Anchor.toml test dependencies
Open `./Anchor.toml` and add [the following lines at the bottom](https://github.com/AnderUstarroz/sol-cerberus-demo/blob/main/Anchor.toml#L21-L27). This will load the **Sol Cerberus** and **Metadata** programs into your local environment when running tests:

```
[[test.genesis]]
address = "metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s"
program = "./deps/mpl-token-metadata/programs/token-metadata/target/deploy/mpl_token_metadata.so"

[[test.genesis]]
address = "SCERbrcgSPwgkrJ7j4TABr17dhYzdgiwPZUSSfFPt8x"
program = "./deps/sol-cerberus/target/deploy/sol_cerberus.so"
```

## Update package.json
Finally, add [the corresponding javascript packages](https://github.com/AnderUstarroz/sol-cerberus-demo/blob/main/package.json#L10-L11) to facilitate testing.

```
    "devDependencies": {
        "sol-cerberus-js": "^0.1.7",
        "@metaplex-foundation/js": "^0.18.1",

        ...
        ...
    }
```

## Running tests
Run your tests normally with `anchor test`.

---

<div class="prev-next">
<div markdown="1">
</div>
<div markdown="1">
[SC demo example]
</div>
</div>

[SC demo example]: /docs/testing/sc-demo-example
