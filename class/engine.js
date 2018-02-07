import Reader from "./reader";
import { redtype } from '../enums/redtype';

export default class Engine {
    constructor(sensorHelper, configHelper) {
        this.reader = new Reader();
        this.sensorHelper = sensorHelper;
        this.configHelper = configHelper;
        this.socket = null;

        this.subcondition = [];
        this.queueEntryPoint = [];
    }

    compute() {
        for(let entrypoint of this.reader.getEntryPointNode()) {
            this.queueEntryPoint.push(entrypoint);
        }

        this.extractSubCondition(this.queueEntryPoint.shift().id);

        return "done";
    }

    setSocket(socket) {
        this.socket = socket;
    }

    extractSubCondition(entrypoint) {
        let finished = false;

        let parent = this.reader.getNodeFromId(entrypoint);
        let child = this.reader.getNodeFromId(parent.wires[0][0]);

        if(child.wires.length === 0) {
            finished = true;
        }

        switch (child.type) {
            case redtype.math_average:
                this.subcondition[child.id] = true;
                break;

            case redtype.math_inferior:
                if(this.sensorHelper.getSensorValueByIdAndType(this.configHelper.deviceid, parent.type) === null) {
                    this.subcondition[child.id] = false;
                    break;
                }

                if(this.sensorHelper.getSensorValueByIdAndType(this.configHelper.deviceid, parent.type) < child.value) {
                    this.subcondition[child.id] = true;
                } else {
                    this.subcondition[child.id] = false;
                }
                break;

            case redtype.math_inferior_equal:
                if(this.sensorHelper.getSensorValueByIdAndType(this.configHelper.deviceid, parent.type) === null) {
                    this.subcondition[child.id] = false;
                    break;
                }

                if(this.sensorHelper.getSensorValueByIdAndType(this.configHelper.deviceid, parent.type) <= child.value) {
                    this.subcondition[child.id] = true;
                } else {
                    this.subcondition[child.id] = false;
                }
                break;

            case redtype.math_equal:
                if(this.sensorHelper.getSensorValueByIdAndType(this.configHelper.deviceid, parent.type) === null) {
                    this.subcondition[child.id] = false;
                    break;
                }

                if(this.sensorHelper.getSensorValueByIdAndType(this.configHelper.deviceid, parent.type) === child.value) {
                    this.subcondition[child.id] = true;
                } else {
                    this.subcondition[child.id] = false;
                }
                break;

            case redtype.math_superior:
                if(this.sensorHelper.getSensorValueByIdAndType(this.configHelper.deviceid, parent.type) === null) {
                    this.subcondition[child.id] = false;
                    break;
                }

                if(this.sensorHelper.getSensorValueByIdAndType(this.configHelper.deviceid, parent.type) > child.value) {
                    this.subcondition[child.id] = true;
                } else {
                    this.subcondition[child.id] = false;
                }
                break;

            case redtype.math_superior_equal:
                if(this.sensorHelper.getSensorValueByIdAndType(this.configHelper.deviceid, parent.type) === null) {
                    this.subcondition[child.id] = false;
                    break;
                }

                if(this.sensorHelper.getSensorValueByIdAndType(this.configHelper.deviceid, parent.type) >= child.value) {
                    this.subcondition[child.id] = true;
                } else {
                    this.subcondition[child.id] = false;
                }
                break;

            case redtype.logic_and:
                let conditionLogicAndOk = true;

                for(let childLogic of this.reader.getConnectedNodeParentsFromId(child.id)) {
                    if(this.subcondition[childLogic.id] !== true) {
                        conditionLogicAndOk = false
                    }
                }

                if(conditionLogicAndOk) {
                    this.subcondition[child.id] = true;
                }
                break;

            case redtype.logic_or:
                let conditionLogicOrOk = false;

                for(let childLogic of this.reader.getConnectedNodeParentsFromId(child.id)) {
                    if(this.subcondition[childLogic.id] === true && !conditionLogicOrOk) {
                        conditionLogicOrOk = true
                    }
                }

                if(conditionLogicOrOk) {
                    this.subcondition[child.id] = true;
                }
                break;

            case redtype.global_actuator:
                let conditionGlobalActuatorOk = true;

                for(let childLogic of this.reader.getConnectedNodeParentsFromId(child.id)) {
                    if(this.subcondition[childLogic.id] !== true) {
                        conditionGlobalActuatorOk = false
                    }
                }

                if(conditionGlobalActuatorOk) {
                    this.subcondition[child.id] = true;

                    if(this.socket !== null) {
                        this.socket.emit("sensor-receive", {
                            sensor_type:child.name
                        });
                    }
                }
                break;
        }

        if(!finished) {
            this.extractSubCondition(child.id);
        } else {
            if(this.queueEntryPoint.length > 0) {
                this.extractSubCondition(this.queueEntryPoint.shift().id);
            } else {
                console.log(this.subcondition);
            }
        }
    }
}