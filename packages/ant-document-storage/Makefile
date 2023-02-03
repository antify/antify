docker-build:
	docker build --no-cache --pull -t ghcr.io/antify/antify/ant-document-storage:$(DOCKER_TAG) .

docker-build-latest:
	DOCKER_TAG=latest make docker-build

docker-push:
	docker push ghcr.io/antify/antify/ant-document-storage:$(DOCKER_TAG)

docker-push-latest:
	DOCKER_TAG=latest make docker-push