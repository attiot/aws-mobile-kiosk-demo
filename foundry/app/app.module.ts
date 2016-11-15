import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { InventoryComponent } from './inventory.component';
import { LockerComponent } from './locker.component';
import { MapToIterablePipe } from './map-to-iterable.pipe';

import { ProgressBarModule } from 'angular2-progressbar';

@NgModule({
    imports: [ BrowserModule, ProgressBarModule ],
    declarations: [ AppComponent, InventoryComponent, LockerComponent, MapToIterablePipe ],
    bootstrap: [ AppComponent ]
})
export class AppModule { }
