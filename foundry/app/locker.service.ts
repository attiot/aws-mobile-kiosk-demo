import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { Injectable } from '@angular/core';
import { IotData } from 'aws-sdk';

@Injectable()
export class LockerService {
    private lockerData = new BehaviorSubject<any>({
        deviceList:  {
            starterKit: 0,
            fireStick: 0,
            echoDot: 0,
        },
    });
    private client: IotData;
    ledStatus: string = '';
    batteryLife: number = 0;
    saveTimerHour: number = 0;
    saveTimerMin: number = 0;

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

                const devices: any = JSON.parse(data.payload).state.desired;

                this.ledStatus = !!devices.led ? 'locked' : 'unlocked';
                this.batteryLife = Math.round(100 * (1500 - devices.seq) / 1500);
                this.saveTimerHour = devices.T / 60 / 60;
                this.saveTimerMin = +devices.t;
                this.lockerData.next({
                    deviceList: {
                        starterKit: devices.data[0].p >= 50 ? 1 : 0,
                        fireStick: devices.data[2].p >= 50 ? 1 : 0,
                        echoDot: devices.data[3].p >= 50 ? 1 : 0,
                    }
                });
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
