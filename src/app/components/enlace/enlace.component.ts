import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-enlace',
  templateUrl: './enlace.component.html',
  styleUrls: ['./enlace.component.css']
})
export class EnlaceComponent implements OnInit {

  formEnlace: FormGroup;
  enlace: Number = 1;
  tipo_enlace: any = 2;
  ancho_banda: any = 2;

  constructor(private router: Router,
              private fb: FormBuilder) {
        this.crearFormulario();    
    }

  ngOnInit(): void {
  }

  survey_renta(){
    console.log(this.formEnlace.value);
    console.log(`tipo_enlace: ${this.tipo_enlace}`);
    console.log(`ancho de banda: ${this.ancho_banda}`);
    if(this.checkForm()){  
      this.router.navigate(['renta']);
    }
    
  }

  crearFormulario() {

    this.formEnlace = this.fb.group({
      enlace: ['1',  Validators.required  ],
      tipo_enlace: ['2', ],
      ancho_banda: ['2', ],
    }); 
  }

  checkForm() {

    if ( this.formEnlace.invalid ) {

      return Object.values( this.formEnlace.controls ).forEach( control => {
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

  get enlaceNoValido() {
    return this.formEnlace.get('enlace').invalid && this.formEnlace.get('enlace').touched
  }

  validationEnlace(){
    if(this.formEnlace.value.enlace == 1){
      this.enlace = 1;
    }else{
      this.enlace = 2;
      this.tipo_enlace = 1;
      this.ancho_banda = 1;
    }
  }

}
