export default class Sensor {
    constructor() {
        this.data = {};
        this.maxBufferTimeHours = 0.1;
    }

    updateData(data) {
        data = JSON.parse(data);
        this.data[data.sensor_id+"sensor_"+data.sensor_type] = data;


        let dataWithTs = {
            timestamp: Math.round(new Date().getTime() / 1000),
            data: data
        };

        if(this.data[data.sensor_id+"sensor_"+data.sensor_type+'_ts'] === undefined) {
            this.data[data.sensor_id+"sensor_"+data.sensor_type+'_ts'] = [];
            this.data[data.sensor_id+"sensor_"+data.sensor_type+'_ts'].push(dataWithTs);
        } else {
            this.data[data.sensor_id+"sensor_"+data.sensor_type+'_ts'].push(dataWithTs);
        }

        this.cleanBuffer();
    }

    cleanBuffer() {
        var timestamp = Math.round(new Date().getTime() / 1000);
        var timestampShift = timestamp - (this.maxBufferTimeHours * 3600);

        let keys = Object.keys(this.data);

        for(let i = 0; i < keys.length; i++) {
            if(keys[i].indexOf('_ts') !== -1) {
                for(let j = 0; j < this.data[keys[i]].length; j++) {
                    if(this.data[keys[i]][j].timestamp < timestampShift) {
                        this.data[keys[i]].shift();
                    } else {
                        break;
                    }
                }
            }
        }
    }

    getSensorValueByIdAndType(id, type) {
        if(this.data[id+type] !== undefined) {
            if(this.data[id+type].sensor_value !== undefined) {
                return this.data[id+type].sensor_value;
            } else {
                return null;
            }
        } else {
            return null;
        }
    }
}