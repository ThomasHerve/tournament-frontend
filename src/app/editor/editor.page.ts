import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit, Renderer2, RendererFactory2 } from '@angular/core';

import { CommonModule } from '@angular/common';
import { EditorService } from './../services/editor.service';
import { EntryDTO } from '../shared/DTO/entryDTO';
import { FormsModule } from '@angular/forms';
import { HeaderComponent } from "../shared/header/header.component";
import { IonicModule } from '@ionic/angular';
import { TournamentDTO } from '../shared/DTO/tournamentDTO';
import { TournamentService } from '../services/tournament.service';
import { UserComponent } from '../shared/user/user.component';

@Component({
  selector: 'app-editor',
  templateUrl: './editor.page.html',
  styleUrls: ['./editor.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, UserComponent, HeaderComponent]
})
export class EditorPage implements OnInit {
  private renderer: Renderer2;

  tournament: TournamentDTO = new TournamentDTO();


  constructor(private route: ActivatedRoute, private router: Router, rendererFactory: RendererFactory2, private tournamentService: TournamentService, private editorService: EditorService) {
    const id = this.route.snapshot.paramMap.get('id')!;
    if (id == "New") {
      this.tournament = new TournamentDTO()
      this.tournament.creator = UserComponent.user?.username!
    } else if (id == "Local") {
      const json = localStorage.getItem('localTournament');
      if (json)
        this.tournament = JSON.parse(json);
    } else {
      tournamentService.getTournamentById(parseInt(id)).subscribe(value => this.tournament = value)
    }

    this.renderer = rendererFactory.createRenderer(null, null);
    this.renderer.listen(document, 'ionBlur', (event: any) => {
      if (event.target.nodeName === 'ION-INPUT') {
        this.saveLocally()
      }
    });
  }

  ngOnInit() {
  }

  saveLocally() {
    const t = JSON.stringify(this.tournament);
    localStorage.setItem('localTournament', t);
  }

  saveInCloud() {
    if (this.tournament.id == -1) {
      console.log("trying to add")
      this.editorService.addTournament(this.tournament).subscribe(() => { localStorage.removeItem('localTournament'); this.router.navigateByUrl('/editor'); });
    } else {
      console.log("trying to update " + this.tournament.id)
      this.editorService.updateTournament(this.tournament).subscribe(() => localStorage.removeItem('localTournament'));
    }
  }

  addEntry() {
    this.tournament.entries.push(new EntryDTO())
  }

  removeEntry(index: number) {
    this.tournament.entries.splice(index, 1)
  }

  import() {
    //let tournament = 
  }

  export() {

  }

}
