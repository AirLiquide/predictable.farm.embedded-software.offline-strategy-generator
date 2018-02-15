export default class ConfigHelper {
    constructor() {
        this.engine = {};
        this.deviceid = 0;
        this.graph = null;
    }

    getConfig() {
        var relays = this.engine.reader.getRelayNodes();
        var type = "client";

        // Compute node type
        for (var i in relays) {
            if (relays[i].deviceid === this.deviceid) {
                type = "server";
                break;
            }
        }

        return {
            type: type,
            relays: relays
        }
    }
}