# Ant Database

It does:
- [x] Merges multiple schemas to one
- [x] Generate prisma types for schemas
- [x] Provide a client for each database
- [ ] Handle multiple migrations from different sources
- [ ] Comes with a set of cli commands
- [x] Provides a core and tenant client
- [ ] Handle multiple databases for one schema (tenancy)
- [ ] Define how things can be extended trought different schemas
- [ ] Make prisma seed logic available for multiple components

## Development

- Run `npm run dev:prepare` to generate type stubs.
- Use `npm run dev` to start [playground](./playground) in development mode.
