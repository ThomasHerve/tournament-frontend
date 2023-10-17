import { Component, OnInit } from '@angular/core';
import { NgFor, NgIf } from '@angular/common';

import { IonicModule } from '@ionic/angular';
import { LobbyService } from 'src/app/services/lobby.service';
import { PlayerDTO } from '../DTO/playerDTO';

@Component({
  selector: 'app-players-card',
  templateUrl: './players-card.component.html',
  styleUrls: ['./players-card.component.scss'],
  standalone: true,
  imports: [IonicModule, NgIf, NgFor],
})
export class PlayersCardComponent implements OnInit {
  static isOwner: boolean

  static _players: Array<PlayerDTO> = new Array()
  get players(): Array<PlayerDTO> { return PlayersCardComponent._players }
  set players(p: Array<PlayerDTO>) { PlayersCardComponent._players = p }

  constructor(private lobbyService: LobbyService) {

  }

  ngOnInit(): void {
    this.lobbyService.observePlayers().subscribe(data => { this.players = data; console.log(data) })
    this.lobbyService.observeOwner().subscribe(() => PlayersCardComponent.isOwner = true)
  }

  static clearVotes(){
    PlayersCardComponent._players.forEach(element => {
      element.hasVoted = false
    });
  }
}
