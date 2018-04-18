export default class Reader {
  constructor (configHelper) {
    this.configHelper = configHelper
  }

  getEntryPointNode () {
    let entryPointNode = []

    for (let i = 0; i < this.configHelper.graph.length; i++) {
      let wires = []

      for (let j = 0; j < this.configHelper.graph.length; j++) {
        if (i !== j) {
          for (let k = 0; k < this.configHelper.graph[j].wires.length; k++) {
            for (let l = 0; l < this.configHelper.graph[j].wires[k].length; l++) {
              if (this.configHelper.graph[j].wires[k][l] === this.configHelper.graph[i].id) {
                wires += this.configHelper.graph[j].wires[k][l]
              }
            }
          }
        }
      }
      if (wires.length === 0) {
        entryPointNode.push(this.configHelper.graph[i])
      }
    }

    return entryPointNode
  }

  getRelayNodes () {
    let nodeRelayIds = []
    let nodeRelay = []

    if (this.configHelper.graph !== null) {
      for (let i = 0; i < this.configHelper.graph.length; i++) {
        if (this.configHelper.graph[i].type === 'global_actuator') {
          if (nodeRelayIds.indexOf(this.configHelper.graph[i].deviceid) === -1) {
            nodeRelay.push({deviceid: this.configHelper.graph[i].deviceid, relaynumber: this.configHelper.graph[i].relaynumber})
            nodeRelayIds.push(this.configHelper.graph[i].deviceid)
          }
        }
      }
    }

    return nodeRelay
  }

  getNodeFromId (id) {
    for (let i = 0; i < this.configHelper.graph.length; i++) {
      if (this.configHelper.graph[i].id === id) {
        return this.configHelper.graph[i]
      }
    }
  }

  getConnectedNodeParentsFromId (id) {
    let nodes = []

    for (let i = 0; i < this.configHelper.graph.length; i++) {
      for (let j = 0; j < this.configHelper.graph[i].wires.length; j++) {
        for (let k = 0; k < this.configHelper.graph[i].wires[j].length; k++) {
          if (this.configHelper.graph[i].wires[j][k] === id) {
            nodes.push(this.configHelper.graph[i])
          }
        }
      }
    }

    return nodes
  }
}
