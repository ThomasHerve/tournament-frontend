import { AlertController, IonicModule, ToastController } from '@ionic/angular';

import { Component } from '@angular/core';
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
  static presentWarningToast(message: string) {
    AppComponent.appInstance.presentWarningToast(message)
  }

  static presentAlertPrompt(message: string): Promise<boolean> {
    return AppComponent.appInstance.presentAlertPrompt(message)
  }

  constructor(private toastController: ToastController, private alertController: AlertController) {
    AppComponent.appInstance = this;
    UserComponent.cacheLoadUser();
  }


  async presentAlertPrompt(message: string): Promise<boolean> {
    return new Promise<boolean>(async (resolve) => {
      const alert = await this.alertController.create({
        header: message,
        cssClass: 'custom-alert',
        buttons: [
          {
            text: 'No',
            role: 'cancel',
            cssClass: 'alert-button-cancel',
            handler: () => resolve(false),
          },
          {
            text: 'Yes',
            cssClass: 'alert-button-confirm',
            handler: () => resolve(true),
          },
        ],
      });

      await alert.present();
    })
  }

  async presentOkToast(message: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 3000,
      color: 'success'
    });
    toast.present();
  }

  async presentWarningToast(message: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 3000,
      color: 'warning'
    });
    toast.present();
  }
}
