import { Component, OnInit } from '@angular/core';
import { AliceService } from 'src/app/services/alice.service';
import { LocalService } from 'src/app/services/local.service';

@Component({
  selector: 'app-finish',
  templateUrl: './finish.component.html',
  styleUrls: ['./finish.component.css']
})
export class FinishComponent implements OnInit {

  loader: boolean = true;
  finish: boolean = false;

  token: string = '';

  constructor(private alice: AliceService,
              private localService: LocalService) {

      this.localService.getToken().then(res => {
        this.token = res;
        this.setStatusSurvey(this.token);
      });
   }

  ngOnInit(): void {
    
  }

  setStatusSurvey(token: string){
    this.alice.setStatusSurvey({token_uuid: token}).subscribe(res => {   
      if(res.code == 200){
         localStorage.clear();
        setTimeout(function() {
          location.href = "http://www.sitwifi.com/";
        }, 7000);
      }
    })
  }

}
