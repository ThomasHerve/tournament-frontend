import { Component, OnInit, } from '@angular/core';
import { IonicModule, ToastController } from '@ionic/angular';

import { ActivatedRoute } from '@angular/router';
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
  lobbyCode: string;
  username: string = "";

  tournamentPicked: TournamentDescriptorDTO | null = null;
  tournamentList: TournamentDescriptorDTO[] = Array<TournamentDescriptorDTO>();

  players: Array<PlayerDTO> = new Array()
  isOwner = false;


  constructor(private route: ActivatedRoute, private toastController: ToastController, private tournamentService: TournamentService, private lobbyService: LobbyService) {
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
    this.lobbyService.listenPlayers((value: any) => { this.players = value.players; console.log(value) })
    this.lobbyService.listenOwner(() => this.isOwner = true)
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
    this.lobbyService.launch()
  }


  copyToClipboard() {
    navigator.clipboard.writeText(this.lobbyCode);
    this.presentOkToast("Code Copied")
  }

  async presentOkToast(message: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 3000,
      color: 'primary'
    });
    toast.present();
  }

}
