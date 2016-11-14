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
}
