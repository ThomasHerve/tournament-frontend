import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit, } from '@angular/core';
import { IonicModule, ToastController } from '@ionic/angular';

import { AppComponent } from '../app.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HeaderComponent } from "../shared/header/header.component";
import { LobbyService } from '../services/lobby.service';
import { PlayerDTO } from '../shared/DTO/playerDTO';
import { TournamentDescriptorDTO } from '../shared/DTO/tournamentDescriptorDTO';
import { TournamentService } from '../services/tournament.service';
import { UserComponent } from '../shared/user/user.component';

@Component({
  selector: 'app-lobby',
  templateUrl: './lobby.page.html',
  styleUrls: ['./lobby.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, UserComponent, HeaderComponent]
})
export class LobbyPage implements OnInit {
  static _players: Array<PlayerDTO> = new Array()
  get players(): Array<PlayerDTO> { return LobbyPage._players }
  set players(p: Array<PlayerDTO>) { LobbyPage._players = p }

  lobbyCode: string;
  username: string = "";

  tournamentList: TournamentDescriptorDTO[] = Array<TournamentDescriptorDTO>();
  static tournamentPicked: TournamentDescriptorDTO | null = null;
  get tournamentPicked() { return LobbyPage.tournamentPicked }
  set tournamentPicked(value) { LobbyPage.tournamentPicked = value }



  isOwner = false;


  constructor(private route: ActivatedRoute, private router: Router, private toastController: ToastController, private tournamentService: TournamentService, private lobbyService: LobbyService) {
    const lobbyId = this.route.snapshot.paramMap.get('id');
    if (lobbyId) {
      this.lobbyCode = lobbyId
      lobbyService.join(lobbyId, (value: any) => this.retreiveTournamentPicked(value.tournament_id))
    }
    else {
      this.lobbyCode = "Waiting for code ..."
      this.isOwner = true;
      lobbyService.create((value: any) => this.lobbyCode = value.id)
    }
    if (UserComponent.user)
      this.username = UserComponent.user.username
  }

  ngOnInit() {
    //Listeners
    this.lobbyService.listenTournament((value: any) => this.retreiveTournamentPicked(value.tournament_id))
    this.lobbyService.listenPlayers((value: any) => { this.players = value.players })
    this.lobbyService.listenOwner(() => this.isOwner = true)
    this.lobbyService.listenStart((value: any) => { localStorage.setItem("gameFirstRound", value); this.router.navigate(['/game/' + this.lobbyCode]) });

    this.lobbyService.listenErrors(console.log)

    //Calls
    this.tournamentService.getAllTournamentDescriptors().subscribe(value => this.tournamentList = value);

  }

  onSearchInput(event: any) {
    const searchTerm = event.target.value;
    this.tournamentService.getAllTournamentDescriptorsWithFilters(searchTerm).subscribe(value => this.tournamentList = value);
  }

  pickTournament(t: TournamentDescriptorDTO) {
    this.lobbyService.pickTournament(t)
  }
  retreiveTournamentPicked(id: number) {
    this.tournamentService.getTournamentById(id).subscribe(v => this.tournamentPicked = v)
  }

  sendName() {
    this.lobbyService.changeName(this.username)
  }


  launch() {
    if (this.isOwner)
      this.lobbyService.launch()
  }


  copyToClipboard() {
    navigator.clipboard.writeText(this.lobbyCode);
    AppComponent.presentOkToast("Code Copied")
  }

}
