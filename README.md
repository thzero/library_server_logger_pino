![GitHub package.json version](https://img.shields.io/github/package-json/v/thzero/library_server_logger_pino)
![David](https://img.shields.io/david/thzero/library_server_logger_pino)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

# library_server_logger_pino

A [pino](https://getpino.io) backed logger for [@thzero/library_server](https://github.com/thzero/library_server).

Registers as one of the logger services the framework fans out to, so an application can run pino alone or alongside another logger (winston, syslog) without changing any calling code.

## Requirements

### NodeJs

[NodeJs](https://nodejs.org) version 22+

### Installation

[![NPM](https://nodei.co/npm/@thzero/library_server_logger_pino.png?compact=true)](https://npmjs.org/package/@thzero/library_server_logger_pino)

```
npm install @thzero/library_server_logger_pino
```

#### Peer dependencies

* `@thzero/library_common`
* `@thzero/library_common_service`
* `@thzero/library_server`

## What it provides

A single default export, `LoggerService`, implementing the logger contract the framework calls:

| Method | Signature |
|---|---|
| `debug` / `error` / `fatal` / `info` / `trace` / `warn` | `(clazz, method, message, data, correlationId, isClient)` |
| `debug2` / `error2` / `fatal2` / `info2` / `trace2` / `warn2` | `(message, data, correlationId, isClient)` |
| `exception` | `(clazz, method, ex, correlationId, isClient)` |
| `exception2` | `(ex, correlationId, isClient)` |
| `raw` | `(message, data, correlationId, isClient)` |
| `initLogger` | `(logLevel, prettify, config)` |

The `2` variants are the same call without a class and method — use them where there is no meaningful originating class.

Every line is formatted by `_format`, which puts the correlationId first so a request can be traced across services:

```
(sNC7TWVZY9ChN1wQk6qqW) MongoRepository._initializeDb: databaseName resolved
```

An `isClient` of `true` prefixes the message with `CLIENT: `, marking lines that originated in a browser and were relayed through `/utility/logger`.

## Configuration

`initLogger` is called for you during boot from the `logging` block; there is nothing pino-specific to configure.

```json
{
    "app": {
        "logging": {
            "level": "debug",
            "prettify": false
        }
    }
}
```

* **`level`** — any pino level. Overridden by the `LOG_LEVEL` environment variable.
* **`prettify`** — when `true`, output is routed through a `pino-pretty` transport. Overridden by `LOG_PRETTIFY`. **`pino-pretty` is not a dependency of this package** — add it to the application when you turn this on, or boot will fail resolving the transport.

## Wiring it up

Register it from `_initServicesLoggers` in your `BootMain` derived class:

```js
import pinoLoggerService from '@thzero/library_server_logger_pino';

class AppBootMain extends BootMain {
    _initServicesLoggers() {
        this._registerServicesLogger(AppConstants.InjectorKeys.SERVICE_LOGGER_PINO, new pinoLoggerService());
    }
}
```

`_registerServicesLogger` both injects the service under that key and adds the key to the fan-out list, so more than one call registers more than one logger.

## Development

```
npm run lint       # eslint .
npm run lint:fix   # eslint . --fix
npm test           # node --test "test/*.test.js"
```
