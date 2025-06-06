import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit, Renderer2, RendererFactory2 } from '@angular/core';

import { AppComponent } from '../app.component';
import { CommonModule } from '@angular/common';
import { EditorService } from './../services/editor.service';
import { EntryDTO } from '../shared/DTO/entryDTO';
import { FormsModule } from '@angular/forms';
import { HeaderComponent } from "../shared/header/header.component";
import { IonicModule } from '@ionic/angular';
import { TournamentDTO } from '../shared/DTO/tournamentDTO';
import { TournamentService } from '../services/tournament.service';
import { UserComponent } from '../shared/user/user.component';
import { DomSanitizer} from '@angular/platform-browser';

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
  lastcloudsave: Date | null = null
  lastlocalsave: Date | null = null

  constructor(private route: ActivatedRoute, private router: Router, rendererFactory: RendererFactory2, private tournamentService: TournamentService, private editorService: EditorService, private domSanitizer: DomSanitizer) {
    const id = this.route.snapshot.paramMap.get('id')!.toLocaleLowerCase();
    if (id == "new") {
      this.tournament = new TournamentDTO()
      this.tournament.creator = UserComponent.user?.username!
    } else if (id == "local") {
      const json = localStorage.getItem('localTournament');
      if (json)
        this.tournament = JSON.parse(json);
      this.lastlocalsave = new Date()
    } else if (id == "shared") {
      const json = localStorage.getItem('sharedTournament');
      if (json)
        this.tournament = JSON.parse(json);
      localStorage.removeItem('sharedTournament')
    } else {
      tournamentService.getTournamentById(parseInt(id)).subscribe(value => this.tournament = value)
      this.lastcloudsave = new Date()
    }

    this.renderer = rendererFactory.createRenderer(null, null);
    this.renderer.listen(document, 'ionBlur', (event: any) => {
      if (event.target.nodeName === 'ION-INPUT') {
        this.saveLocally()
      }
    });

    setInterval(() => {
      this.updateElapsedTime();
    }, 60000);
  }

  ngOnInit() {
  }

  saveLocally() {
    const t = JSON.stringify(this.tournament);
    localStorage.setItem('localTournament', t);
    this.lastlocalsave = new Date()
  }

  saveInCloud() {
    if (this.tournament.id == -1) {
      console.log("trying to add")
      this.editorService.addTournament(this.tournament).subscribe((data) => { localStorage.removeItem('localTournament'); this.router.navigateByUrl('/editor/' + data.id, { replaceUrl: true }); this.lastcloudsave = new Date(); });
    } else {
      console.log("trying to update " + this.tournament.id)
      this.editorService.updateTournament(this.tournament).subscribe(() => { localStorage.removeItem('localTournament'); this.lastcloudsave = new Date(); });
    }
  }

  addEntry() {
    this.tournament.entries.push(new EntryDTO())
  }

  removeEntry(index: number) {
    this.tournament.entries.splice(index, 1)
  }

  export() {
    const jsonString = JSON.stringify(this.tournament)
    const blobURL = URL.createObjectURL(new Blob([jsonString], { type: 'application/json' }));

    const dlink: HTMLAnchorElement = document.createElement('a');
    dlink.href = blobURL;
    dlink.download = this.tournament.creator + "_" + this.tournament.title;
    dlink.click();
    dlink.remove();
  }

  import() {
        // Créer un élément input de type file
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = '*'; // Vous pouvez spécifier un type de fichier spécifique si nécessaire
    
        // Écouter l'événement de changement (change event)
        fileInput.addEventListener('change', (event) => {
          // Obtenir le fichier sélectionné
          const file = (event.target as HTMLInputElement).files?.[0];
    
          // Si un fichier est sélectionné
          if (file) {
            console.log(file)
            const reader = new FileReader();
    
            reader.onload = () => {
              // Convertir le contenu du fichier en objet JSON
              try {
                const jsonObject = JSON.parse(reader.result as string);
                console.log(jsonObject)

                this.tournament.title = jsonObject.title
                this.tournament.icon = jsonObject.icon
                this.tournament.entries = []
                jsonObject.entries.forEach((element: any) => {
                  let entry = new EntryDTO()
                  entry.name = element.name
                  entry.link = element.link
                  this.tournament.entries.push(entry)
                });

              } catch (error) {
                // Afficher une erreur si le contenu du fichier n'est pas un JSON valide
                console.error('Le fichier n\'est pas un JSON valide', error);
              }
            };
            reader.readAsText(file);

          }
        });
    
        // Ouvrir la boîte de dialogue de sélection de fichiers
        fileInput.click();
      
  }


  updateElapsedTime() {
    if (this.lastlocalsave)
      this.lastlocalsave = new Date(this.lastlocalsave);
    if (this.lastcloudsave)
      this.lastcloudsave = new Date(this.lastcloudsave);
  }

  formatElapsedTime(date: Date | null): string {
    if (!date) {
      return 'Never';
    }

    const now = new Date();
    const elapsedMilliseconds = now.getTime() - date.getTime();
    const elapsedSeconds = Math.floor(elapsedMilliseconds / 1000);
    const elapsedMinutes = Math.floor(elapsedSeconds / 60);
    const elapsedHours = Math.floor(elapsedMinutes / 60);

    if (elapsedSeconds < 60) {
      return `just now`;
    } else if (elapsedMinutes < 60) {
      return `${elapsedMinutes} min ago`;
    } else if (elapsedHours < 24) {
      return `${elapsedHours} hour ago`;
    } else {
      return 'Never';
    }
  }

  async deleteTournament() {
    if (!await AppComponent.presentAlertPrompt("Deletion is permanent ! Are you sure ?"))
      return
    this.editorService.deleteTournament(this.tournament.id).subscribe((data) => { if (data) this.router.navigateByUrl('/editor') })
  }

  isYoutubeVideo(name: string) {
    return name.startsWith("https://www.youtube.com/watch?")
  }

  embedYoutubeVideo(name: string) {
    return this.domSanitizer.bypassSecurityTrustResourceUrl(name.replace("/watch?v=", "/embed/"))
  }
}
