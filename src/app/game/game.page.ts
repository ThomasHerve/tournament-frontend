import { AfterViewInit, Component, OnInit, ViewChild, } from '@angular/core';

import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { EntryDTO } from '../shared/DTO/entryDTO';
import { FormsModule } from '@angular/forms';
import { HeaderComponent } from "../shared/header/header.component";
import { IonicModule } from '@ionic/angular';
import { LobbyPage } from '../lobby/lobby.page';
import { LobbyService } from '../services/lobby.service';
import { PlayersCardComponent } from '../shared/players-card/players-card.component';
import { UserComponent } from '../shared/user/user.component';

@Component({
  selector: 'app-game',
  templateUrl: './game.page.html',
  styleUrls: ['./game.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, UserComponent, HeaderComponent, PlayersCardComponent]
})
export class GamePage implements OnInit, AfterViewInit {
  @ViewChild('resultModal') resultModal: HTMLIonModalElement | undefined;

  get tournamentPicked() { return LobbyPage.tournamentPicked! }
  get isOwner() { return PlayersCardComponent.isOwner }

  entryLeft: EntryDTO = new EntryDTO()
  entryRight: EntryDTO = new EntryDTO()


  messageResult: string | null = null
  imageResult: string | null = null

  hasVotedLeft: boolean | null = null
  ended = false;

  constructor(private route: ActivatedRoute, private lobbyService: LobbyService) {
    const gameId = this.route.snapshot.paramMap.get('id');

  }

  ngOnInit() {
    this.lobbyService.listenVotes(this.onVoteListener)
    this.lobbyService.listenEnd(this.onEndListener)
  }

  ngAfterViewInit() {
    this.lobbyService.observeRound().subscribe(this.onRoundListener)
  }

  onHasVotedListener = (confirmation: any) => {
    this.hasVotedLeft = confirmation.left
  }

  onVoteListener = (votes: any) => {
    if (votes.result === 'left') {
      this.messageResult = this.entryLeft.name + " has win the match with " + votes.left + " votes (vs. " + votes.right + ")"
      this.imageResult = this.entryLeft.link
    }
    else {
      this.messageResult = this.entryRight.name + " has win the match with " + votes.right + " votes (vs. " + votes.left + ")"
      this.imageResult = this.entryRight.link
    }

    this.resultModal?.present()

  }

  onRoundListener = (value: any) => {
    this.entryLeft = value.left
    this.entryRight = value.right
    this.hasVotedLeft = null
  }

  onEndListener = (value: any) => {
    this.ended = true;
    this.entryLeft = value
    this.entryRight = value.right
    this.messageResult = value.name + " has win the game !"
    this.imageResult = value.link
    this.resultModal?.present()
  }

  vote(left: boolean) {
    if (this.ended) {
      this.resultModal?.present()
      return
    }

    this.lobbyService.vote(left, this.onHasVotedListener)
  }

  skip() {
    if (this.ended) {
      this.resultModal?.present()
      return
    }

    if (!this.isOwner)
      return;

    this.lobbyService.skip()
  }



  closeModal() {
    this.resultModal?.dismiss()
  }

}
