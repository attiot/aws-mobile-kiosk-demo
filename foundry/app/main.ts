import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { enableProdMode } from '@angular/core';

import { AppModule } from './app.module';
import './styles.css';

if (process.env.ENABLE_PROD_MODE) {
    enableProdMode();
}

const platform = platformBrowserDynamic();
platform.bootstrapModule(AppModule);
