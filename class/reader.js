//import sample1 from "../this.configHelper.graphs/this.configHelper.graph1";
//import sample2 from "../this.configHelper.graphs/this.configHelper.graph2";
//import sample3 from "../this.configHelper.graphs/this.configHelper.graph3";

export default class Reader {
    constructor(configHelper) {
        this.configHelper = configHelper;
    }

    getEntryPointNode() {
        let entryPointNode = [];

        for(let i = 0; i < this.configHelper.graph.length; i++) {
            let wires = [];

            for(let j = 0; j < this.configHelper.graph.length; j++) {
                if(i !== j) {
                    for(let subwires of this.configHelper.graph[j].wires) {
                        for(let wire of subwires) {
                            if(wire === this.configHelper.graph[i].id) {
                                wires += wire;
                            }
                        }
                    }
                }
            }

            if(wires.length === 0) {
                entryPointNode.push(this.configHelper.graph[i])
            }
        }

        return entryPointNode;
    }

    getRelayNodes() {
        let nodeRelay = [];

        for(let i = 0; i < this.configHelper.graph.length; i++) {
            if(this.configHelper.graph[i].type === "global_actuator") {
                nodeRelay.push({deviceid:this.configHelper.graph[i].deviceid, relaynumber:this.configHelper.graph[i].relaynumber});
            }
        }

        return nodeRelay;
    }

    getNodeFromId(id) {
        for(let i = 0; i < this.configHelper.graph.length; i++) {
            if(this.configHelper.graph[i].id === id) {
                return this.configHelper.graph[i];
            }
        }
    }

    getConnectedNodeParentsFromId(id) {
        let nodes = [];

        for(let i = 0; i < this.configHelper.graph.length; i++) {
            for(let subwires of this.configHelper.graph[i].wires) {
                for(let wire of subwires) {
                    if(wire === id) {
                        nodes.push(this.configHelper.graph[i])
                    }
                }
            }
        }

        return nodes;
    }
}