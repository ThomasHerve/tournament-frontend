import { Component } from '@angular/core';
import { CreateEditorComponent } from './create-editor/create-editor.component';
import { CreateLobbyComponent } from './create-lobby/create-lobby.component';
import { IonicModule } from '@ionic/angular';
import { UserComponent } from "../user/user.component";

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [IonicModule, CreateEditorComponent, CreateLobbyComponent, UserComponent]
})
export class HomePage {
  constructor() { }
}
