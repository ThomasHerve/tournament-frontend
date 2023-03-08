import { Component, OnInit } from '@angular/core';
import { RabbitService } from '../rabbit/rabbit.service';

@Component({
  selector: 'app-test-rabbit',
  templateUrl: './test-rabbit.component.html',
  styleUrls: ['./test-rabbit.component.scss']
})
export class TestRabbitComponent implements OnInit {

  constructor(private rabbitService:RabbitService) { 
    
  }

  ngOnInit(): void {
    this.rabbitService.subscribe("/queue/test", (body: any)=>{
        console.log(body);
    })
  }

}
