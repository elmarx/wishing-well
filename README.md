# Wishing well
               
> Nothing's gonna stop me 'til I'm done
> 
> Until I'm done
> 
> *Parkway Drive, Wishing wells*

A best-practice example for an Express-NodeJS microservices that can be used as a foundation for new services.          

*Wishing-well* relies heavily on [io-ts](https://gcanti.github.io/io-ts/) for environment variables and input validation.

It also encourages a functional style outside of handlers (i.e., where feasible) with the help of [fp-ts](https://gcanti.github.io/fp-ts/). So having some idea of functional programming helps.

## Sponsors <img src="https://sweap.io/assets/styleguide/sweap-logo-standard-onlight-rgb.svg" alt="sweap.io" width="180" valign="middle" style="float: right;" />

Sponsored and used by [sweap.io](https://sweap.io).

## Features

- TypeScript, eslint, Prettier, Jest, Nodemon
- logging via Pino with [request context](https://blog.logrocket.com/logging-with-pino-and-asynclocalstorage-in-node-js/)
- input validation with [io-ts](https://gcanti.github.io/io-ts/)
- embraces async/await in handlers via [express-promise-router](https://www.npmjs.com/package/express-promise-router)
- configuration via environment variables
- flexible, custom, semantic error handling using [cause](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error/cause)  
- fast build of slim container images (leveraging [multi-stage builds](https://docs.docker.com/build/building/multi-stage/))
- good testability through (manual) dependency injection 
- pragmatic approach to functional programming, picking the good parts without being too academic
      
## Required software

- [direnv](https://direnv.net/) to set environment variables for development (especially `PATH` to execute binaries from installed npm packages)
  - [Direnv integration for IntelliJ](https://plugins.jetbrains.com/plugin/15285-direnv-integration) to use environment set via *direnv* for IntelliJ Run
- [FNM](https://github.com/Schniz/fnm) recommended to install appropriate node-version (according to `.node-version`)
- [just](https://just.systems/man/en/) to execute commands
- [jq](https://stedolan.github.io/jq/) to setup environment variables etc.,
- [gopass](https://www.gopass.pw/) to set secrets for development
- kcat
- docker-compose

## Project setup

The following strings need to be replaced/customized. Find them via [`git grep`](https://git-scm.com/docs/git-grep).

- `docker-repository`
- `wishing-well`
- `WishingWell`

### IntelliJ run TypeScript File

Select "NodeJS" configuration and add Node-Parameter [`-r ts-node/register`](https://www.npmjs.com/package/ts-node#node-flags-and-other-tools).

### Deployment

This depends heavily on the platform and your workflow. Typically, it's a good idea to boil down typical deployment
commands into [Justfile](./Justfile) recipes which can be executed by CI/CD and manually. 

## Usage

- `tsc` to check files
- `eslint src` to lint files
- `nodemon src/index.ts` to start the service and reload on changes (could also be `npm run dev`).
- `jest` (or `jest -w`) to run tests
- `just ci` to execute typical ci tasks in one go
- `just build` to build the docker image

# Philosophy
                        
*wishing-well* is a collection of currently known best practices for NodeJS microservices. It has a clear idea of what works good,
but of course it does not know everything. Maybe in the future some practices turn out to be not a good idea, maybe to work with
legacy code it's necessary to bend the rules/ideas presented here, maybe you just don't like them.

Feel free to pick the pieces you like and change what you don't like.


## Environment variables

All environment variables, required and optional, are defined in [`init/env.ts`](src/init/env.ts) as [io-ts type](https://gcanti.github.io/io-ts/modules/index.ts.html#type).
Simple defaults (e.g. ports) can be defined via [`withFallback`](https://gcanti.github.io/io-ts-types/modules/withFallback.ts.html). 

Optional values can typically be modeled as `t.union([t.string, t.undefined])`. 

More complex types should go to [`init/codecs.ts`](init/codecs.ts).

## Configuration

A global type describing the complete service-configuration is defined in [`init/index.ts`](src/init/index.ts).
It will reference other types defining specific configurations, e.g. credentials for other services:

```typescript
type Config = {
  database: DatabaseCredentials;
};
```

Other configuration-types may live in own files/folders or in [`init/index.ts`](src/init/index.ts), depending on complexity.

The `Config` type should be instantiated in [`init/config.ts`](src/init/config.ts). Typically, it starts by piping [`process.env`](https://nodejs.org/dist/latest/docs/api/process.html) to the 
environment-codec, and then putting environment-variables into `Config` values.

This could become a long, messy function, but typically it's rather simple code.

If this gets too long, split it into specific files (e.g. `db.init.ts`, just like the configuration-types).

## Dependency injection
      
*wishing-wells* relies on manual dependency injection, to make the code testable and separate initialization code from
"actual" business-code, without needing some framework/library etc.

All dependencies need to be defined in [`init/index.ts`](src/init/index.ts):

```typescript
export type Dependencies = {
  errorMiddleware: ErrorRequestHandler;
  loggingMiddleware: Handler[];
  helloHandler: Router;
};
```

The function [`wire()`](src/init/wire.ts) takes the configuration as input and then initializes all dependencies (of course in required order),  
and returns them as required by the `Dependency` type.

## Initialization   
              
The [`main()`](src/index.ts) function initializes the express-application by plugging together config, dependencies and 
different middlewares in the required order.

If something fails at initialization (e.g. reading environment variables) the strategy is to simply throw and thus quit.

## Error handling

Wishing-well's idea of error-handling is to wrap errors where they occur into custom errors. Adding additional context, an appropriate http-status-code and the original error (as [`cause`-property](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error/cause)).

Custom errors should extend [`WishingWellError`](src/errors.ts) which defines the basic structure, i.e. status-code. 
Sometimes it makes sense to further distinguish errors, e.g. "retryable errors" and "fatal errors", which could be done by a required
property in the [`WishingWellError`](src/errors.ts) or via further abstract subtypes.

Then this error can bubble up, and should ultimately be unwrapped and thrown by the handler. It will then be picked up by a
[custom express error-handler](https://expressjs.com/en/guide/error-handling.html#writing-error-handlers) ([`handler/errorMiddleware.ts`](src/handler/errorMiddleware.ts)).

"Bubbling up" means in this case of course to return an [Either.Left](https://gcanti.github.io/fp-ts/modules/Either.ts.html#left-interface) in functional code (or `throw` in imperative code).  

### Example

You have two abstractions to access different Rest-Apis, e.g. the github-api and the twitter-api, probably using [axios](https://axios-http.com/). If the http-request fails,
axios returns an [`AxiosError`](https://github.com/axios/axios/blob/659eeaf67cc0d54e86d0e38b90bd6f8174f56fca/index.d.ts#L344). The abstraction for the API knows best what different status-codes of the API mean, so they should
wrap it inside errors like `InvalidGithubCredentialsError` or `InvalidTwitterCredentialsError`.
For this contrived example, let's assume the github-credentials where originally provided by the user of the microservice, that would 
typically result in a 401/403 error. On the other hand, if your services provides the twitter credentials via configuration, then
it's "your fault" and the service should return error 500.
Now imagine you would bubble only the `AxiosError` with status 401. It's hard to later decide what to do with a (low level) error.

## Input validation

Use [io-ts](https://gcanti.github.io/io-ts/) to validate "complex" input (e.g. `req.body`). "Simple" input like query-parameters can of course
be modeled as simple typescript type, e.g. ```{q?: string}```.

Since validation typically happens as the very first thing in handlers, it's a pragmatic way to check if the validated input 
[`isLeft`](https://gcanti.github.io/fp-ts/modules/Either.ts.html#isleft) and then throw immediately a [`BadRequestError`](src/errors.ts).  

## Logging           

[Pino](https://getpino.io/#/docs/api) is being statically initialized at startup and a global variable `logging` can be used everywhere, so no need to pass through a logger instance.
It tracks context of requests via [async_hooks](https://nodejs.org/api/async_hooks.html).
Pino formats logs as JSON by default, but for development set the environment-variable `LOG_PRETTY=1` to use [pino-pretty](https://github.com/pinojs/pino-pretty).

## Functional Core, Imperative shell

Wishing-well follows the idea of [functional core, imperative shell](https://www.kennethlange.com/functional-core-imperative-shell/),
where [`main()`](src/index.ts) and express-handlers are the imperative shell doing side effects (e.g. `throw`, call `res.send()`, etc.).

All other code (functions, classes injected into the init-handler functions) should be written in a functional style, 
wrapping side-effects into [Either](https://gcanti.github.io/fp-ts/modules/Either.ts.html) and 
[TaskEither](https://gcanti.github.io/fp-ts/modules/TaskEither.ts.html) (in effect this also means no async/await (required) outside
of handlers).  

An exception to this rule is logging. Logging is a valid use case for a "magic, global" variable which can be called from everywhere.
