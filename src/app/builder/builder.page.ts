import { Component, OnInit } from '@angular/core';

import { CommonModule } from '@angular/common';
import { EditorComponent } from './editor/editor.component';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { PickerComponent } from './picker/picker.component';
import { TournamentDTO } from './DTO/tournamentDTO';

@Component({
  selector: 'app-builder',
  templateUrl: './builder.page.html',
  styleUrls: ['./builder.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, PickerComponent, EditorComponent]
})
export class BuilderPage implements OnInit {

  static _tournament: TournamentDTO | null;
  get tournament() {
    return BuilderPage._tournament;
  }
  set tournament(value: TournamentDTO | null) {
    BuilderPage._tournament = value;
  }

  constructor() {
    this.tournament = null;

  }

  ngOnInit() {
  }


}
