import { Component } from '@angular/core';
import { CreateCustomComponent } from './create-custom/create-custom.component';
import { CreateLobbyComponent } from './create-lobby/create-lobby.component';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [IonicModule, CreateCustomComponent, CreateLobbyComponent],
})
export class HomePage {
  constructor() { }
}
