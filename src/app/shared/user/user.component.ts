import { Component, OnInit } from '@angular/core';
import { IonicModule, PopoverController } from '@ionic/angular';

import { AppComponent } from 'src/app/app.component';
import { Router } from '@angular/router';
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
      AppComponent.presentOkToast("Welcome " + value.username)
    }
    else {
      localStorage.removeItem('user')
      AppComponent.presentOkToast("Successfully logged out")
    }
  }
  get user(): UserDTO | null {
    return UserComponent.user;
  }
  set user(value: UserDTO | null) {
    UserComponent.user = value
  }


  constructor(private router: Router, private popoverController: PopoverController) {
    UserComponent.instance = this;
  }

  ngOnInit() { }

  logout() {
    this.popoverController.dismiss().then(() => {
      this.user = null
      this.router.navigateByUrl('home')
    }
    );
  }

  static cacheLoadUser() {
    const json = localStorage.getItem('user');
    if (json)
      UserComponent._user = JSON.parse(json);
  }



}


