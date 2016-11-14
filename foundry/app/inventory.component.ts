import { Component, Input, OnInit } from '@angular/core';
import { LockerService } from './locker.service';

const devices = {
    starterKit: 'AT&T IOT\nstarter kit',
    fireStick: 'Amazon\nFireStick',
    echoDot: 'Amazon Echo\nDot',
};

@Component({
    selector: 'inventory',
    templateUrl: './inventory.component.html',
})
export class InventoryComponent implements OnInit {
    @Input() deviceKey: string;
    private deviceName: string;
    private deviceList: number = 0;

    constructor(private lockerService: LockerService) { }
    ngOnInit(): void {
        this.deviceName = devices[this.deviceKey];
        this.deviceList = this.lockerService.deviceList;
    }
}
