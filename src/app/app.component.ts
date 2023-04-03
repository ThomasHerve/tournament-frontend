import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { User } from 'firebase/auth';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: true,
  imports: [IonicModule],
})
export class AppComponent {
  static appUser: User | null;

  constructor() { }

}
