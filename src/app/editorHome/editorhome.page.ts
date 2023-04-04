import { Component, OnInit } from '@angular/core';

import { CommonModule } from '@angular/common';
import { EntryDTO } from '../editor/DTO/entryDTO';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Router } from '@angular/router';
import { TournamentDTO } from '../editor/DTO/tournamentDTO';
import { actionSheetController } from '@ionic/core';

@Component({
  selector: 'app-editorhome',
  templateUrl: './editorhome.page.html',
  styleUrls: ['./editorhome.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule,]
})
export class EditorHomePage implements OnInit {

  ownedDescriptors = Array();
  localDescriptor: TournamentDTO | null = null;

  constructor(private router: Router) {
  }

  ngOnInit() {
    const json = localStorage.getItem('localTournament');
    if (json)
      this.localDescriptor = JSON.parse(json);

    this.loadOwnScenarioList();
  }

  async loadOwnScenarioList() {

  }


  newTournament() {
    this.router.navigateByUrl('/Editor/New');
  }

  newSharedTournament() {
  }

  loadLocalTournament() {
    this.router.navigateByUrl('/Editor/Local');
  }

  loadTournament(dto: TournamentDTO) {
    this.router.navigateByUrl('/Editor/' + dto.id);
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
