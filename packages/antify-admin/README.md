TODO's

- [ ] Call fixtures from nuxt typescript context and remove ts-node and typescript from dependencies
- [ ] Finish cockpit mail templates
- [ ] Give cockpit his own login mai?
- [ ] Document why antify admin is using ~~ and in the main project this should not be used (https://github.com/nuxt/framework/issues/3222)
- [ ] Remove Http - Errors and replace with error in response data principle (exceptional unauthorized and forbidden ones? may?) - find a way...
- [ ] Add pagination everywhere
- [ ] Finish integration tests
- [ ] Find a namespace convertion and document it
- [ ] Implement permission check in frontend. Does user x can navigate to "Roles"?
- [ ] Implement whole CRUD with all posible Errors in a clean way.
- [ ] When an unauthorized response come, remove the users token an redirect him to login.

# Features

- [ ] You have unsaved changes alert
- [ ] Lock page if some one edit
- [ ] API - find a better way how to emit on PUT and DELETE if the given id exists
- [ ] Logo in Navbar from tenant
- [ ] Implement tenant CRUD
- [ ] Permissions and roles CRUD
- [ ] Toaster UI
- [ ] General error handling
- [ ] Implement install context / hooks
- [ ] Implement fixtures context / hooks
- [ ] History defaults
- [ ] Split up installs and fixtures
- [ ] Mailing
- [ ] Templates for mailing
- [ ] Tenant CLI - handle multiple databases etc.
