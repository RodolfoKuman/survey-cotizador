import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-finish',
  templateUrl: './finish.component.html',
  styleUrls: ['./finish.component.css']
})
export class FinishComponent implements OnInit {

  loader: boolean = true;
  finish: boolean = false;

  constructor() {
    
   }

  ngOnInit(): void {
    localStorage.clear();
    setTimeout(function() {
      location.href = "http://www.sitwifi.com/";
  }, 7000);
  }

  hideLoading(){
   
  }

}
