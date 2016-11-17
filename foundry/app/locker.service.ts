import { Injectable } from '@angular/core';

import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { Paho } from 'ng2-mqtt';
import { sign } from 'aws4';

@Injectable()
export class LockerService {
    private deviceList: any = {
        starterKit: 1,
        fireStick: 1,
        echoDot: 1,
    };
    private lockerData = new BehaviorSubject<any>({
        deviceList: this.deviceList
    });
    private client: Paho.MQTT.Client;
    ledStatus: string = 'locked';
    batteryLife: number = 0;
    saveTimerHour: number = 0;
    saveTimerMin: number = 0;
    openStatus: string = 'closed';

    lockerData$ = this.lockerData.asObservable();

    init(): void {
        const requestUrl = sign({
            service: 'iotdevicegateway',
            host: process.env.IOT_HOST,
            path: '/mqtt',
            signQuery: true,
        });
        this.client = new Paho.MQTT.Client(`wss://${process.env.IOT_HOST}${requestUrl.path}`, '' + Math.random());
        this.client.onConnectionLost = (response: Object) => {
            console.error('Connection lost', response);
            alert('Lost connection to the IoT platform');
        };

        this.client.onMessageArrived = (message: Paho.MQTT.Message) => {
            let payload: any = JSON.parse(message.payloadString).state.desired;

            if (payload.hasOwnProperty('led')) {
                this.ledStatus = !!payload.led ? 'unlocked' : 'locked';
            }

            if (payload.T && payload.t) {
                this.saveTimerHour = payload.T / 60 / 60;
                this.saveTimerMin = +payload.t;
            }

            if (payload.hasOwnProperty('seq')) {
                this.batteryLife = Math.round(100 * (1500 - (payload.seq || 0)) / 1500);
            }

            if ('proximity' === payload.report) {
                if (0 === +payload.strip) {
                    this.deviceList.starterKit = payload.data.some((datum: any) => datum.p >= 30) ? 1 : 0;
                } else {
                    this.deviceList.echoDot = payload.data[0].p >= 30 ? 1 : 0;
                    this.deviceList.fireStick = payload.data[3].p >= 30 || payload.data[2].p >= 30 ? 1 : 0;
                }

                this.lockerData.next({
                    deviceList: Object.assign({}, this.deviceList)
                });
            } else if ('pins' === payload.report) {
                this.openStatus = payload.data[1].PTB11 ? 'closed' : 'open';
            }
        };

        this.client.connect({
            onSuccess: () => {
                this.client.subscribe('$aws/things/test-locker/shadow/update/accepted', {});
                this.client.subscribe('$aws/things/test-locker/shadow/get/accepted', {
                    onSuccess: () => {
                        // Get initial device data
                        this.client.send('$aws/things/test-locker/shadow/get', '', 0, false);
                    },
                });
            },
        });
    }

    toggleLock() {
        this.client.send('$aws/things/test-locker/shadow/update',
            JSON.stringify({state: {desired: {led: 'locked' === this.ledStatus ? 1 : 0}}}), 0, false);

        // Retrieve updates to the device shadow that we just sent
        this.client.send('$aws/things/test-locker/shadow/get', '', 0, false);
    }
}
