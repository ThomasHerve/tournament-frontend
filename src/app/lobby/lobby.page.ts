import { Component, OnInit } from '@angular/core';

import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { UserComponent } from '../shared/user/user.component';

@Component({
  selector: 'app-lobby',
  templateUrl: './lobby.page.html',
  styleUrls: ['./lobby.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, UserComponent]
})
export class LobbyPage implements OnInit {

  private lobbyId: string;

  constructor(private route: ActivatedRoute) {
    const lobbyId = this.route.snapshot.paramMap.get('id');
    if (lobbyId)
      this.lobbyId = lobbyId
    else
      this.lobbyId = "TESTCODE"
  }

  ngOnInit() {
  }

}
