import { Component, OnInit } from '@angular/core';

import { IonicModule } from '@ionic/angular';
import { UserDTO } from '../DTO/userDTO';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss'],
  standalone: true,
  imports: [IonicModule],
})
export class UserComponent implements OnInit {
  public static user: UserDTO | null = null
  get user(): UserDTO | null {
    return UserComponent.user;
  }
  constructor() { }

  ngOnInit() { }

  logout() { }
}


