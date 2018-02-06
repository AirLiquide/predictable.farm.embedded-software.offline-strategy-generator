export default class Sensor {
    constructor() {
        this.data = {};
    }

    updateData(data) {
        data = JSON.parse(data);
        this.data[data.sensor_id+"sensor_"+data.sensor_type] = data;
    }

    getSensorValueByIdAndType(id, type) {


        console.log(this.data);
        // console.log(id+type);
        // console.log(this.data[id+type]);

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