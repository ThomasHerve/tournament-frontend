import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { IonicModule, ToastController } from '@ionic/angular';

import { CommonModule } from '@angular/common';
import { EditorService } from './../services/editor.service';
import { EntryDTO } from './DTO/entryDTO';
import { FormsModule } from '@angular/forms';
import { HeaderComponent } from "../shared/header/header.component";
import { TournamentDTO } from './DTO/tournamentDTO';
import { UserComponent } from '../shared/user/user.component';

@Component({
  selector: 'app-editor',
  templateUrl: './editor.page.html',
  styleUrls: ['./editor.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, UserComponent, HeaderComponent]
})
export class EditorPage implements OnInit {

  tournament!: TournamentDTO;


  constructor(private route: ActivatedRoute, private router: Router, private toastController: ToastController, private editorService: EditorService) {
    const id = this.route.snapshot.paramMap.get('id')!;
    if (id == "New") {
      this.tournament = new TournamentDTO()
    } else if (id == "Local") {
      const json = localStorage.getItem('localTournament');
      if (json)
        this.tournament = JSON.parse(json);
    } else {
      editorService.getTournamentById(parseInt(id)).subscribe(value => this.tournament = value)
    }
  }

  ngOnInit() {
  }

  saveLocally() {
    const t = JSON.stringify(this.tournament);
    localStorage.setItem('localTournament', t);
  }

  saveInCloud() {
    if (this.tournament.id == -1) {
      this.editorService.addTournament(this.tournament).subscribe(() => { localStorage.removeItem('localTournament'); this.router.navigateByUrl('/Editor'); });
    } else {
      this.editorService.updateTournament(this.tournament).subscribe(() => localStorage.removeItem('localTournament'));
    }
  }

  addEntry() {
    this.tournament.entries.push(new EntryDTO())
  }

  removeEntry(index: number) {
    this.tournament.entries.splice(index, 1)
  }

}
