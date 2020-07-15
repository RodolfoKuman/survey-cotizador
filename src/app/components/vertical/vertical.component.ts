import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-vertical',
  templateUrl: './vertical.component.html',
  styleUrls: ['./vertical.component.css']
})
export class VerticalComponent implements OnInit {

  formVertical: FormGroup;
  vertical: number = 1;
  servicio: number = 1;

  constructor(private router: Router,
              private fb: FormBuilder) {
       this.crearFormulario();         
  }

  ngOnInit(): void {
  }

  crearFormulario() {

    this.formVertical = this.fb.group({
      vertical: ['',  Validators.required  ],
      servicio: ['',  Validators.required  ],
    }); 
  }

  survey_enlace(){
    console.log(this.formVertical.value);
    if(this.checkForm()){  
      this.router.navigate(['enlace']);
    }
    
  }

  checkForm() {

    if ( this.formVertical.invalid ) {

      return Object.values( this.formVertical.controls ).forEach( control => {
        if ( control instanceof FormGroup ) {
          Object.values( control.controls ).forEach( control => control.markAsTouched() );
        } else {
          control.markAsTouched();
        }
      });
    }else{
      return true;
    }
  }

  get servicioNoValido() {
    return this.formVertical.get('servicio').invalid && this.formVertical.get('servicio').touched
  }

  get verticalNoValido() {
    return this.formVertical.get('vertical').invalid && this.formVertical.get('vertical').touched
  }


}
