import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { TournamentDescriptorDTO } from '../shared/DTO/tournamentDescriptorDTO';
import { UserComponent } from '../shared/user/user.component';

@Injectable({
  providedIn: 'root'
})
export class LobbyService {

  constructor(private socket: Socket) { }


  /**
   * CALLERS
   */
  create(callbackFn: Function) {
    const username = UserComponent.user ? UserComponent.user.username : "HostPlayer"
    this.socket.emit('create', { 'name': username })
    this.socket.on("create", callbackFn)
  }

  join(code: string, callbackFn: Function) {
    const username = UserComponent.user ? UserComponent.user.username : "Player"
    this.socket.emit('join', { 'name': username, 'id': code })
    this.socket.on("join", callbackFn)
  }

  changeName(name: string) {
    this.socket.emit('changeName', { 'name': name })
  }

  pickTournament(t: TournamentDescriptorDTO) {
    this.socket.emit('setOptions', { tournament: { id: t.id } })
  }

  leave() {
    this.socket.emit('leave')
  }

  launch() {
    this.socket.emit('launch')
  }


  /**
   * LISTENERS
   */
  listenPlayers(callbackFn: Function) {
    this.socket.on("players", callbackFn)
  }

  listenTournament(callbackFn: Function) {
    this.socket.on("tournament", callbackFn)
  }

  listenOwner(callbackFn: Function) {
    this.socket.on("owner", callbackFn)
  }

  listenStart(callbackFn: Function) {
    this.socket.on("start", callbackFn)
  }

  listenErrors(callbackFn: Function) {
    this.socket.on("error", callbackFn)
  }




}
