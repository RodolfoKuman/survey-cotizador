import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LocalService } from 'src/app/services/local.service';
import { AliceService } from 'src/app/services/alice.service';
import { Pregunta } from 'src/app/interfaces/question.interface';

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

  resultado : string = '';

  constructor(private router: Router,
              private activedRoute: ActivatedRoute,
              private fb: FormBuilder,
              private localService: LocalService,
              private alice: AliceService) {

    this.getQuestions();
    this.activedRoute.params.subscribe(params => {
      this.preguntas.forEach((element, index )=> {
        if(index == params['id']){
          this.question = element;
          console.log(this.question);
        }
      });
    })
    this.crearFormulario();

  }

  

  ngOnInit(): void {
  }

  crearFormulario() {
    this.formQuestion = this.fb.group({
      resultado: ['',  Validators.required  ],
      resultado2: ['0',  Validators.required  ],
    }); 
  }

  getQuestions(){
    this.preguntas =  JSON.parse(this.localService.getQuestionsLocalStorage());
  }

  nextQuestion(){
    this.resultado = '';
    //Llamar endpoint para guardar pregunta
    this.index++;
    this.router.navigate(['questions', this.index]);
  }

}
