import { Component } from '@angular/core';
import { Paho } from 'ng2-mqtt';
import { sign } from 'aws4';

@Component({
    selector: 'foundry',
    templateUrl: './app.component.html',
})
export class AppComponent {
    constructor() {
        const requestUrl = sign({
            service: 'iotdevicegateway',
            host: process.env.IOT_HOST,
            path: '/mqtt',
            signQuery: true,
        });
        const paho = new Paho.MQTT.Client(`wss://${process.env.IOT_HOST}${requestUrl.path}`, '' + Math.random());
        paho.connect({
            onSuccess() {
                console.log('well done!');
            },
            onFailure() {
                console.log(arguments);
            },
        });
    }
}
