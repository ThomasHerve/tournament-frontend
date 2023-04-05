import { Component, OnInit } from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-create-lobby',
  templateUrl: './create-lobby.component.html',
  styleUrls: ['./create-lobby.component.scss', '../home.page.scss'],
  standalone: true,
  imports: [IonicModule, RouterModule, FormsModule],
})
export class CreateLobbyComponent implements OnInit {
  gameCode: string = "";

  constructor() { }

  ngOnInit() { }

}
