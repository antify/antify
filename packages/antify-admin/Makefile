.PHONY:setup
setup:
	# cp src/.env.dist src/.env
	docker-compose down
	docker-compose up -d
	pnpm i --shamefully-hoist
	cd src && pnpm core:generate
	cd src && pnpm tenant:generate
	cd src && pnpm build
	cd src && pnpm app:rebuild