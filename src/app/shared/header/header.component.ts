import { Component, Input, OnInit } from '@angular/core';
import { IonicModule, PopoverController } from '@ionic/angular';

import { NgIf } from '@angular/common';
import { RouterModule } from '@angular/router';
import { UserComponent } from '../user/user.component';
import { UserDTO } from '../DTO/userDTO';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  standalone: true,
  imports: [IonicModule, RouterModule, NgIf],
})
export class HeaderComponent implements OnInit {

  get user(): UserDTO | null {
    return UserComponent.user;
  }

  @Input()
  title: string = "Welcome";

  constructor(public popoverController: PopoverController) { }

  ngOnInit() { }


  async presentPopover(e: Event) {
    let popover: HTMLIonPopoverElement;
    if (this.user) {
      popover = await this.popoverController.create({
        component: UserComponent,
        event: e,
      });
    } else {
      popover = await this.popoverController.create({
        component: NoUserPopoverComponent,
        event: e,
      });
    }

    await popover.present();

    await popover.onDidDismiss();

  }

}


@Component({
  template: `<ion-content class="ion-padding">Go to homepage to log in</ion-content>`,
  standalone: true,
  imports: [IonicModule],
})
class NoUserPopoverComponent implements OnInit {

  constructor() { }

  ngOnInit() { }

}
