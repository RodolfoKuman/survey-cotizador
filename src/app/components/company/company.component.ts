import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AliceService } from 'src/app/services/alice.service';
import { LocalService } from 'src/app/services/local.service';
import { Company } from 'src/app/interfaces/company.interface';
import swal from'sweetalert2';

@Component({
  selector: 'app-company',
  templateUrl: './company.component.html',
  styleUrls: ['./company.component.css']
})
export class CompanyComponent implements OnInit {

  formCompany: FormGroup;
  company: string = '';
  contacto: string = '';
  email: string = '';
  phone: string = '';

  token: string = '';
  survey :any = {};
  companyData: Company = {};

  constructor(private router: Router,
              private fb: FormBuilder,
              private alice: AliceService,
              private localService: LocalService) {

    
    //Recuperando token y  encuesta, si no existe lo crea
    this.localService.getToken().then(res =>{
      this.token = res;
      this.alice.getOrCreateSurvey(this.token); 
      this.getSurvey(this.token); 
      this.getCompanySurvey(this.token);
    });

    this.crearFormulario();
  
  }

  ngOnInit() {
    
  }

  getSurvey(token : string){
    this.alice.getSurvey(token).subscribe(res => {
      this.survey = res.data;
    })
  }

  getCompanySurvey(token : string){
    this.alice.getSurveyCompany(token).subscribe(res => {
  
        if(res.data != null){
          this.formCompany.controls['company'].setValue(res.data.empresa);
          this.formCompany.controls['contacto'].setValue(res.data.contacto);
          this.formCompany.controls['phone'].setValue(res.data.telefono);
          this.formCompany.controls['email'].setValue(res.data.email);
        }     
    })
  }

  crearFormulario() {
    this.formCompany = this.fb.group({
      company: [this.company,  Validators.required  ],
      contacto: [this.contacto,  Validators.required  ],
      email: [this.email,  [Validators.required, Validators.email]  ],
      phone: [this.phone,  Validators.required  ],
    }); 
  }

  surveyStoreCompany(){
        
    if(this.checkForm()){
      this.companyData.empresa = this.formCompany.value.company;
      this.companyData.contacto = this.formCompany.value.contacto;
      this.companyData.email = this.formCompany.value.email;
      this.companyData.telefono = this.formCompany.value.phone;
      this.companyData.token_uuid = this.token;
      //guardar formulario en BD
      this.alice.storeSurveyCompany(this.companyData).subscribe(res => {
        if(res.code == 200){
          this.router.navigate(['servicio']);
        }
      });    
    }     
      
  }

  checkForm() {

    if ( this.formCompany.invalid ) {

      return Object.values( this.formCompany.controls ).forEach( control => {
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

  get companyNoValido() {
    return this.formCompany.get('company').invalid && this.formCompany.get('company').touched
  }

  get contactoNoValido() {
    return this.formCompany.get('contacto').invalid && this.formCompany.get('contacto').touched
  }

  get emailNoValido() {
    return this.formCompany.get('email').invalid && this.formCompany.get('email').touched
  }

  get phoneNoValido() {
    return this.formCompany.get('phone').invalid && this.formCompany.get('phone').touched
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
