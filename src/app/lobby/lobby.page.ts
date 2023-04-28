import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnDestroy, OnInit, } from '@angular/core';

import { AppComponent } from '../app.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HeaderComponent } from "../shared/header/header.component";
import { IonicModule } from '@ionic/angular';
import { LobbyService } from '../services/lobby.service';
import { PlayersCardComponent } from '../shared/players-card/players-card.component';
import { TournamentDescriptorDTO } from '../shared/DTO/tournamentDescriptorDTO';
import { TournamentService } from '../services/tournament.service';
import { UserComponent } from '../shared/user/user.component';

@Component({
  selector: 'app-lobby',
  templateUrl: './lobby.page.html',
  styleUrls: ['./lobby.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, UserComponent, HeaderComponent, PlayersCardComponent]
})
export class LobbyPage implements OnInit {
  lobbyCode: string;
  username: string = "";

  tournamentList: TournamentDescriptorDTO[] = Array<TournamentDescriptorDTO>();
  static tournamentPicked: TournamentDescriptorDTO | null = null;
  get tournamentPicked() { return LobbyPage.tournamentPicked }
  set tournamentPicked(value) { LobbyPage.tournamentPicked = value }

  get isOwner() { return PlayersCardComponent.isOwner }

  constructor(private route: ActivatedRoute, private router: Router, private tournamentService: TournamentService, private lobbyService: LobbyService) {
    const lobbyId = this.route.snapshot.paramMap.get('id');
    if (lobbyId) {
      this.lobbyCode = lobbyId
      lobbyService.join(lobbyId, (value: any) => { console.log(value); if (value.tournament_id) this.retreiveTournamentPicked(value.tournament_id); else this.onLobbyDontExist() })
    }
    else {
      this.lobbyCode = "Waiting for code ..."
      PlayersCardComponent.isOwner = true;
      lobbyService.create((value: any) => this.lobbyCode = value.id)
    }
    if (UserComponent.user)
      this.username = UserComponent.user.username
  }
  ionViewWillLeave() {
    this.lobbyService.leave()
  }

  ngOnInit() {
    //Listeners
    this.lobbyService.listenTournament((value: any) => this.retreiveTournamentPicked(value.tournament_id))
    this.lobbyService.listenStart(() => this.router.navigate(['/game/' + this.lobbyCode]));

    this.lobbyService.listenErrors(console.log)

    //Calls
    this.tournamentService.getAllTournamentDescriptors().subscribe(value => this.tournamentList = value);

  }



  canActivate() {
    return true
  }

  onSearchInput(event: any) {
    const searchTerm = event.target.value;
    this.tournamentService.getAllTournamentDescriptorsWithFilters(searchTerm).subscribe(value => this.tournamentList = value);
  }

  onLobbyDontExist() {
    AppComponent.presentWarningToast("Lobby does not exists")
    this.router.navigateByUrl('Home')
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
    console.log(window.location.hostname)
    navigator.clipboard.writeText(window.location.hostname + this.router.url + "/" + this.lobbyCode);
    AppComponent.presentOkToast("Code Copied")
  }




}
