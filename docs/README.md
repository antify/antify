# TODO's

## General

- [x] Initial install process
- [x] Permission groups
- [x] Data date time tracking
- [ ] Data history (zurückgestellt. Wenn umsetzten mit mysql trigger oder procedures. Problem: Dort mitschreiben wer etwas geändert hat)
- [ ] Delete flag (zurückgestellt. Sollte auch über die data history abgebildet werden. An sonsten geht die Möglichkeit von unique feldern etc. verloren bzw. verursacht nur neue Probleme.)
- [ ] Force delete process (zurückgestellt - siehe delete flag)
- [ ] Clean way how to work with it
- [ ] Pagination
- [ ] Type validation on rest endpoints
- [ ] A way, how pages with there api work (validation, types etc)
- [ ] Extend all script sections with ``lang="ts"`` and fix all errors
- [ ] e2e tests
- [ ] Setup clean error handling
- [ ] Remove auth:migration:reinit command
- [ ] CI/CD
- [ ] Docker
- [ ] CORS
- [ ] env processor
- [ ] Loading state everywhere
- [ ] Form validation (server- and clientside)

## Extends

- [ ] How to extend page
- [ ] How to extend component
- [ ] How to extend api
- [ ] How to extend database

## Overrides

- [ ] How to override page
- [ ] How to override component

# Experiences with nuxt3

## Child apps

- Middleware does not work for third child app depth
