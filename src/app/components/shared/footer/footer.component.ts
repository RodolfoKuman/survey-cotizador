import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  setIndustriaImageFooter(url : string){
    let industria_footer = document.getElementById("IMG_industria"); 
    industria_footer.setAttribute('src', url);
  }

}
