import { Component, OnInit } from '@angular/core';
import { IonicModule, PopoverController } from '@ionic/angular';

import { UserDTO } from '../DTO/userDTO';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss'],
  standalone: true,
  imports: [IonicModule],
})
export class UserComponent implements OnInit {
  private static _user: UserDTO | null = null
  static get user(): UserDTO | null {
    return UserComponent._user;
  }
  static set user(value: UserDTO | null) {
    if (value)
      localStorage.setItem('user', JSON.stringify(value))
    else
      localStorage.removeItem('user')
    UserComponent._user = value
  }

  get user(): UserDTO | null {
    return UserComponent.user;
  }
  set user(value: UserDTO | null) {
    UserComponent.user = value
  }

  constructor(private popoverController: PopoverController) {
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
}


