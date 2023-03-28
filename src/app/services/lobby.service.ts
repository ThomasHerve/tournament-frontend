import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';

@Injectable({
  providedIn: 'root'
})
export class LobbyService {

    constructor(private socket: Socket) {

    }

    // Call

    create() {
        this.socket.emit('create', {
            'name': 'test'
        });
    }

    join() {

    }

    leave() {

    }

    launch() {

    }

    // Subscribes

    getCreate() {
        return this.socket.fromEvent('create');
    }

    getJoin() {
        return this.socket.fromEvent('join');
    }

    getPlayers() {
        return this.socket.fromEvent('players');
    }

    getPassword() {
        return this.socket.fromEvent('password');
    }

    getLaunch() {
        return this.socket.fromEvent('start');
    }
}
