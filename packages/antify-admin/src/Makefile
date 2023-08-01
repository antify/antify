.PHONY:setup
setup:
	cd ../ && make setup

rebuild:
	pnpm ant-db migrate core
	pnpm ant-db load-fixtures core