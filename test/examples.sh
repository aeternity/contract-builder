#!/bin/bash
set -e

echo Build vue example
cd ./examples/vue
npm i
npm run build

echo Build and run node example
cd ../node
npm i
npm run build:contract
node src/main.js
