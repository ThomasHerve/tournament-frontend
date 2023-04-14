import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';

@Injectable({
  providedIn: 'root'
})
export class GameService {

  constructor(private socket: Socket) { }


  /**
   * CALLERS
   */

  vote(left: boolean) {
    this.socket.emit('vote', { left: left })
  }


  /**
   * LISTENERS
   */

  listenRound(callbackFn: Function) {
    this.socket.on("round", callbackFn)
  }

  listenVotes(callbackFn: Function) {
    this.socket.on("vote", callbackFn)
  }






}
