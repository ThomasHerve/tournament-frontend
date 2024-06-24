import { ActivatedRoute, Router } from '@angular/router';
import { CUSTOM_ELEMENTS_SCHEMA, Component, OnDestroy, OnInit } from '@angular/core';

import { AppComponent } from '../app.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HeaderComponent } from "../shared/header/header.component";
import { IonicModule } from '@ionic/angular';
import { LobbyService } from '../services/lobby.service';
import { PickerController } from '@ionic/angular';
import { PlayersCardComponent } from '../shared/players-card/players-card.component';
import { TournamentDescriptorDTO } from '../shared/DTO/tournamentDescriptorDTO';
import { TournamentService } from '../services/tournament.service';
import { UserComponent } from '../shared/user/user.component';

@Component({
  selector: 'app-lobby',
  templateUrl: './lobby.page.html',
  styleUrls: ['./lobby.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, UserComponent, HeaderComponent, PlayersCardComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class LobbyPage implements OnInit {
  lobbyCode: string = "";
  username: string = "";
  selectedSize = 8

  tournamentList: TournamentDescriptorDTO[] = Array<TournamentDescriptorDTO>();
  static tournamentPicked: TournamentDescriptorDTO | null = null;
  get tournamentPicked() { return LobbyPage.tournamentPicked }
  set tournamentPicked(value) { LobbyPage.tournamentPicked = value }

  get isOwner() { return PlayersCardComponent.isOwner }

  constructor(private route: ActivatedRoute, private router: Router, private tournamentService: TournamentService, private lobbyService: LobbyService, private pickerCtrl: PickerController) {
    this.route.params.subscribe(
      params => {
        const lobbyId = this.route.snapshot.paramMap.get('id');
        LobbyPage.tournamentPicked = null
        if (lobbyId) {
          this.lobbyCode = lobbyId
          lobbyService.join(lobbyId, (value: any) => { if (value.id) this.retreiveTournamentPicked(value.tournament_id); else this.onLobbyDontExist() })
        }
        else {
          this.lobbyCode = "Waiting for code ..."
          PlayersCardComponent.isOwner = true;
          lobbyService.create((value: any) => this.lobbyCode = value.id)
        }
        if (UserComponent.user)
          this.username = UserComponent.user.username

      }
    );
  }

  ionViewWillLeave() {
    if (this.router.url.startsWith('/game'))
      return
    console.log("Leave")

    this.lobbyService.leave()
  }

  ngOnInit() {
    //Listeners
    this.lobbyService.listenTournament((value: any) => this.retreiveTournamentPicked(value.tournament_id))
    //this.lobbyService.listenStart(() => this.router.navigate(['/game/' + this.lobbyCode ? this.lobbyCode : this.backupLobbyCode]));
    this.lobbyService.listenStart(() => {
      if (LobbyPage.tournamentPicked === null) {
        LobbyPage.tournamentPicked = new TournamentDescriptorDTO()
      }
      this.router.navigate(['/game/' + this.lobbyCode])

    });

    this.lobbyService.listenErrors(console.log)

    //Calls
    this.tournamentService.getAllTournamentDescriptors().subscribe(value => {
      this.tournamentList = value
    });

  }

  canActivate() {
    return true
  }

  onSearchInput(event: any) {
    const searchTerm = event.target.value;
    this.tournamentService.getAllTournamentDescriptorsWithFilters(searchTerm).subscribe(value => {
      this.tournamentList = value
    });
  }

  onLobbyDontExist() {
    AppComponent.presentWarningToast("Lobby does not exists")
    this.router.navigateByUrl('home')
  }

  pickTournament(t: TournamentDescriptorDTO) {
    this.lobbyService.pickTournament(t, this.selectedSize)
  }

  retreiveTournamentPicked(id: number) {
    this.tournamentService.getTournamentById(id).subscribe(v => {
      if (this.tournamentPicked == null || v.id != this.tournamentPicked.id) {
        this.tournamentPicked = v
        this.pickTournament(this.tournamentPicked)
      }
    })
  }

  sendName() {
    this.lobbyService.changeName(this.username)
  }


  launch() {
    if (this.isOwner)
      this.lobbyService.launch()
  }


  copyToClipboard() {
    navigator.clipboard.writeText("https://" + window.location.hostname + this.router.url + "/" + this.lobbyCode);
    AppComponent.presentOkToast("Code Copied")
  }




}
