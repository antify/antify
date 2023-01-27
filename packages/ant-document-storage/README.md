# Antify document storage

Simple document storage nitro http server to provide documents with jwt authentication.

## JWT Protection

All documents are only reachable with a json web token.
The token strukture looks like:

    {
        "iat": 1516239022,
        "documentStorage": {
            "read": ["/my-images"],
            "write": ["/my-images"],
            "delete": ["/my-images"]
        },
    }

A user with this token only can read, write and delete files in the 
"/my-images" directory. 

Permissions can also be a glob pattern like `/my-images/*` or `/my-images/**`. A list of pattern you can find [here]([here](https://github.com/isaacs/minimatch)).

## Docker

Build docker image
```bash 
make docker-build DOCKER_TAG=X.X.X
```

Push docker image
```bash 
make docker-push DOCKER_TAG=X.X.X
```

For more commands read the Makefile.

## Develop

Install dependencies
```bash 
pnpm i --shamefully-hoist
```

Create .env file
```bash 
cp .env.dist .env
```

Run http server
```bash 
pnpm dev
```

Run unit tests
```bash 
pnpm test
```

If env NODE_ENV is not 'production', you can visit [http://localhost:3000/dev](http://localhost:3000/dev) to get a simple ui for simple actions like uploading a file or setting a jwt in browser cookie.

## TODO:: 
- [ ] Write docs
- [ ] Make 404 html
- [ ] Make 401 html
- [ ] Make 403 html
- [ ] Make 500 html
- [x] Unify the jwt structure
- [x] Unify jwt validation
- [ ] Do not show critical errors on production
- [ ] Add sentry integration
- [ ] Implement unjs/ipx
- [ ] Add infinite nested dirs to have long paths like localhost/foo/bar/blub/image.png
- [ ] Provide docker image
- [ ] Add endpoint to graph multiple files
- [ ] Add filter to endpoint to graph files of type XY or with name XY
- [ ] e2e tests
- [ ] set fixed engine
- [ ] Fix not working cors and add them to env