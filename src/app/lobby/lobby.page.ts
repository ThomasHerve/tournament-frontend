import { Component, OnInit, } from '@angular/core';
import { InputChangeEventDetail, InputCustomEvent, IonicModule, ToastController } from '@ionic/angular';

import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HeaderComponent } from "../shared/header/header.component";
import { LobbyService } from '../services/lobby.service';
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

  players: Array<string> = new Array()


  constructor(private route: ActivatedRoute, private toastController: ToastController, private tournamentService: TournamentService, private lobbyService: LobbyService) {
    const lobbyId = this.route.snapshot.paramMap.get('id');
    if (lobbyId)
      this.lobbyCode = lobbyId
    else
      this.lobbyCode = "Waiting for code ..."
    if (UserComponent.user)
      this.username = UserComponent.user.username
  }

  ngOnInit() {
    this.tournamentService.getAllTournamentDescriptors().subscribe(value => this.tournamentList = value);
  }

  onSearchInput(event: any) {
    const searchTerm = event.target.value;
    this.tournamentService.getAllTournamentDescriptorsWithFilters(searchTerm).subscribe(value => this.tournamentList = value);

  }
  test() {
    console.log('test');
  }

  pickTournament(t: TournamentDescriptorDTO) {
    this.tournamentPicked = t
  }




  sendName() {

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
