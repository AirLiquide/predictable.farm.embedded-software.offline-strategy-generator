export default class Sensor {
    constructor() {
        this.data = {};
    }

    updateData(data) {
        data = JSON.parse(data);
        this.data[data.sensor_id+data.sensor_type] = data;
    }

    getSensorByIdAndType(id, type) {
        // console.log(this.data);
        // console.log(id+type);
        console.log(this.data[id+type]);
        return this.data[id+type];
    }
}