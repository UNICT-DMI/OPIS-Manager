import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { KatexModule } from 'ng-katex';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { ChartModule } from 'angular2-chartjs';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxSliderModule } from '@m0t0r/ngx-slider';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { InfoComponent } from './info/info.component';
import { FormulaComponent } from './formula/formula.component';
import { HomeComponent } from './home/home.component';
import { ValueDetailsComponent } from './value-details/value-details.component';
import { TeachingComponent } from './teaching/teaching.component';
import { AcademicYearComponent } from './academic-year/academic-year.component';
import { CdsComponent } from './cds/cds.component';
import { RegistrationComponent } from './registration/registration.component';
import { LoginComponent } from './login/login.component';

@NgModule({
  declarations: [
    AppComponent,
    InfoComponent,
    FormulaComponent,
    HomeComponent,
    ValueDetailsComponent,
    TeachingComponent,
    AcademicYearComponent,
    CdsComponent,
    RegistrationComponent,
    LoginComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FontAwesomeModule,
    KatexModule,
    BrowserAnimationsModule,
    HttpClientModule,
    FormsModule,
    ChartModule,
    NgbModule,
    NgxSliderModule,
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
