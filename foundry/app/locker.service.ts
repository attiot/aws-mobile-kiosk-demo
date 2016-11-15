import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { Injectable } from '@angular/core';
import { IotData } from 'aws-sdk';

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
    private client: IotData;
    ledStatus: string = 'locked';
    batteryLife: number = 0;
    saveTimerHour: number = 0;
    saveTimerMin: number = 0;
    openStatus: string = 'closed';

    lockerData$ = this.lockerData.asObservable();

    init(): void {
        this.client = new IotData(<IotData.Types.ClientConfiguration>{
            endpoint: process.env.IOT_HOST,
            region: process.env.AWS_REGION,
            accessKeyId: process.env.AWS_ACCESS_KEY_ID,
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
            protocol: 'wss',
        });

        setInterval(() => {
            this.client.getThingShadow({thingName: 'test-locker'}, (err: any, data: any) => {
                if (err) {
                    console.error(err);
                    return alert('Error establishing connection to IoT platform');
                }

                const payload: any = JSON.parse(data.payload).state.desired;

                if ('proximity' === payload.report) {
                    this.ledStatus = !!payload.led ? 'locked' : 'unlocked';
                    this.batteryLife = Math.round(100 * (1500 - payload.seq) / 1500);
                    this.saveTimerHour = payload.T / 60 / 60;
                    this.saveTimerMin = +payload.t;
                    if (0 === +payload.strip) {
                        this.deviceList.starterKit = payload.data[1].p >= 30 ? 1 : 0;
                    } else {
                        this.deviceList.echoDot = payload.data[0].p >= 30 ? 1 : 0;
                        this.deviceList.fireStick = payload.data[3].p >= 30 ? 1 : 0;
                    }

                    this.lockerData.next({
                        deviceList: Object.assign({}, this.deviceList)
                    });
                } else if ('pins' === payload.report) {
                    this.openStatus = payload.data[1].PTB11 ? 'closed' : 'open';
                }
            });
        }, 1000);
    }

    toggleLock() {
        this.client.updateThingShadow({
            thingName: 'test-locker',
            // If locked, set LED status to 0 (unlock it)
            payload: JSON.stringify({state: {desired: {led: 'locked' === this.ledStatus ? 0 : 1}}}),
        }, (err: any, data: any) => {
            if (err) {
                console.error(err);
                return alert('Error updating thing shadow');
            }
        });
    }
}
