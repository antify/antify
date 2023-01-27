docker-build:
	docker build --no-cache --pull -t ghcr.io/blue-panda-dev/booking-system/api:$(DOCKER_TAG) .

docker-build-latest:
	DOCKER_TAG=latest make docker-build

docker-push:
	docker push ghcr.io/blue-panda-dev/booking-system/api:$(DOCKER_TAG)

docker-push-latest:
	DOCKER_TAG=latest make docker-push