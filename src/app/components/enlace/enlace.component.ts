import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-enlace',
  templateUrl: './enlace.component.html',
  styleUrls: ['./enlace.component.css']
})
export class EnlaceComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  survey_renta(){
    this.router.navigate(['renta']);
  }

}
