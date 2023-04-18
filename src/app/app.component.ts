import { IonicModule, ToastController } from '@ionic/angular';

import { Component } from '@angular/core';
import { User } from 'firebase/auth';
import { UserComponent } from './shared/user/user.component';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: true,
  imports: [IonicModule],
})
export class AppComponent {
  static appInstance: AppComponent;

  static presentOkToast(message: string) {
    AppComponent.appInstance.presentOkToast(message)
  }

  constructor(private toastController: ToastController) {
    AppComponent.appInstance = this;
    UserComponent.cacheLoadUser();
  }


  async presentOkToast(message: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 3000,
      color: 'success'
    });
    toast.present();
  }

}
