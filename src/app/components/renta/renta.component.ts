import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Renta } from 'src/app/interfaces/renta.interface';
import { Pregunta } from 'src/app/interfaces/question.interface';
import { LocalService } from 'src/app/services/local.service';
import { AliceService } from 'src/app/services/alice.service';
import { Router } from '@angular/router';
import swal from'sweetalert2';

@Component({
  selector: 'app-renta',
  templateUrl: './renta.component.html',
  styleUrls: ['./renta.component.css']
})
export class RentaComponent implements OnInit {

  formRenta : FormGroup;

  token: string = '';
  plazo_select: any[] = [];
  showPlazo: boolean = false;

  survey: any = {};
  rentaData: Renta = {};
  vertical_id : number;
  preguntas : Pregunta[];

  constructor(private router: Router,
              private fb: FormBuilder,
              private localService: LocalService,
              private alice: AliceService) {

    this.localService.getToken().then(res => {
      this.token = res;
      this.alice.getOrCreateSurvey(this.token); 
      this.getRentaSurvey(this.token);
      this.getVertical(this.token);
      this.getServicio(this.token);
    });

     this.crearFormulario();           
               
  }

  ngOnInit(): void {
    this.alice.getPlazo()
      .subscribe(res => { 
        this.plazo_select = res.data;
        this.plazo_select.shift();
       });
  }

  getVertical(token: string){
    this.alice.getVerticalSurvey(token).subscribe(res => {
      this.vertical_id = res['data'].vertical_id;
      this.alice.getQuestionsByVertical(this.vertical_id).subscribe(res => {
        //Guradando preguntas en el localstorage
        this.preguntas = res['data'];
        this.localService.saveQuestionsLocalStorage(this.preguntas);      
      })
    })
  }

  getServicio(token: string){
    this.alice.getSurveyServicio(token).subscribe(res => {
      //Servicio administrado
      if(res.data.tipo_servicio_id == 1){
        this.formRenta.value.plazo == 1;
        this.showPlazo = true;
      }else{
        //Venta
        this.showPlazo = false;
        this.formRenta.value.plazo = 0;
      }
    })
  }

  crearFormulario() {
    this.formRenta = this.fb.group({
      renta: [0.0,  [Validators.required, Validators.min(0)] ],
      capex: [0.0, Validators.min(0)],
      plazo: [2, ],
    }); 
  }

  surveyStoreRenta(){
        
    if(this.checkForm()){   
      (this.showPlazo == true) ? this.rentaData.plazo_id = this.formRenta.value.plazo : this.rentaData.plazo_id = 1;
      this.rentaData.renta_anticipada = this.formRenta.value.renta;
      this.rentaData.capex = this.formRenta.value.capex;
      this.rentaData.token_uuid = this.token;
      //guardar formulario en BD
      this.alice.storeSurveyRenta(this.rentaData).subscribe(res => {
        if(res.code == 200){
          this.router.navigate(['questions', 0]);
        }
      });    
    }     
      
  }

  getRentaSurvey(token : string){
    this.alice.getSurveyRenta(token).subscribe(res => {
        if(res.data != null){    
           this.formRenta.controls['renta'].setValue(res.data.renta_anticipada);
           this.formRenta.controls['capex'].setValue(res.data.capex);
           this.formRenta.controls['plazo'].setValue(res.data.plazo_id);
        }     
    })
  }

  checkForm() {
    if ( this.formRenta.invalid ) {
      return Object.values( this.formRenta.controls ).forEach( control => {
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

  get rentaNoValido() {
    return this.formRenta.get('renta').invalid && this.formRenta.get('renta').touched
  }

  get capexNoValido() {
    return this.formRenta.get('capex').invalid && this.formRenta.get('capex').touched
  }

  get plazoNoValido() {
    return this.formRenta.get('plazo').invalid && this.formRenta.get('plazo').touched
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
          location.href = "http://www.sitwifi.com/";
        }) 
      }
    })
  }

  

}
