import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-vertical',
  templateUrl: './vertical.component.html',
  styleUrls: ['./vertical.component.css']
})
export class VerticalComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  survey_enlace(){
    this.router.navigate(['enlace']);
  }

}
