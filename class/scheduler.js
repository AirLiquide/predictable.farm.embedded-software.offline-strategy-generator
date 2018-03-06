export default class Scheduler {
    constructor(data, sensorHelper, cycle) {
        this.data = data;
        this.sensorHelper = sensorHelper;
        this.cycle = cycle;

        this.initValues(data);
    }

    initValues(data) {
        this.current = new Date();
        this.currentTimestamp = Math.round(new Date().getTime() / 1000);
        this.currentHour = this.current.getHours();
        this.currentMinutes = this.current.getMinutes();
        this.startHour = parseInt(data.startHour);
        this.startMinute = parseInt(data.startMinute);
        this.endHour = parseInt(data.endHour);
        this.endMinute = parseInt(data.endMinute);
        this.onceMinute = parseInt(data.onceMinute);
        this.onceHour = parseInt(data.onceHour);
        this.interval = parseInt(data.interval);
        this.days = data.days;
        this.day = data.day;
        this.inRange = false;
    }

    getScheadulerNodeStatut() {
        if(this.data.sendFrequency === 'interval' && this.data.sendRange === 'time-range') {
            this.checkRange();
        } else if(this.data.sendFrequency === 'interval' && this.data.sendRange === 'all-day') {
            this.inRange = true;
        } else if(this.data.sendFrequency === 'once') {
            this.checkOnce();
        }

        if(this.data.sendDay === 'days') {
            if(!this.getScheadulerSendDays()) {
                this.inRange = false;
            }
        }

        if(this.data.sendDay === 'oneDay') {
            if(!this.getScheadulerSendOneDay()) {
                this.inRange = false;
            }
        }

        return this.checkInterval();
    }

    checkRange() {
        if(this.currentHour > this.startHour) {
            if(this.currentHour < this.endHour) {
                this.inRange = true;
            } else if(this.currentHour === this.endHour) {
                if(this.currentMinutes < this.endMinute) {
                    this.inRange = true;
                }
            }
        } else if (this.currentHour === this.startHour) {
            if (this.currentMinutes >= this.startMinute) {
                if(this.currentHour < this.endHour) {
                    this.inRange = true;
                } else if(this.currentHour === this.endHour) {
                    if(this.currentMinutes <= this.endMinute) {
                        this.inRange = true;
                    }
                }
            }
        }
    }

    getScheadulerSendDays() {
        return this.days[this.current.getDay() - 1];
    }


    getScheadulerSendOneDay() {
        return this.day === this.current.getDate();
    }


    checkOnce() {
        if(this.onceMinute === this.current.getMinutes() && this.onceHour === this.current.getHours()) {
            return this.inRange = true;
        }
    }

    checkInterval() {
        if(this.inRange) {
            if(this.data.intervalUnits === 'minutes' && this.data.sendFrequency !== 'once') {
                let minutesFromLastActivation = (this.currentTimestamp - this.sensorHelper.scheduler[this.data.id].timestamp) / 60;

                if(minutesFromLastActivation >= this.interval) {
                    return true;
                }
            } else if(this.data.intervalUnits === 'minutes' && this.data.sendFrequency === 'once') {
                let minutesFromLastActivation = (this.currentTimestamp - this.sensorHelper.scheduler[this.data.id].timestamp) / 60;

                if(minutesFromLastActivation >= 0.6) {
                    return true;
                }
            }
            else if (this.data.intervalUnits === 'hours') {
                let hoursFromLastActivation = (this.currentTimestamp - this.sensorHelper.scheduler[this.data.id].timestamp) / 3600;

                if(hoursFromLastActivation >= this.interval) {
                    return true;
                }
            }
        }

        return false;
    }
}