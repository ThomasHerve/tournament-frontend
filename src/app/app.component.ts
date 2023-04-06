import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { User } from 'firebase/auth';
import { UserComponent } from './shared/user/user.component';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: true,
  imports: [IonicModule],
})
export class AppComponent {

  constructor() {
    UserComponent.cacheLoadUser();
  }

}
