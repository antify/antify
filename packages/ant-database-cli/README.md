# Ant Database

It does:
- [x] Merges multiple schemas to one
- [x] Provide a client for each database
- [ ] Make fixtures logic
- [ ] Make seed logic
- [ ] Make migration logic
- [x] Handle multiple migrations from different sources
- [x] Comes with a set of cli commands
- [x] Provides a core and tenant client
- [x] Handle multiple databases for one schema (tenancy)
- [x] Define how things can be extended trought different schemas
- [ ] Write docs
- [ ] Improve security 

TODO:
- [x] Rename nuxt namings
- [ ] Find a propper solution to call client.connect only once
- [ ] Write a preview command which show the migration state like so:
A
B <-- Missing
C <-- Current Version
D <-- Not executed

## Usage

TODO::

### Migration naming

The sorting of the migration names is important. New migrations should be added to the end (sorted ASC).
Its recommended to keep the date at start of the name.

## Development

- Run `pnpm build` to generate type stubs.
- Run `node bin/ant-db.mjs` to call commands.
