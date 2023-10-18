import { Component, OnInit } from '@angular/core';

import { AppComponent } from '../app.component';
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
  readonly input: HTMLInputElement;

  ownedDescriptors: TournamentDescriptorDTO[] = Array<TournamentDescriptorDTO>();
  localDescriptor: TournamentDescriptorDTO | null = null;

  constructor(private router: Router, private tournamentService: TournamentService, private editorService: EditorService) {
    this.input = document.createElement('input')
    this.input.type = 'file';
    this.input.accept = '.json';
  }

  ngOnInit() {
    const json = localStorage.getItem('localTournament');
    if (json)
      this.localDescriptor = JSON.parse(json);


    this.editorService.getAllTournamentsOfUser().subscribe(value => this.ownedDescriptors = value.sort((a, b) => a.id - b.id));
  }



  async newTournament() {
    if (this.localDescriptor && !await AppComponent.presentAlertPrompt("A tournament has not been saved in cloud. Creating a new one may erase it. Are you sure ?"))
      return
    this.router.navigateByUrl('/editor/new');
  }

  async newSharedTournament() {
    if (this.localDescriptor && !await AppComponent.presentAlertPrompt("A tournament has not been saved in cloud. Loading a new one may erase it. Are you sure ?"))
      return

    this.input.onchange = _ => {
      if (this.input.files && this.input.files[0]) {
        const reader = new FileReader();
        const router = this.router;
        reader.onload = function (event) {
          const fileContent = event.target?.result?.toString()!;
          localStorage.setItem('sharedTournament', fileContent);
          router.navigateByUrl('/editor/shared');
        };
        reader.readAsText(this.input.files[0]);

      }
      this.input.value = ''
    }
    this.input.click();
  }



  loadLocalTournament() {
    this.router.navigateByUrl('/editor/local');
  }

  loadTournament(dto: TournamentDescriptorDTO) {
    this.router.navigateByUrl('/editor/' + dto.id);
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
    this.editorService.deleteTournament(tdto.id).subscribe(value => console.log("deleted"));
  }


}
