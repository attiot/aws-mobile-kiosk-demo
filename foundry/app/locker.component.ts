import { Component } from '@angular/core';
import { LockerService } from './locker.service';

@Component({
    selector: 'locker',
    templateUrl: './locker.component.html',
})
export class LockerComponent {
    constructor(private lockerService: LockerService) {
        this.lockerService.lockerData$.subscribe(data => {
            /* update locker here */
        });
    }

    calculateStyle(device: string) {
        switch (device) {
            case 'starerKit': {
                return {
                    top: '25px',
                    left: '15px',
                };
            }
        }
    }
}
