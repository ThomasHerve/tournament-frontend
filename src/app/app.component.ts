import { AlertController, IonicModule, ToastController } from '@ionic/angular';
import { Component, OnInit } from '@angular/core';

import { UserComponent } from './shared/user/user.component';
import { UserDTO } from './shared/DTO/userDTO';
import { UserService } from './services/user.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: true,
  imports: [IonicModule],
})
export class AppComponent implements OnInit {
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

  constructor(private toastController: ToastController, private alertController: AlertController, private userService: UserService) {
    AppComponent.appInstance = this;
    UserComponent.cacheLoadUser();
  }

  ngOnInit() {
    console.log(UserComponent.user?.password)
    if (UserComponent.user)
      this.userService.loginUser(new UserDTO({ username: UserComponent.user.email, password: UserComponent.user.password })).subscribe(value => UserComponent.user = value);

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
