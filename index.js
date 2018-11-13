/*
  Copyright (C) Air Liquide S.A,  2017-2018
  Author: Sébastien Lalaurette and Brivaël Le Pogam, La Factory, Creative Foundry
  This file is part of Predictable Farm project.

  The MIT License (MIT)

  Permission is hereby granted, free of charge, to any person obtaining a copy
  of this software and associated documentation files (the "Software"), to deal
  in the Software without restriction, including without limitation the rights
  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
  copies of the Software, and to permit persons to whom the Software is
  furnished to do so, subject to the following conditions:

  The above copyright notice and this permission notice shall be included in
  all copies or substantial portions of the Software.

  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
  THE SOFTWARE.
   
  See the LICENSE.txt file in this repository for more information.
*/

import Engine from './class/engine'
import Sensor from './class/sensor'
import ConfigHelper from './class/ConfigHelper'

const LOCAL_ENGINE_PORT = 6500

let sensorHelper = new Sensor()
let configHelper = new ConfigHelper()
let engine = new Engine(sensorHelper, configHelper)

configHelper.engine = engine

let io = {}

if (CONTEXT === 'linino' || CONTEXT === 'iot2000') {
  io = eval('require')('/usr/lib/node_modules/socket.io')(LOCAL_ENGINE_PORT)
} else {
  // io = require('socket.io')(LOCAL_ENGINE_PORT)
  io = eval('require')('/usr/lib/node_modules/socket.io')(LOCAL_ENGINE_PORT)
}
console.log('[' + (new Date()).toISOString() + '] ' + 'Local Engine started on port ' + LOCAL_ENGINE_PORT)

io.on('connection', function (socket) {
  engine.setSocket(socket)
  socket.emit('get-config')

  socket.on('set-config', function (data) {
    console.log('[' + (new Date()).toISOString() + '] ' + 'New config received')
    if (!data) {
      socket.emit('config-error', 'data object is null')
      return
    }

    configHelper.graph = data.graph

    if (typeof data.device_id === 'string') {
      configHelper.deviceid = data.device_id
    } else {
      configHelper.deviceid = data.device_id.toString()
    }

    var conf = configHelper.getConfig()

    socket.emit('config-ok', conf)

    configHelper.ready = true

    if (conf.type === 'server') {
      setTimeout(function () { computeDelay() }, 5000)
    }
  })

  socket.on('sensor-emit', function (data) {
    if (configHelper.ready) {
      sensorHelper.updateData(data)
    }
  })
})

function computeDelay () {
  engine.compute()
  setTimeout(function () { computeDelay() }, 2000)
}
