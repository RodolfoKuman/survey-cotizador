import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-tipo-servicio',
  templateUrl: './tipo-servicio.component.html',
  styleUrls: ['./tipo-servicio.component.css']
})
export class TipoServicioComponent implements OnInit {

  formServicio: FormGroup;
  gpon: boolean = false;
  wifi: boolean = false;
  cctv: boolean = false;
  antenas_internas: Number = 0;
  antenas_externas: Number = 0;

  constructor(private router: Router,
              private fb: FormBuilder) {
      this.crearFormulario();           
  }

  ngOnInit(): void {
  }

  crearFormulario(){
    this.formServicio = this.fb.group({
      gpon: [false],
      wifi: [false],
      cctv: [false],
      antenas_internas: [0, Validators.min(0)],
      antenas_externas: [0, Validators.min(0)]
    });
  }

  survey_vertical(){
    this.router.navigate(['vertical']);
    // if(this.checkForm()){
    //   this.router.navigate(['vertical']);
    // }
  }

  checkForm() {

    if ( this.formServicio.invalid ) {

      return Object.values( this.formServicio.controls ).forEach( control => {
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

  get antenasInternasNoValido() {
    return this.formServicio.get('antenas_internas').invalid && this.formServicio.get('antenas_internas').touched
  }

  get antenasExternasNoValido() {
    return this.formServicio.get('antenas_externas').invalid && this.formServicio.get('antenas_externas').touched
  }
  

}
