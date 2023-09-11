# Ant Guard

Protects api endpoints with jwt. Provide a list of helper functions and handlers for resolvers / controllers.

## Usage

TODO::

## TODO's

- [ ] Write docs
- [x] Extend token logic to have permissions for single database apps too
- [ ] Implement refresh token: https://cheatsheetseries.owasp.org/cheatsheets/JSON_Web_Token_for_Java_Cheat_Sheet.html
- [ ] Improve security by adding issuer and audience https://datatracker.ietf.org/doc/html/rfc7519#section-4.1.1
- [ ] Improve security by using maxTokenAge from JWTVerifyOptions from jwtVerify function 
- [ ] Add security logs

## Development

- Run `pnpm build` to generate type stubs.
- Run `node bin/ant-db.mjs` to call commands.
