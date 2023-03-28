import { Component, OnInit } from '@angular/core';
import { LobbyService } from '../services/lobby.service';

@Component({
  selector: 'app-lobby',
  templateUrl: './lobby.component.html',
  styleUrls: ['./lobby.component.scss']
})
export class LobbyComponent implements OnInit {

  constructor(private lobbyService: LobbyService) { }

  ngOnInit(): void {
    this.lobbyService.getCreate().subscribe((message)=>{
      console.log(message);
    })
    this.lobbyService.create();
  }

}
