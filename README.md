# DHT Sensor Domapic Module

> Domapic module for handling a DHT sensor in a Raspberry Pi

[![Build status][travisci-image]][travisci-url] [![Coverage Status][coveralls-image]][coveralls-url] [![Quality Gate][quality-gate-image]][quality-gate-url] [![js-standard-style][standard-image]][standard-url]

[![NPM dependencies][npm-dependencies-image]][npm-dependencies-url] [![Last commit][last-commit-image]][last-commit-url] [![Last release][release-image]][release-url]

[![NPM downloads][npm-downloads-image]][npm-downloads-url] [![License][license-image]][license-url]

---

## Intro

This package starts a Domapic Module that handles a DHT sensor, providing information about current temperature and relative humidity.

![DHT sensor connection schema][dht-sensor-schema-image]


It can be used alone, but also can be connected to a [Domapic Controller][domapic-controller-url] to get the most out of it.

## Installation

This module depends on the [BCM2835][bcm-url] library that must be installed on your board before you can actually use this module. It should work for DHT11, DHT22 and AM2302 sensors.

```bash
npm i dht-sensor-domapic-module -g
```

This module uses the [node-dht-sensor][node-dht-sensor-url] package to handle sensors, please refer to its documentation if you have any problem during installation.

## Usage

```bash
dht-sensor start --gpio=2
```

The module will be started in background using [pm2][pm2-url].

To display logs, type:

```bash
dht-sensor logs #--lines=300
```

## Options

The module, apart of all common [domapic services options][domapic-service-options-url], provides custom options for configuring the sensor:

* `sensorType` - `<number>` Define the type of connected sensor. Valid values are `11` (DHT11 sensor), and `22` (DHT22 or AM2302 sensors). Default is `11`
* `interval` - `<number>` Interval in miliseconds for refreshing sensor values. Default is 30000.
* `eventsStep` - `<number>` Minimum values variation for triggering an event. When variation relative to last sensor value is upper than this, the module will trigger an event notifying about the temperature or humidity change to Domapic Controller.
* `gpio` - `<number>` Gpio number where the sensor is connected.

## Connection with Domapic Controller

Connect the module with a Domapic Controller providing the Controller url and connection token (you'll find it the Controller logs when it is started):

```bash
dht-sensor start --controller=http://192.168.1.110:3000 --controllerApiKey=fo--controller-api-key  --save
```

Now, the module can be controlled through the Controller interface, or installed plugins.

## Stand alone usage

Domapic modules are intended to be used through Domapic Controller, but can be used as an stand-alone service as well. Follow next instructions to use the built-in api by your own:

### Rest API

When the server is started, you can browse to the provided Swagger interface to get all the info about the api resources.  Apart of all api methods common to all [Domapic Services][domapic-service-url] the module provides two [_Domapic Abilities_][domapic-service-abilities-url] for getting the current status of temperature and humidity, which generates two extra API resources:

* `/api/abilities/temperature/state` - Returns the current temperature.
* `/api/abilities/humidity/state` - Returns the current relative humidity.

### Authentication

The server includes the [Domapic Services][domapic-service-url] authentication method, which is disabled by default for `127.0.0.1`.
You can disable the authentication using the `--authDisabled` option (not recommended if your server is being exposed to the Internet). Read more about [available options in the domapic services documentation][domapic-service-options-url].

If you want to authenticate when requesting from another IPs, look for the api key automatically generated and intended to be used by Domapic Controller when the server is started. You'll find it in the server logs:

```
-----------------------------------------------------------------
Try adding connection from Controller, using the next service Api Key: HMl6GHWr7foowxM40CB6tQPuXt3zc7zE
-----------------------------------------------------------------
```

To make your own requests to the api, provide this token using the `X-Api-Key` header.

Use the mentioned api key also for authenticating when using the Swagger interface.

## Alternative command line methods

### Not global installation

If the package is not installed globally, you can replace the `dht-sensor` command in examples above by `npm run dht-sensor --` (commands must be executed inside the package folder in that case)

### Not background mode

If you don't want to use the built-in background runner, you can start the server directly, attaching logs to current `stdout`. Move to the package folder and replace the `dht-sensor` command of examples above by `node server.js`. Press `CTRL+C` to stop the server.

[coveralls-image]: https://coveralls.io/repos/github/javierbrea/dht-sensor-domapic-module/badge.svg?branch=master
[coveralls-url]: https://coveralls.io/github/javierbrea/dht-sensor-domapic-module
[travisci-image]: https://travis-ci.com/javierbrea/dht-sensor-domapic-module.svg?branch=master
[travisci-url]: https://travis-ci.com/javierbrea/dht-sensor-domapic-module
[last-commit-image]: https://img.shields.io/github/last-commit/javierbrea/dht-sensor-domapic-module.svg
[last-commit-url]: https://github.com/javierbrea/dht-sensor-domapic-module/commits
[license-image]: https://img.shields.io/npm/l/dht-sensor-domapic-module.svg
[license-url]: https://github.com/javierbrea/dht-sensor-domapic-module/blob/master/LICENSE
[npm-downloads-image]: https://img.shields.io/npm/dm/dht-sensor-domapic-module.svg
[npm-downloads-url]: https://www.npmjs.com/package/dht-sensor-domapic-module
[npm-dependencies-image]: https://img.shields.io/david/javierbrea/dht-sensor-domapic-module.svg
[npm-dependencies-url]: https://david-dm.org/javierbrea/dht-sensor-domapic-module
[quality-gate-image]: https://sonarcloud.io/api/project_badges/measure?project=dht-sensor-domapic-module&metric=alert_status
[quality-gate-url]: https://sonarcloud.io/dashboard?id=dht-sensor-domapic-module
[release-image]: https://img.shields.io/github/release-date/javierbrea/dht-sensor-domapic-module.svg
[release-url]: https://github.com/javierbrea/dht-sensor-domapic-module/releases
[standard-image]: https://img.shields.io/badge/code%20style-standard-brightgreen.svg
[standard-url]: http://standardjs.com/

[bcm-url]: http://www.airspayce.com/mikem/bcm2835/
[node-dht-sensor-url]: https://www.npmjs.com/package/node-dht-sensor
[domapic-controller-url]: https://www.npmjs.com/package/domapic-controller
[domapic-service-options-url]: https://github.com/domapic/domapic-service#options
[domapic-service-abilities-url]: https://github.com/domapic/domapic-service#abilities
[domapic-service-url]: https://github.com/domapic/domapic-service
[pm2-url]: http://pm2.keymetrics.io/

[dht-sensor-schema-image]: http://domapic.com/assets/dht-sensor/fritzing_schema.png


