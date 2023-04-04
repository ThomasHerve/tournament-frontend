import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { RouteReuseStrategy, provideRouter } from '@angular/router';
import { SocketIoConfig, SocketIoModule } from 'ngx-socket-io';
import { enableProdMode, importProvidersFrom } from '@angular/core';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

import { AppComponent } from './app/app.component';
import { HttpClientModule } from '@angular/common/http';
import { bootstrapApplication } from '@angular/platform-browser';
import { environment } from './environments/environment';
import { firebaseConfig } from './app.config';
import { getAnalytics } from 'firebase/analytics';
import { initializeApp } from 'firebase/app';
import { routes } from './app/app.routes';

if (environment.production) {
  enableProdMode();
}

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);
const analytics = getAnalytics(firebaseApp);
const auth = getAuth(firebaseApp);
const config: SocketIoConfig = { url: 'http://90.66.62.181:3000', options: {} };

onAuthStateChanged(auth, (user) => {
  AppComponent.appUser = user;
});

bootstrapApplication(AppComponent, {
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    importProvidersFrom(IonicModule.forRoot({})),
    importProvidersFrom(SocketIoModule.forRoot(config)),
    importProvidersFrom(HttpClientModule),
    provideRouter(routes),
  ],
});
