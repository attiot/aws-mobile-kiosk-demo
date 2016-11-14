import { Component } from '@angular/core';
import { Paho } from 'ng2-mqtt';
import { sign } from 'aws4';

@Component({
    selector: 'foundry',
    templateUrl: './app.component.html',
})
export class AppComponent {
    client: Paho.MQTT.Client;

    constructor() {
        const requestUrl = sign({
            service: 'iotdevicegateway',
            host: process.env.IOT_HOST,
            path: '/mqtt',
            signQuery: true,
        });
        this.client = new Paho.MQTT.Client(`wss://${process.env.IOT_HOST}${requestUrl.path}`, '' + Math.random());

        this.client.onMessageArrived = (message: Paho.MQTT.Message) => {
            console.log(message);
        };
        this.client.onConnectionLost = (response: Object) => console.log('Connection lost', response);

        this.client.connect({
            onSuccess: () => {
            },
            onFailure: () => {
            },
        });
    }
}
