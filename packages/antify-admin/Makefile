.PHONY:setup
setup:
	# cp src/.env.dist src/.env
	docker-compose down
	docker-compose up -d
	sleep 5
	pnpm i --shamefully-hoist
	cd src && pnpm db:rebuild