IMAGE_NAME=nextjs-app

PORT=3000

.PHONY: all
all: build

.PHONY: build
build:
	docker build -t $(IMAGE_NAME) -f ./Dockerfile .

.PHONY: run
run:
	docker run --rm -p $(PORT):3000 --name $(IMAGE_NAME) $(IMAGE_NAME)

.PHONY: run-detach
run-detach:
	docker run -d -p $(PORT):3000 --name $(IMAGE_NAME) $(IMAGE_NAME)

.PHONY: stop
stop:
	docker stop $(IMAGE_NAME) || true
	docker rm $(IMAGE_NAME) || true

.PHONY: clean
clean: stop
	docker rmi $(IMAGE_NAME) || true
