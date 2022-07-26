.PHONY:setup
setup:
	cp .env.dist .env
	cd ../ && docker-compose up -d
	pnpm i --shamefully-hoist
	pnpm build
	pnpm app:rebuild
	pnpm dev