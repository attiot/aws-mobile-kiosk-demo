import { Component, OnInit } from '@angular/core';
import { LockerService } from './locker.service';

@Component({
    selector: 'foundry',
    templateUrl: './app.component.html',
    providers: [LockerService]
})
export class AppComponent implements OnInit {
    constructor(private lockerService: LockerService) { }

    ngOnInit(): void {
        this.lockerService.init();
    }

    calculateBatteryBg(batteryLife: number) {
        if (batteryLife < 20) {
            return '#FB0101';
        }
        if (batteryLife < 50) {
            return '#FF7601';
        }

        return '#02C102';
    }
}
