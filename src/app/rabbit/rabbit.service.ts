import { Injectable } from '@angular/core';
import { Stomp } from "@stomp/stompjs";

@Injectable({
  providedIn: 'root'
})
export class RabbitService {

  client: any;
  functionBuffer: functionBuffer[] = []
  loaded: boolean = false

  constructor() {
    this.client = Stomp.client("ws://90.66.62.181:15674/ws")
    this.client.connect('admin', 'vivelemaspetit', () => {
      this.loaded = true;
      this.functionBuffer.forEach((o)=>{
        this.client.subscribe(o.queue, (d: any) => {
          o.function(d.body);
        });
      })
    }, () => {console.log("Error cannot connect to rabbitMQ")}, '/');
  }

  subscribe(queue: string, f: Function) {
    if(this.loaded) {
      this.client.subscribe(queue, (d: any) => {
        f(d.body);
      });
    } else {
      this.functionBuffer.push({
        function: f,
        queue: queue
      });
    }
  }
}

interface functionBuffer {
  function: Function,
  queue: string
}