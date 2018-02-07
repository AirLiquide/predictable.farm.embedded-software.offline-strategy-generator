import Reader from "./reader";

import { redtype } from '../enums/redtype';
import config from '../config.json';

export default class ConfigHelper {
    constructor() {
        this.engine = {};
        this.deviceid = 0;
        this.graph = {};
    }

    getConfig() {
        return {
            relays:this.engine.reader.getRelayNodes()
        }
    }
}