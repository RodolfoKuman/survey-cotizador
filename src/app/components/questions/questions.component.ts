import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LocalService } from 'src/app/services/local.service';
import { AliceService } from 'src/app/services/alice.service';
import { Pregunta } from 'src/app/interfaces/question.interface';
import { Respuesta } from 'src/app/interfaces/respuesta.interface';
import swal from'sweetalert2';

@Component({
  selector: 'app-questions',
  templateUrl: './questions.component.html',
  styleUrls: ['./questions.component.css']
})
export class QuestionsComponent implements OnInit {

  index: number = 0;
  token: string = '';
  formQuestion : FormGroup;

  survey: any = {};
  vertical_id : number;
  preguntas : Pregunta[];
  question: Pregunta;
  respuesta: Respuesta = {};

  antenas_internas: number = 0;
  antenas_externas: number = 0;

  select_options: any = [];

  resultado : any = 0; // Resultado de preguntas abiertas
  resultado2 : any = ''; //Resultado de preguntas opcion multiple

  constructor(private router: Router,
              private activedRoute: ActivatedRoute,
              private fb: FormBuilder,
              private localService: LocalService,
              private alice: AliceService) {
   
    this.localService.getToken().then(res =>{
      this.token = res;
    });
            
    this.getQuestions();
    this.activedRoute.params.subscribe(params => {
      this.preguntas.forEach((element, index )=> {
        if(index == params['id']){
          this.question = element;
          this.select_options = [];
          if(this.question.tipo_pregunta_id == 2 && this.question.option_key == 1){
            this.select_options.push({name: '[Seleccione una opción]',id: ''});
            this.select_options.push({name: 'Si',id: '1'});
            this.select_options.push({name: 'No',id: '2'});
          }else if(this.question.tipo_pregunta_id == 2 && this.question.option_key == 2){
            this.select_options.push({name: '[Seleccione una opción]',id: ''});
            this.select_options.push({name: 'Cobertura',id: '3'});
            this.select_options.push({name: 'Densidad',id: '4'});
            this.select_options.push({name: 'Ambas',id: '5'});
          }
        }
      });
    })
    this.crearFormulario();

  }

  ngOnInit(): void {
    
  }

  crearFormulario() {
    this.formQuestion = this.fb.group({
      resultado: [ 0 ],
      resultado2: [''],
    }); 
  }

  setAntenas(){
    if(this.question.clave == 'I'){
      this.antenas_internas = this.formQuestion.value.resultado;
    } else if(this.question.clave == 'E'){
      this.antenas_externas = this.formQuestion.value.resultado;
    }
  }

  sumAntenasHotel(token_uuid: string){
    this.alice.sumAntenasHoteles({token_uuid : token_uuid}).subscribe(res => {
      
    })
  }

  getQuestions(){
    this.preguntas =  JSON.parse(this.localService.getQuestionsLocalStorage());
  }

  nextQuestion(){
    let num_preguntas = this.preguntas.length;
    //Asignando resultado de la pregunta dependiendo si es abierta o cerrada
    (this.question.tipo_pregunta_id == 1) ? this.resultado = this.formQuestion.value.resultado : this.resultado = this.formQuestion.value.resultado2;
    //Asignando valor por defecto si la respuesta es nulo o vacia
    console.log(this.resultado );
    if(this.resultado == null || this.resultado == '' || this.resultado == undefined) {
      this.resultado = 0;
    }

    this.setAntenas();
    this.respuesta.pregunta_id = this.question.id;
    this.respuesta.resultado = this.resultado;
    this.respuesta.token_uuid = this.token;
    this.respuesta.antenas_externas = this.antenas_externas;
    this.respuesta.antenas_internas = this.antenas_internas;

    if(num_preguntas == this.index + 1){
      /* Guarda la ultima pregunta y termina la encuesta */ 
      this.alice.storeResult(this.respuesta).subscribe(res => {
        if(res['code']  == 200){
          this.index++;
          this.sumAntenasHotel(this.token);
          this.router.navigate(['finish']);
          this.resultado = '';
          this.resultado2 = '';
          this.antenas_internas = 0;
          this.antenas_externas = 0;
        }
      }) 
    } else{
      this.alice.storeResult(this.respuesta).subscribe(res => {
        if(res['code']  == 200){
          this.index++;
          this.router.navigate(['questions', this.index]);
          this.resultado = '';
          this.resultado2 = '';
          this.antenas_internas = 0;
          this.antenas_externas = 0;
        }
      })  
    }
    
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
