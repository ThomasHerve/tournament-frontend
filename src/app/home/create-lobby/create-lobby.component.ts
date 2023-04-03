import { Component, OnInit } from '@angular/core';

import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-create-lobby',
  templateUrl: './create-lobby.component.html',
  styleUrls: ['./create-lobby.component.scss'],
  standalone: true,
  imports: [IonicModule],
})
export class CreateLobbyComponent implements OnInit {

  constructor() { }

  ngOnInit() { }

}
