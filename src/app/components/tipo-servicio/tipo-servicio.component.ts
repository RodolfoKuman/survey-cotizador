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
  camaras_internas: Number = 0;
  camaras_externas: Number = 0;

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
      camaras_internas: [0, Validators.min(0)],
      camaras_externas: [0, Validators.min(0)]
    });
  }

  survey_vertical(){
    if(this.checkForm()){
      console.log(this.formServicio.value);
      this.router.navigate(['vertical']);
    }
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

  validationCCTV(){
    if(this.formServicio.value.cctv == true){
      this.cctv = true;
    }else{
      this.cctv = false;
      this.camaras_internas = 0;
      this.camaras_externas = 0;
    }
  }

  get camarasInternasNoValido() {
    return this.formServicio.get('camaras_internas').invalid && this.formServicio.get('camaras_internas').touched
  }

  get camarasExternasNoValido() {
    return this.formServicio.get('camaras_externas').invalid && this.formServicio.get('camaras_externas').touched
  }
  

}
