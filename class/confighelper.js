import config from '../config.json';

export default class ConfigHelper {
    constructor() {
        this.engine = {};
        this.deviceid = 0;
        this.graph = null;
    }

    getConfig() {
        return {
            type:config.type,
            relays:this.engine.reader.getRelayNodes()
        }
    }
}