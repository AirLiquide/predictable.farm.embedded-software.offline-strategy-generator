var sensor1 = 15;
var sensor2 = 22;

var subConditions = [false, false, false];

if(sensor1 > 10) {
    subConditions[0] = true;
}

if(sensor2 > 20) {
    subConditions[1] = true;
}

if(subConditions[0] && subConditions[1]) {
    subConditions[2] = true;
}

if (subConditions.indexOf(false) === -1) {
    console.log(subConditions);
    console.log("relayActivation")
}