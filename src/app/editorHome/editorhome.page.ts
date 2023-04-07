import { Component, OnInit } from '@angular/core';

import { CommonModule } from '@angular/common';
import { EditorService } from '../services/editor.service';
import { FormsModule } from '@angular/forms';
import { HeaderComponent } from "../shared/header/header.component";
import { IonicModule } from '@ionic/angular';
import { Router } from '@angular/router';
import { TournamentDescriptorDTO } from '../shared/DTO/tournamentDescriptorDTO';
import { TournamentService } from './../services/tournament.service';
import { UserComponent } from '../shared/user/user.component';
import { actionSheetController } from '@ionic/core';

@Component({
  selector: 'app-editorhome',
  templateUrl: './editorhome.page.html',
  styleUrls: ['./editorhome.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, UserComponent, HeaderComponent]
})
export class EditorHomePage implements OnInit {
  ownedDescriptors: TournamentDescriptorDTO[] = Array<TournamentDescriptorDTO>();
  localDescriptor: TournamentDescriptorDTO | null = null;

  constructor(private router: Router, private tournamentService: TournamentService, private editorService: EditorService) {
  }

  ngOnInit() {
    const json = localStorage.getItem('localTournament');
    if (json)
      this.localDescriptor = JSON.parse(json);

    this.tournamentService.getAllTournamentDescriptors().subscribe(value => this.ownedDescriptors = value);
  }



  newTournament() {
    this.router.navigateByUrl('/Editor/New');
  }

  newSharedTournament() {
  }

  loadLocalTournament() {
    this.router.navigateByUrl('/Editor/Local');
  }

  loadTournament(dto: TournamentDescriptorDTO) {
    this.router.navigateByUrl('/Editor/' + dto.id);
  }


  async contextOwn(event: any, tdto: TournamentDescriptorDTO) {
    event.preventDefault();
    event.stopPropagation();
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

  shareTournament(tdto: TournamentDescriptorDTO) {

  }

  deleteTournament(tdto: TournamentDescriptorDTO) {
    this.editorService.deleteTournament(tdto.id)
  }


}
