import { Component, OnInit, } from '@angular/core';
import { IonicModule, ToastController } from '@ionic/angular';

import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { EntryDTO } from '../shared/DTO/entryDTO';
import { FormsModule } from '@angular/forms';
import { GameService } from '../services/game.service';
import { HeaderComponent } from "../shared/header/header.component";
import { LobbyPage } from '../lobby/lobby.page';
import { LobbyService } from '../services/lobby.service';
import { PlayerDTO } from '../shared/DTO/playerDTO';
import { TournamentService } from '../services/tournament.service';
import { UserComponent } from '../shared/user/user.component';

@Component({
  selector: 'app-game',
  templateUrl: './game.page.html',
  styleUrls: ['./game.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, UserComponent, HeaderComponent]
})
export class GamePage implements OnInit {
  gameCode: string;
  get tournamentPicked() { return LobbyPage.tournamentPicked! }

  username: string = "";
  players: Array<PlayerDTO> = new Array()

  entryLeft: EntryDTO = new EntryDTO()
  entryRight: EntryDTO = new EntryDTO()

  labelLeft: string = "Vote !"
  labelright: string = "Vote !"

  message: string | null = "Waiting for launch ..."

  constructor(private route: ActivatedRoute, private toastController: ToastController, private tournamentService: TournamentService, private gameService: GameService, private lobbyService: LobbyService) {
    const gameId = this.route.snapshot.paramMap.get('id');
    if (gameId) {
      this.gameCode = gameId
    }
    else {
      this.gameCode = "Waiting for code ..."
    }
    if (UserComponent.user)
      this.username = UserComponent.user.username
  }

  ngOnInit() {
    //Listeners
    this.lobbyService.listenPlayers((value: any) => { this.players = value.players; console.log(value) })
    this.gameService.listenRound(this.onRoundListener)
    this.gameService.listenVotes(this.onVoteListener)
    this.lobbyService.listenErrors(console.log)

    //Calls

  }

  onRoundListener(value: any) {
    this.message = null
    this.labelLeft = this.labelright = "Vote !"
    this.entryLeft = value.left
    this.entryRight = value.right
  }

  onVoteListener(value: any) {
    this.labelLeft = value.left
    this.labelright = value.right
  }

  vote(left: boolean) {
    this.gameService.vote(left)
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
