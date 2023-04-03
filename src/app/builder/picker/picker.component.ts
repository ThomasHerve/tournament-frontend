import { Component, OnInit } from '@angular/core';
import { NgForOf, NgIf } from '@angular/common';

import { BuilderPage } from '../builder.page';
import { EntryDTO } from '../DTO/entryDTO';
import { IonicModule } from '@ionic/angular';
import { TournamentDTO } from '../DTO/tournamentDTO';
import { actionSheetController } from '@ionic/core';

@Component({
  selector: 'app-picker',
  templateUrl: './picker.component.html',
  styleUrls: ['./picker.component.scss'],
  standalone: true,
  imports: [IonicModule, NgIf, NgForOf]
})
export class PickerComponent implements OnInit {

  ownedDescriptors = Array();
  localDescriptor: TournamentDTO | null = null;

  constructor() {

  }

  ngOnInit() {
    const json = localStorage.getItem('currentScenario');
    if (json)
      this.localDescriptor = JSON.parse(json);

    this.loadOwnScenarioList();
  }

  async loadOwnScenarioList() {

  }


  newTournament() {
    const newdto = new TournamentDTO;
    newdto.entries.push(new EntryDTO)
    newdto.entries.push(new EntryDTO)
    newdto.entries.push(new EntryDTO)

    BuilderPage._tournament = newdto;
  }

  newSharedTournament() {
  }

  loadTournament(dto: TournamentDTO) {
    BuilderPage._tournament = dto;
  }


  async contextOwn(event: any, tdto: TournamentDTO) {
    event.preventDefault();
    actionSheetController.create({
      header: tdto.title,
      buttons: [
        { text: 'Share', icon: 'share-social', handler: () => this.shareTournament(tdto) },
        { text: 'Delete', role: 'destructive', icon: 'trash', handler: () => this.deleteTournament(tdto) },
        { text: 'Cancel', role: 'cancel' },
      ],
    }).then((as) => {
      as.present();
    });
  }

  shareTournament(tdto: TournamentDTO) {

  }

  deleteTournament(tdto: TournamentDTO) {

  }

}
