export default class ConfigHelper {
    constructor() {
        this.engine = {};
        this.deviceid = '0';
        this.graph = null;
        this.ready = false;
    }

    getConfig() {
        var relays = this.engine.reader.getRelayNodes();
        var type = "client";

        for (var i = 0; i < relays.length; i++) {
            if(relays[i].deviceid !== undefined) {
                if (relays[i].deviceid === this.deviceid) {
                    type = "server";
                    break;
                }
            }
        }

        return {
            type: type,
            relays: relays
        }
    }
}