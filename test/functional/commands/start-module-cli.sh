#!/usr/bin/env bash

npm run dht-sensor start -- --path=${domapic_path} ${service_extra_options}
npm run dht-sensor logs
