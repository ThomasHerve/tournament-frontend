import { Component, OnInit } from '@angular/core';

import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-user-popover',
  templateUrl: './user-popover.component.html',
  styleUrls: ['./user-popover.component.scss'],
  standalone: true,
  imports: [IonicModule],
})
export class UserPopoverComponent implements OnInit {

  constructor() { }

  ngOnInit() { }

}
