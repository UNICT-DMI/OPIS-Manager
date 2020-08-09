import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss']
})
export class RegistrationComponent implements OnInit {

  public firstName: string;
  public lastName: string;
  public email: string;
  public password: string;
  public passwordConfirmation: string;

  private passwordRegex = new RegExp(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/);
  private emailRegex = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);

  constructor() { }

  ngOnInit(): void {
  }

  public sendRegistrationRequest(): void {
    if (!this.errorsInForm()) {

    }
  }

  private errorsInForm(): boolean {
    // TODO: visually show errors
    let errors = false;
    if (this.firstName == null) {
      alert('Il nome è necessario');
      errors = true;
    }
    if (this.lastName == null) {
      alert('Il cognome è necessario');
      errors = true;
    }
    console.log(this.email);
    if (this.email == null) {
      alert('L\'email è necessaria');
      errors = true;
    } else if (!this.emailRegex.test(this.email)) {
      alert('L\'email non è valida');
      errors = true;
    }
    if (this.password == null && this.passwordConfirmation == null) {
      alert('La password è necessaria');
      errors = true;
    } else if (!this.passwordRegex.test(this.password)) {
      alert('La password non è valida: la password deve essere almeno 8 caratteri e comprendere almeno un carattere minuscolo, uno maiuscolo ed un numero.')
      errors = true;
    } else if (this.password !== this.passwordConfirmation) {
      alert('Le password non corrispondono');
      errors = true;
    }
    return errors;
  }
}
