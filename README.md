# 👋 Welcome to Antify

Antify is a headless multitenancy administration based on Nuxt 3 and MongoDB. It ships with basic features to run a SaaS app, such as user administration, invoicing, protected document management, and much more.

You can use the ready-to-go administration and extend it with the [Nuxt 3 layer system](https://nuxt.com/docs/getting-started/layers), or build your own and use only the parts you need by installing the antify modules instead.

# Developen

This repository is a mono repository.

## Setup dev env

Install dependencies

    pnpm i

Run for development required containers

    docker compose up -d

Navigate to the project, module or package you want to develop and look into package.json for useful commands.

# TODO's

- [ ] Unify context configuration
- [ ] Unify provider configuration
- [ ] Add lerna
- [ ] Finish packaging and rollup pipeline
