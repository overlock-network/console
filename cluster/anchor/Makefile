# Anchor version.
ANCHOR_CLI=v0.31.1
# Solana toolchain.
SOLANA_CLI=v2.1.0
# Build version should match the Anchor cli version.
VERSIONED_IMG_NAME=ghcr.io/overlock-network/anchor:$(ANCHOR_CLI)

.PHONY: build build-push build-shell publish

default:

build: build/Dockerfile
	@docker build \
	--build-arg ANCHOR_CLI=$(ANCHOR_CLI) \
	--build-arg SOLANA_CLI=$(SOLANA_CLI) \
	$@ -t $(VERSIONED_IMG_NAME)

build-push:
	@docker push $(VERSIONED_IMG_NAME)

build-shell:
	@docker run -ti --rm --net=host \
		-v $(WORKDIR)/..:/workdir \
		$(VERSIONED_IMG_NAME) bash

publish: build build-push