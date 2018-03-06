import {redtype} from "../enums/redtype";

export default class Sensor {
    constructor() {
        this.data = {};
        this.math_average = {};
        this.dli_last_update = Date.now();
        this.scheduler = {};
        this.maxBufferTimeHours = 0.1;
    }

    updateData(data) {
        data = JSON.parse(data);


        if(data.sensor_type === 'light_par') {
            this.storeDLI(data);
        }

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

    getSensorValueByIdAndTypeAverage(id, type, seconds) {
        let averageValues = [];
        let timestamp = Math.round(new Date().getTime() / 1000) - seconds;

        let last = 0;
        let first = 0;

        for(let i = this.data[id+type+'_ts'].length - 1; i > 0; i--) {
            if(i === this.data[id+type+'_ts'].length - 1) {
                last = this.data[id+type+'_ts'][i].timestamp;
            }

            if((timestamp - this.data[id+type+'_ts'][i].timestamp) < seconds) {
                averageValues.push(parseInt(this.data[id+type+'_ts'][i].data.sensor_value));
            } else {
                first = this.data[id+type+'_ts'][i + 1].timestamp;
                break;
            }
        }

        let storeDelay = 0;

        if(first !== 0) {
            storeDelay = last - first
        }

        return {storeDelay: storeDelay, value: this.getSumFromArrayAverage(averageValues)};
    }

    getSumFromArrayAverage(averageValues) {
        var sum = 0;

        for (var i = 0; i < averageValues.length; i++) {
            sum += parseInt( averageValues[i], 10 );
        }

       return Math.floor(sum / averageValues.length);
    }

    storeDLI(data) {
        var time = Date.now();
        var deltaT = time - this.dli_last_update;
        var mult = deltaT / 1000;

        var value = 0;

        if(this.data[data.sensor_id+"sensor_light_dli"] !== undefined) {
            value = this.data[data.sensor_id+"sensor_light_dli"].sensor_value;
        }

        this.data[data.sensor_id+"sensor_light_dli"] = { device_id: data.device_id,
                                                         sensor_type: 'light_dli',
                                                         sensor_id: data.sensor_id,
                                                         sensor_value: (value + (parseFloat(data.sensor_value) * mult) / 1000000) };

        this.dli_last_update = time;
    }
}