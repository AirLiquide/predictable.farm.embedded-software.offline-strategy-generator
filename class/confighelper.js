export default class ConfigHelper {
    constructor() {
        this.engine = {};
        this.deviceid = 0;
        this.graph = null;
    }

    getConfig() {
        var relays = this.engine.reader.getRelayNodes();
        var type = "client";

        if (relays.indexOf(this.deviceid) > -1) {
            type = "server";
        }

        return {
            type: type,
            relays: relays
        }
    }
}