# Ant Database Module

// TODOO:: make sure the connections get closed correctly here - on nuxt hooks (error, stop, etc);

It does:
- [x] Merges multiple schemas to one
- [x] Provide a client for each database
- [ ] Make seed logic
- [ ] Make install logic
- [ ] Make migration logic
- [ ] Handle multiple migrations from different sources
- [ ] Comes with a set of cli commands
- [x] Provides a core and tenant client
- [x] Handle multiple databases for one schema (tenancy)
- [x] Define how things can be extended trought different schemas
- [ ] Find a propper solution to call client.connect only once
- [ ] Write docs
- [ ] Improve security 

## Development

- Run `npm run dev:prepare` to generate type stubs.
- Use `npm run dev` to start [playground](./playground) in development mode.
