import { Observable, ReplaySubject, Subject } from 'rxjs';

import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { TournamentDescriptorDTO } from '../shared/DTO/tournamentDescriptorDTO';
import { UserComponent } from '../shared/user/user.component';

@Injectable({
  providedIn: 'root'
})
export class LobbyService {

  private playersSubject = new Subject<any>();
  private ownerSubject = new Subject<void>();

  private roundSubject = new ReplaySubject<any>(1);


  constructor(private socket: Socket) {
    this.listenPlayers((value: any) => this.playersSubject.next(value.players))
    this.listenOwner(() => this.ownerSubject.next())
    this.listenRound((value: any) => this.roundSubject.next(value))
  }



  //#region "Common"
  /**
   * LISTENERS
   */
  private listenPlayers(callbackFn: Function) {
    this.socket.on("players", callbackFn)
  }
  observePlayers(): Observable<any> {
    return this.playersSubject.asObservable()
  }

  private listenOwner(callbackFn: Function) {
    this.socket.on("owner", callbackFn)
  }
  observeOwner() {
    return this.ownerSubject.asObservable()
  }

  listenErrors(callbackFn: Function) {
    this.socket.on("error", callbackFn)
  }
  //#endregion


  //#region "Lobby"
  /**
   * CALLERS
   */
  create(callbackFn: Function) {
    const username = UserComponent.user ? UserComponent.user.username : "HostPlayer"
    this.socket.emit('create', { name: username })
    this.socket.on("create", callbackFn)
  }

  join(code: string, callbackFn: Function) {
    const username = UserComponent.user ? UserComponent.user.username : "Player"
    this.socket.emit('join', { name: username, id: code })
    this.socket.on('join', callbackFn)
  }

  changeName(name: string) {
    this.socket.emit('changeName', { name: name })
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
  listenTournament(callbackFn: Function) {
    this.socket.on("tournament", callbackFn)
  }

  listenStart(callbackFn: Function) {
    this.socket.on("start", callbackFn)
  }

  //#endregion



  //#region "Game"
  /**
   * CALLERS
   */

  vote(left: boolean) {
    this.socket.emit('vote', { left: left })
  }

  skip() {
    this.socket.emit('skip')
  }

  /**
   * LISTENERS
   */

  private listenRound(callbackFn: Function) {
    this.socket.on("round", callbackFn)
  }
  observeRound() {
    return this.roundSubject.asObservable()
  }

  listenVotes(callbackFn: Function) {
    this.socket.on("vote", callbackFn)
  }

  listenEnd(callbackFn: Function) {
    this.socket.on('end', callbackFn)
  }
  //#endregion

}
