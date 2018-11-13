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
