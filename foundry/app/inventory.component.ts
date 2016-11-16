import { Component, Input, OnInit, ViewChild, OnChanges } from '@angular/core';
import { LockerService } from './locker.service';
import { ShapeOptions, CircleProgressComponent } from 'angular2-progressbar';

const devices = {
    starterKit: 'AT&T IOT\nstarter kit',
    fireStick: 'Amazon\nFireStick',
    echoDot: 'Amazon Echo\nDot',
};

@Component({
    selector: 'inventory',
    templateUrl: './inventory.component.html',
})
export class InventoryComponent implements OnInit, OnChanges {
    @ViewChild(CircleProgressComponent) circleComp: CircleProgressComponent;
    @Input() deviceKey: string;
    private deviceName: string;
    private deviceList: Object;
    private circleOptions: ShapeOptions = {
        color: '#ffffff',
        trailColor: 'rgba(0,0,0,.2)',
        trailWidth: 8,
        duration: 400,
        text: {
            autoStyleContainer: false,
        },
        easing: 'linear',
        strokeWidth: 6,
        from: { color: '#FB0101', a: 0 },
        to: { color: '#02C102', a: 1 },
        // Set default step function for all animate calls
        step: function(state: any, circle: any) {
            circle.path.setAttribute('stroke', state.color);
            circle.setText(Math.round(circle.value()));
        }
    };

    constructor(private lockerService: LockerService) { }
    ngOnInit(): void {
        this.deviceName = devices[this.deviceKey];
    }

    ngOnChanges(changes: any) { }

    ngAfterViewInit() {
        this.lockerService.lockerData$.subscribe(data => {
            this.deviceList = data.deviceList;
            this.circleComp.animate(this.deviceList[this.deviceKey]);
        });
    }
}
