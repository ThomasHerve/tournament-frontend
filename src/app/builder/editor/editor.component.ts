import { Component, Input, OnInit } from '@angular/core';

import { BuilderPage } from '../builder.page';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { TournamentDTO } from '../DTO/tournamentDTO';

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class EditorComponent implements OnInit {

  get tournament() {
    return BuilderPage._tournament;
  }
  set tournament(value: TournamentDTO | null) {
    BuilderPage._tournament = value;
  }

  constructor() { }

  ngOnInit() { }


}
