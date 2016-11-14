import { Injectable } from '@angular/core';
import { IotData } from 'aws-sdk';

@Injectable()
export class LockerService {
    client: IotData;
    deviceList: any = {
        starterKit: 0,
        fireStick: 0,
        echoDot: 0,
    };

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
                this.deviceList.starterKit = devices.data[0].p >= 50 ? 1 : 0;
                this.deviceList.fireStick = devices.data[2].p >= 50 ? 1 : 0;
                this.deviceList.echoDot = devices.data[3].p >= 50 ? 1 : 0;
            });
        }, 1000);
    }
}
