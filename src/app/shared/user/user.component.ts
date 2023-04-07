import { Component, OnInit } from '@angular/core';
import { IonicModule, PopoverController, ToastController } from '@ionic/angular';

import { UserDTO } from '../DTO/userDTO';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss'],
  standalone: true,
  imports: [IonicModule],
})
export class UserComponent implements OnInit {
  private static instance: UserComponent;

  private static _user: UserDTO | null = null
  static get user(): UserDTO | null {
    return UserComponent._user;
  }
  static set user(value: UserDTO | null) {
    UserComponent._user = value

    if (value) {
      localStorage.setItem('user', JSON.stringify(value))
      UserComponent.instance.presentOkToast("Welcome " + value.username)
    }
    else {
      localStorage.removeItem('user')
      UserComponent.instance.presentOkToast("Successfully logged out")
    }
  }
  get user(): UserDTO | null {
    return UserComponent.user;
  }
  set user(value: UserDTO | null) {
    UserComponent.user = value
  }


  constructor(private popoverController: PopoverController, private toastController: ToastController) {
    UserComponent.instance = this;
  }

  ngOnInit() { }

  logout() {
    this.popoverController.dismiss().then(() =>
      this.user = null
    );
  }

  static cacheLoadUser() {
    const json = localStorage.getItem('user');
    if (json)
      UserComponent._user = JSON.parse(json);
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


