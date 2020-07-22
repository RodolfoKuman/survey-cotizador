import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Renta } from 'src/app/interfaces/renta.interface';
import { LocalService } from 'src/app/services/local.service';
import { AliceService } from 'src/app/services/alice.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-renta',
  templateUrl: './renta.component.html',
  styleUrls: ['./renta.component.css']
})
export class RentaComponent implements OnInit {

  formRenta : FormGroup;

  token: string = '';
  plazo_select: any[] = [];
  survey: any = {};

  rentaData: Renta = {};
  

  constructor(private router: Router,
              private fb: FormBuilder,
              private localService: LocalService,
              private alice: AliceService) {

    this.localService.getToken().then(res => {
      this.token = res;
      this.alice.getOrCreateSurvey(this.token); 
      this.getRentaSurvey(this.token);
    });

     this.crearFormulario();           
               
  }

  ngOnInit(): void {
    this.alice.getPlazo()
      .subscribe(res => { 
        this.plazo_select = res.data;
       });
  }

  crearFormulario() {
    this.formRenta = this.fb.group({
      renta: [0.0,  [Validators.required, Validators.min(0)] ],
      capex: [0.0, Validators.min(0)],
      plazo: [1, ],
    }); 
  }

  surveyStoreRenta(){
        
    if(this.checkForm()){   
      this.rentaData.renta_anticipada = this.formRenta.value.renta;
      this.rentaData.capex = this.formRenta.value.capex;
      this.rentaData.plazo_id = this.formRenta.value.plazo;
      this.rentaData.token_uuid = this.token;
      //guardar formulario en BD
      this.alice.storeSurveyRenta(this.rentaData).subscribe(res => {
        if(res.code == 200){
          console.log('Guardado!!')
          this.router.navigate(['questions', 1]);
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

}
