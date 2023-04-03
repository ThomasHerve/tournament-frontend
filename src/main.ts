import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { RouteReuseStrategy, provideRouter } from '@angular/router';
import { enableProdMode, importProvidersFrom } from '@angular/core';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

import { AppComponent } from './app/app.component';
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

onAuthStateChanged(auth, (user) => {
  AppComponent.appUser = user;
});

bootstrapApplication(AppComponent, {
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    importProvidersFrom(IonicModule.forRoot({})),
    provideRouter(routes),
  ],
});
