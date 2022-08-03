.PHONY:setup
setup:
	cd ../ && make setup

rebuild:
	pnpm run core:migration:reinit
	pnpm run tenant:migration:reinit
	cd ../ && docker-compose down && make setup
	