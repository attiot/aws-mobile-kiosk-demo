import { Component } from '@angular/core';
import { LockerService } from './locker.service';

@Component({
    selector: 'locker',
    templateUrl: './locker.component.html',
})
export class LockerComponent {
    constructor(private lockerService: LockerService) { }
}
