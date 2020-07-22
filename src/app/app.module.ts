import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';
import { CompanyComponent } from './components/company/company.component';
import { NavbarComponent } from './components/shared/navbar/navbar.component';
import { TipoServicioComponent } from './components/tipo-servicio/tipo-servicio.component';
import { VerticalComponent } from './components/vertical/vertical.component';
import { EnlaceComponent } from './components/enlace/enlace.component';
import { RentaComponent } from './components/renta/renta.component';
import { FooterComponent } from './components/shared/footer/footer.component';
import { QuestionsComponent } from './components/questions/questions.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    CompanyComponent,
    NavbarComponent,
    TipoServicioComponent,
    VerticalComponent,
    EnlaceComponent,
    RentaComponent,
    FooterComponent,
    QuestionsComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
