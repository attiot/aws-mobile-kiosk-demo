import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { InventoryComponent } from './inventory.component';

@NgModule({
    imports: [ BrowserModule ],
    declarations: [ AppComponent, InventoryComponent ],
    bootstrap: [ AppComponent ]
})
export class AppModule { }
