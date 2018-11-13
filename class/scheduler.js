/*
  Copyright (C) Air Liquide S.A,  2017-2018
  Author: Sébastien Lalaurette and Brivaël Le Pogam, La Factory, Creative Foundry
  This file is part of Predictable Farm project.

  The MIT License (MIT)

  Permission is hereby granted, free of charge, to any person obtaining a copy
  of this software and associated documentation files (the "Software"), to deal
  in the Software without restriction, including without limitation the rights
  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
  copies of the Software, and to permit persons to whom the Software is
  furnished to do so, subject to the following conditions:

  The above copyright notice and this permission notice shall be included in
  all copies or substantial portions of the Software.

  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
  THE SOFTWARE.
   
  See the LICENSE.txt file in this repository for more information.
*/

export default class Scheduler {
  constructor (data, sensorHelper, cycle) {
    this.data = data
    this.sensorHelper = sensorHelper
    this.cycle = cycle

    this.initValues(data)
  }

  initValues (data) {
    this.current = new Date()
    this.currentTimestamp = Math.round(new Date().getTime() / 1000)
    this.currentHour = this.current.getHours()
    this.currentMinutes = this.current.getMinutes()
    this.startHour = parseInt(data.startHour)
    this.startMinute = parseInt(data.startMinute)
    this.endHour = parseInt(data.endHour)
    this.endMinute = parseInt(data.endMinute)
    this.onceMinute = parseInt(data.onceMinute)
    this.onceHour = parseInt(data.onceHour)
    this.interval = parseInt(data.interval)
    this.days = data.days
    this.day = data.day
    this.inRange = false
  }

  getScheadulerNodeStatut () {
    if (this.data.sendFrequency === 'interval' && this.data.sendRange === 'time-range') {
      this.checkRange()
    } else if (this.data.sendFrequency === 'interval' && this.data.sendRange === 'all-day') {
      this.inRange = true
    } else if (this.data.sendFrequency === 'once') {
      this.checkOnce()
    }

    if (this.data.sendDay === 'days') {
      if (!this.getScheadulerSendDays()) {
        this.inRange = false
      }
    }

    if (this.data.sendDay === 'oneDay') {
      if (!this.getScheadulerSendOneDay()) {
        this.inRange = false
      }
    }

    return this.checkInterval()
  }

  checkRange () {
    if (this.currentHour > this.startHour) {
      if (this.currentHour < this.endHour) {
        this.inRange = true
      } else if (this.currentHour === this.endHour) {
        if (this.currentMinutes < this.endMinute) {
          this.inRange = true
        }
      }
    } else if (this.currentHour === this.startHour) {
      if (this.currentMinutes >= this.startMinute) {
        if (this.currentHour < this.endHour) {
          this.inRange = true
        } else if (this.currentHour === this.endHour) {
          if (this.currentMinutes <= this.endMinute) {
            this.inRange = true
          }
        }
      }
    }
  }

  getScheadulerSendDays () {
    return this.days[this.current.getDay() - 1]
  }

  getScheadulerSendOneDay () {
    return this.day === this.current.getDate()
  }

  checkOnce () {
    if (this.onceMinute === this.current.getMinutes() && this.onceHour === this.current.getHours()) {
      return this.inRange = true
    }
  }

  checkInterval () {
    if (this.inRange) {
      if (this.data.intervalUnits === 'minutes' && this.data.sendFrequency !== 'once') {
        let minutesFromLastActivation = (this.currentTimestamp - this.sensorHelper.scheduler[this.data.id].timestamp) / 60

        if (minutesFromLastActivation >= this.interval) {
          return true
        }
      } else if (this.data.intervalUnits === 'minutes' && this.data.sendFrequency === 'once') {
        let minutesFromLastActivation = (this.currentTimestamp - this.sensorHelper.scheduler[this.data.id].timestamp) / 60

        if (minutesFromLastActivation >= 0.6) {
          return true
        }
      } else if (this.data.intervalUnits === 'hours') {
        let hoursFromLastActivation = (this.currentTimestamp - this.sensorHelper.scheduler[this.data.id].timestamp) / 3600

        if (hoursFromLastActivation >= this.interval) {
          return true
        }
      }
    }

    return false
  }
}
