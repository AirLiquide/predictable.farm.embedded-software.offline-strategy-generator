import Reader from './reader'
import { redtype } from '../enums/redtype'
import Scheduler from './scheduler'

export default class Engine {
  constructor (sensorHelper, configHelper) {
    this.reader = new Reader(configHelper)
    this.sensorHelper = sensorHelper
    this.configHelper = configHelper
    this.socket = null
    this.idCycle = ''

    this.subcondition = []
    this.queueEntryPoint = []
  }

  compute () {
    this.idCycle = this.getIdCycle()

    if (this.configHelper.graph !== null) {
      for (let i = 0; i < this.reader.getEntryPointNode().length; i++) {
        this.queueEntryPoint.push(this.reader.getEntryPointNode()[i])
      }

      this.extractSubCondition(this.queueEntryPoint.shift().id)
    }
  }

  getIdCycle () {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8)
      return v.toString(16)
    })
  }

  setSocket (socket) {
    this.socket = socket
  }

  setScheadulerNodeStatut (node) {
    if (this.sensorHelper.scheduler[node.id] === undefined) {
      this.sensorHelper.scheduler[node.id] = {cycle: this.idCycle, timestamp: Math.round(new Date().getTime() / 1000)}
    }

    if (this.sensorHelper.scheduler[node.id].cycle !== this.idCycle) {
      this.subcondition[node.id] = false
    }

    if (new Scheduler(node, this.sensorHelper, this.idCycle).getScheadulerNodeStatut()) {
      this.sensorHelper.scheduler[node.id] = {cycle: this.idCycle, timestamp: Math.round(new Date().getTime() / 1000)}
      this.subcondition[node.id] = true
    }
  }

  extractSubCondition (entrypoint) {
    let finished = false

    let parent = this.reader.getNodeFromId(entrypoint)
    let child = this.reader.getNodeFromId(parent.wires[0][0])

    if (child.wires.length === 0) {
      finished = true
    }

    switch (child.type) {
      case redtype.math_average:
        let amount = child.amount
        if (child.delayType === 'minutes') {
          amount = amount * 60
        }

        if (child.delayType === 'hours') {
          amount = amount * 3600
        }

        this.subcondition[child.id] = false

        if (this.sensorHelper.math_average[child.id] === undefined) {
          this.sensorHelper.math_average[child.id] = {
            timestamp: Math.round(new Date().getTime() / 1000),
            amount: amount
          }
        } else {
          if ((Math.round(new Date().getTime() / 1000) - this.sensorHelper.math_average[child.id].timestamp) >= amount) {
            this.sensorHelper.math_average[child.id].timestamp = Math.round(new Date().getTime() / 1000)
            this.subcondition[child.id] = true
          }
        }
        break

      case redtype.math_inferior:
        if (this.sensorHelper.getSensorValueByIdAndType(this.configHelper.deviceid, parent.type) === null) {
          this.subcondition[child.id] = false
          break
        }

        if (this.sensorHelper.getSensorValueByIdAndType(this.configHelper.deviceid, parent.type) < child.value) {
          this.subcondition[child.id] = true
        } else {
          this.subcondition[child.id] = false
        }
        break

      case redtype.math_inferior_equal:
        if (this.sensorHelper.getSensorValueByIdAndType(this.configHelper.deviceid, parent.type) === null) {
          this.subcondition[child.id] = false
          break
        }

        if (this.sensorHelper.getSensorValueByIdAndType(this.configHelper.deviceid, parent.type) <= child.value) {
          this.subcondition[child.id] = true
        } else {
          this.subcondition[child.id] = false
        }
        break

      case redtype.math_equal:
        if (this.sensorHelper.getSensorValueByIdAndType(this.configHelper.deviceid, parent.type) === null) {
          this.subcondition[child.id] = false
          break
        }

        if (this.sensorHelper.getSensorValueByIdAndType(this.configHelper.deviceid, parent.type) === child.value) {
          this.subcondition[child.id] = true
        } else {
          this.subcondition[child.id] = false
        }
        break

      case redtype.math_superior:
        if (this.sensorHelper.getSensorValueByIdAndType(this.configHelper.deviceid, parent.type) === null) {
          this.subcondition[child.id] = false
          break
        }

        if (this.sensorHelper.getSensorValueByIdAndType(this.configHelper.deviceid, parent.type) > child.value) {
          this.subcondition[child.id] = true
        } else {
          this.subcondition[child.id] = false
        }
        break

      case redtype.math_superior_equal:
        if (this.sensorHelper.getSensorValueByIdAndType(this.configHelper.deviceid, parent.type) === null) {
          this.subcondition[child.id] = false
          break
        }

        if (this.sensorHelper.getSensorValueByIdAndType(this.configHelper.deviceid, parent.type) >= child.value) {
          this.subcondition[child.id] = true
        } else {
          this.subcondition[child.id] = false
        }
        break

      case redtype.logic_and:
        let conditionLogicAndOk = true

        for (let i = 0; i < this.reader.getConnectedNodeParentsFromId(child.id).length; i++) {
          let nodeS = this.reader.getNodeFromId(this.reader.getConnectedNodeParentsFromId(child.id)[i].id)

          if (nodeS.type === redtype.scheduler) {
            this.setScheadulerNodeStatut(nodeS)
          }

          if (this.subcondition[this.reader.getConnectedNodeParentsFromId(child.id)[i].id] !== true) {
            conditionLogicAndOk = false
          }
        }

        if (conditionLogicAndOk) {
          this.subcondition[child.id] = true
        } else {
          this.subcondition[child.id] = false
        }
        break

      case redtype.logic_or:
        let conditionLogicOrOk = false

        for (let i = 0; i < this.reader.getConnectedNodeParentsFromId(child.id).length; i++) {
          if (this.subcondition[this.reader.getConnectedNodeParentsFromId(child.id)[i].id] === true && !conditionLogicOrOk) {
            conditionLogicOrOk = true
          }
        }

        if (conditionLogicOrOk) {
          this.subcondition[child.id] = true
        } else {
          this.subcondition[child.id] = false
        }
        break

      case redtype.global_actuator:
        let conditionGlobalActuatorOk = true

        for (let i = 0; i < this.reader.getConnectedNodeParentsFromId(child.id).length; i++) {
          if (this.subcondition[this.reader.getConnectedNodeParentsFromId(child.id)[i].id] !== true) {
            conditionGlobalActuatorOk = false
          }
        }

        if (conditionGlobalActuatorOk) {
          this.subcondition[child.id] = true

          if (this.socket !== null) {
            this.socket.emit('sensor-receive', {
              sensor_type: 'relay' + child.relaynumber,
              device_id: child.deviceid,
              sensor_mode: 1
            })
          }
        } else {
          this.subcondition[child.id] = false

          if (this.socket !== null) {
            this.socket.emit('sensor-receive', {
              sensor_type: 'relay' + child.relaynumber,
              device_id: child.deviceid,
              sensor_mode: 0
            })
          }
        }
        break
    }

    if (!finished) {
      this.extractSubCondition(child.id)
    } else {
      if (this.queueEntryPoint.length > 0) {
        this.extractSubCondition(this.queueEntryPoint.shift().id)
      } else {
        // console.log(this.subcondition)
      }
    }
  }
}
