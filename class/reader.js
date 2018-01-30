import sample from "../samples/sample1";
//import sample from "../samples/sample2";

export default class Reader {
    constructor() {
    }

    compute() {

    }

    getEntryPointNode() {
        let entryPointNode = [];

        for(let i = 0; i < sample.length; i++) {
            let wires = [];

            for(let j = 0; j < sample.length; j++) {
                if(i !== j) {
                    for(let subwires of sample[j].wires) {
                        for(let wire of subwires) {
                            if(wire === sample[i].id) {
                                wires += wire;
                            }
                        }
                    }
                }
            }

            if(wires.length === 0) {
                entryPointNode.push(sample[i])
            }
        }

        return entryPointNode;
    }

    getNodeFromId(id) {
        for(let i = 0; i < sample.length; i++) {
            if(sample[i].id === id) {
                return sample[i];
            }
        }
    }

    getConnectedNodeParentsFromId(id) {
        let nodes = [];

        for(let i = 0; i < sample.length; i++) {
            for(let subwires of sample[i].wires) {
                for(let wire of subwires) {
                    if(wire === id) {
                        nodes.push(sample[i])
                    }
                }
            }
        }

        return nodes;
    }
}