import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Servicio } from 'src/app/interfaces/servicio.interface';
import { AliceService } from 'src/app/services/alice.service';
import { LocalService } from 'src/app/services/local.service';

@Component({
  selector: 'app-vertical',
  templateUrl: './vertical.component.html',
  styleUrls: ['./vertical.component.css']
})
export class VerticalComponent implements OnInit {

  formVertical: FormGroup;
  vertical: number = 1;
  servicio: number = 1;

  token: string = '';
  survey: any = {};
  verticals_select: any = [];
  servicioData: Servicio = {};

  constructor(private router: Router,
              private fb: FormBuilder,
              private alice: AliceService,
              private localService: LocalService) {

    this.localService.getToken().then(res =>{
      this.token = res;
      this.alice.getOrCreateSurvey(this.token); 
      this.getServicioSurvey(this.token);
    });

    this.crearFormulario();         
  }

  ngOnInit(): void {
    this.alice.getVerticales().subscribe(res => {
      this.verticals_select = res['data'];
      this.verticals_select.unshift({
        name: '[Seleccione una vertical]',
        id: ''
      })
    })
  }

  crearFormulario() {

    this.formVertical = this.fb.group({
      vertical: ['',  Validators.required  ],
      servicio: ['',  Validators.required  ],
    }); 
  }

  getServicioSurvey(token : string){
    this.alice.getSurveyServicio(token).subscribe(res => {

        if(res.data.tipo_servicio_id != null && res.data.vertical_id != null){    
          this.servicio = res.data.tipo_servicio_id;
          this.vertical = res.data.vertical_id;     
          this.formVertical.controls['vertical'].setValue(this.vertical);
          this.formVertical.controls['servicio'].setValue(this.servicio);
        }else{
          this.formVertical.controls['vertical'].setValue('');
          this.formVertical.controls['servicio'].setValue('');
        }     
    })
  }

  surveyStoreServicio(){
        
    if(this.checkForm()){
      this.servicioData.vertical_id = this.formVertical.value.vertical;
      this.servicioData.tipo_servicio_id = this.formVertical.value.servicio;
      this.servicioData.token_uuid = this.token;
      //guardar formulario en BD
      this.alice.storeSurveyVertical(this.servicioData).subscribe(res => {
        if(res.code == 200){
          this.router.navigate(['enlace']);
        }
      });    
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
