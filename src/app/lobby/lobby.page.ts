import { Component, OnInit } from '@angular/core';

import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HeaderComponent } from "../shared/header/header.component";
import { IonicModule } from '@ionic/angular';
import { UserComponent } from '../shared/user/user.component';

@Component({
  selector: 'app-lobby',
  templateUrl: './lobby.page.html',
  styleUrls: ['./lobby.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, UserComponent, HeaderComponent]
})
export class LobbyPage implements OnInit {

  private lobbyId: string;
  username: string = "";

  players:Array<string> = new Array()

  constructor(private route: ActivatedRoute) {
    const lobbyId = this.route.snapshot.paramMap.get('id');
    if (lobbyId)
      this.lobbyId = lobbyId
    else
      this.lobbyId = "TESTCODE"
    if (UserComponent.user)
      this.username = UserComponent.user.username
  }

  ngOnInit() {
  }

  sendName() {

  }

}
