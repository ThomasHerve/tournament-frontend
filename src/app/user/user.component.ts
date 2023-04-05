import { Component, OnInit } from '@angular/core';
import { IonicModule, PopoverController } from '@ionic/angular';

import { NgIf } from '@angular/common';
import { UserDTO } from '../home/DTO/userDTO';
import { UserPopoverComponent } from './user-popover/user-popover.component';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss'],
  standalone: true,
  imports: [IonicModule, NgIf],
})
export class UserComponent implements OnInit {

  public static user: UserDTO | null = null
  get user(): UserDTO | null {
    return UserComponent.user;
  }

  roleMsg = '';

  constructor(public popoverController: PopoverController) { }
  ngOnInit() { }

  async presentPopover(e: Event) {
    let popover: HTMLIonPopoverElement;
    if (this.user) {
      popover = await this.popoverController.create({
        component: UserPopoverComponent,
        event: e,
      });
    } else {
      popover = await this.popoverController.create({
        component: NoUserPopoverComponent,
        event: e,
      });
    }

    await popover.present();

    const { role } = await popover.onDidDismiss();
    this.roleMsg = `Popover dismissed with role: ${role}`;
  }

}

@Component({
  template: `<ion-content class="ion-padding">Go to homepage to log in</ion-content>`,
  standalone: true,
  imports: [IonicModule],
})
export class NoUserPopoverComponent implements OnInit {

  constructor() { }

  ngOnInit() { }

}
