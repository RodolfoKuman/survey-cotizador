import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import * as uuid from 'uuid';
import { AliceService } from 'src/app/services/alice.service';
import { LocalService } from 'src/app/services/local.service';

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

  constructor(private router: Router,
              private fb: FormBuilder,
              private alice: AliceService,
              private localService: LocalService) {
    this.crearFormulario();
    // let token = uuid.v4();
    // this.localService.saveTokenLocalStorage(token);   
    // console.log(token);

  }

  ngOnInit() {
    this.getVerticales();
  }

  getVerticales(){
    this.alice.getVerticales().subscribe(res => {
      console.log(res);
    })
  }

  crearFormulario() {

    this.formCompany = this.fb.group({
      company: ['',  Validators.required  ],
      contacto: ['',  Validators.required  ],
      email: ['',  [Validators.required, Validators.email]  ],
      phone: ['',  Validators.required  ],
    }); 
  }

  survey_section_2(){
    this.company = this.formCompany.value.company;
    this.contacto = this.formCompany.value.contacto;
    this.email = this.formCompany.value.email;
    this.phone = this.formCompany.value.phone;

    if(this.company != '' && this.contacto != ''
      && this.email != '' && this.phone != ''){
        
        if(this.checkForm()){
          console.log(this.formCompany.value);
          this.router.navigate(['servicio']);
        }
        
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

}
