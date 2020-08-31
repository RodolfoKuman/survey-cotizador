import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Enlace } from 'src/app/interfaces/enlace.interface';
import { AliceService } from 'src/app/services/alice.service';
import { LocalService } from 'src/app/services/local.service';
import swal from'sweetalert2';

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
  enlace_select: any[] = [];
  ancho_banda_select: any[] = [];

  token: string = '';
  survey: any = {};
  enlaceData: Enlace = {};

  constructor(private router: Router,
              private fb: FormBuilder,
              private alice: AliceService,
              private localService: LocalService) {

      this.localService.getToken().then(res => {
        this.token = res;
        this.alice.getOrCreateSurvey(this.token); 
        this.getEnlaceSurvey(this.token);
      });
      
      this.crearFormulario();    
  }

  ngOnInit(): void {
    this.alice.getTipoEnlace()
      .subscribe(res => { 
        res['data'].shift();
        this.enlace_select = res.data;
       });

    this.alice.getAnchoBanda()
      .subscribe(res => { 
        res['data'].shift();
        this.ancho_banda_select = res.data; 
      });
  }

  getEnlaceSurvey(token : string){
    this.alice.getSurveyEnlace(token).subscribe(res => {

        if(res.data != null){    

           (res.data.requerido == 1) ? this.enlace = 1 : this.enlace = 0;
          
           this.formEnlace.controls['enlace'].setValue(this.enlace);
           this.formEnlace.controls['tipo_enlace'].setValue(res.data.tipo_enlace_id);
           this.formEnlace.controls['ancho_banda'].setValue(res.data.ancho_banda_id);
        }     
    })
  }

  surveyStoreEnlace(){
        
    if(this.checkForm()){   
      this.enlaceData.requerido = this.formEnlace.value.enlace;

      if(this.formEnlace.value.enlace == 0){
        this.tipo_enlace = 1;
        this.ancho_banda = 1;
      }

      this.enlaceData.tipo_enlace_id = this.tipo_enlace;
      this.enlaceData.ancho_banda_id = this.ancho_banda;
      this.enlaceData.token_uuid = this.token;
      //guardar formulario en BD
      this.alice.storeSurveyEnlace(this.enlaceData).subscribe(res => {
        if(res.code == 200){
          this.router.navigate(['renta']);
        }
      });    
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
      this.formEnlace.controls['tipo_enlace'].setValue(2);
      this.formEnlace.controls['ancho_banda'].setValue(2);

      this.tipo_enlace = this.formEnlace.value.tipo_enlace;
      this.ancho_banda = this.formEnlace.value.ancho_banda;
    }else{
      this.enlace = 0;
      this.tipo_enlace = 1;
      this.ancho_banda = 1;
    }
  }

  changeEnlaceAnchoBanda(){
    this.tipo_enlace = this.formEnlace.value.tipo_enlace;
    this.ancho_banda = this.formEnlace.value.ancho_banda;
  }

  end_survey(){
    swal.fire({
      title: '¿Quieres salir de la encuesta?',
      text: "",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#040440',
      cancelButtonColor: '#e25f05',
      confirmButtonText: 'Continuar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.value) {
        this.alice.sendEmailComercial(this.token).subscribe(res => {
          localStorage.clear();
          location.href = "http://www.sitwifi.com/";
        }) 
      }
    })
  }

}
