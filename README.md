Predictable Farm — Offline Strategy Generator
---

### Introduction

This software act as an offline plugin for IBM nodered used in the predictable-farm automation service. When user create an automation recipe, the workflow receipe is sent over websocket to the connected devices.
Then this software read the recipe and execute the rules based on the sensor / actuator role, if the Internet connection is broken.
This way the automation logic remains on even when the Internet link is down.

Needs NodeJS 0.10.*

#### Build (using webpack)

    npm install
    npm run build

#### Run

For dev

    npm run dev

For prod

    npm start

### License

MIT. See License.txt file

**This work uses sofware that is licensed under various licenses (see https://github.com/Supervisor/supervisor/blob/master/LICENSES.txt). The respective files have kept their original license notices.**