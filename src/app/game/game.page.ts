import { AfterViewInit, Component, OnInit, } from '@angular/core';

import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { EntryDTO } from '../shared/DTO/entryDTO';
import { FormsModule } from '@angular/forms';
import { HeaderComponent } from "../shared/header/header.component";
import { IonicModule } from '@ionic/angular';
import { LobbyPage } from '../lobby/lobby.page';
import { LobbyService } from '../services/lobby.service';
import { PlayerDTO } from '../shared/DTO/playerDTO';
import { UserComponent } from '../shared/user/user.component';

@Component({
  selector: 'app-game',
  templateUrl: './game.page.html',
  styleUrls: ['./game.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, UserComponent, HeaderComponent]
})
export class GamePage implements OnInit, AfterViewInit {
  gameCode: string;
  get tournamentPicked() { return LobbyPage.tournamentPicked! }

  get players(): Array<PlayerDTO> { return LobbyPage._players }
  set players(p: Array<PlayerDTO>) { LobbyPage._players = p }

  username: string = "";

  entryLeft: EntryDTO = new EntryDTO()
  entryRight: EntryDTO = new EntryDTO()

  labelLeft: string = "Vote !"
  labelright: string = "Vote !"

  message: string | null = "Waiting for launch ..."

  constructor(private route: ActivatedRoute, private lobbyService: LobbyService) {
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
    this.lobbyService.listenRound(this.onRoundListener)
    this.lobbyService.listenVotes(this.onVoteListener)
    this.lobbyService.listenErrors(console.log)

    //Calls

  }

  ngAfterViewInit() {
    const value = localStorage.getItem('gameFirstRound');
    this.onRoundListener(value)
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
    this.lobbyService.vote(left)
  }

}
