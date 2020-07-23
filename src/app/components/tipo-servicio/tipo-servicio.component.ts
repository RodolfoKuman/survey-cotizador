import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Servicio } from 'src/app/interfaces/servicio.interface';
import { AliceService } from 'src/app/services/alice.service';
import { LocalService } from 'src/app/services/local.service';

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

  token: string = '';
  survey: any = {};
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
    
  }

  getServicioSurvey(token : string){
    this.alice.getSurveyServicio(token).subscribe(res => {
  
        if(res.data != null){         
          (res.data.gpon == 0) ? this.gpon = false : this.gpon = true;
          (res.data.wifi == 0) ? this.wifi = false : this.wifi = true;
          (res.data.cctv == 0) ? this.cctv = false : this.cctv = true;
          this.camaras_internas = res.data.camaras_internas;
          this.camaras_externas = res.data.camaras_externas;

          this.formServicio.controls['gpon'].setValue(this.gpon);
          this.formServicio.controls['wifi'].setValue(this.wifi);
          this.formServicio.controls['cctv'].setValue(this.cctv);
          this.formServicio.controls['camaras_internas'].setValue(this.camaras_internas);
          this.formServicio.controls['camaras_externas'].setValue(this.camaras_externas);
        }     
    })
  }

  surveyStoreServicio(){
        
    if(this.checkForm()){
      this.servicioData.gpon = this.formServicio.value.gpon;
      this.servicioData.wifi = this.formServicio.value.wifi;
      this.servicioData.cctv = this.formServicio.value.cctv;
      this.servicioData.camaras_internas = this.formServicio.value.camaras_externas;
      this.servicioData.camaras_externas = this.formServicio.value.camaras_internas;
      this.servicioData.token_uuid = this.token;
      //guardar formulario en BD
      this.alice.storeSurveyServicio(this.servicioData).subscribe(res => {
        if(res.code == 200){
          this.router.navigate(['vertical']);
        }
      });    
    }     
      
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
      this.formServicio.controls['camaras_internas'].setValue(0);
      this.formServicio.controls['camaras_externas'].setValue(0);
    }
  }
  
  get camarasInternasNoValido() {
    return this.formServicio.get('camaras_internas').invalid && this.formServicio.get('camaras_internas').touched
  }

  get camarasExternasNoValido() {
    return this.formServicio.get('camaras_externas').invalid && this.formServicio.get('camaras_externas').touched
  }
  

}
