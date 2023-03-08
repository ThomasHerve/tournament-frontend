import { Injectable } from '@angular/core';
import { Stomp } from "@stomp/stompjs";

@Injectable({
  providedIn: 'root'
})
export class RabbitService {

  client: any;

  constructor() {
    this.client = Stomp.client("ws://90.66.62.181:15674/ws")
    this.client.connect('admin', 'vivelemaspetit', () => {console.log("Connected to rabbitMQ")}, () => {console.log("Error cannot connect to rabbitMQ")}, '/');
  }

  send(data: string) {
    this.client.send("/topic/test", {"content-type":"text/plain"}, data)
  }
}
