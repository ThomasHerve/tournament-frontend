import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { RouteReuseStrategy, provideRouter } from '@angular/router';
import { SocketIoConfig, SocketIoModule } from 'ngx-socket-io';
import { enableProdMode, importProvidersFrom } from '@angular/core';

import { AppComponent } from './app/app.component';
import { HttpClientModule } from '@angular/common/http';
import { bootstrapApplication } from '@angular/platform-browser';
import { environment } from './environments/environment';
import { routes } from './app/app.routes';

if (environment.production) {
  enableProdMode();
}

const config: SocketIoConfig = { url: 'https://multiplayertournamentonline.fr:3000', options: {} };


bootstrapApplication(AppComponent, {
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    importProvidersFrom(IonicModule.forRoot({})),
    importProvidersFrom(SocketIoModule.forRoot(config)),
    importProvidersFrom(HttpClientModule),
    provideRouter(routes),
  ],
});
