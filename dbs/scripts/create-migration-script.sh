#!/usr/bin/env bash

npm run typeorm -- migration:create src/migration/$1
