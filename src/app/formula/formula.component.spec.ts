import { async, TestBed } from '@angular/core/testing';
import { BrowserModule } from '@angular/platform-browser';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { FormulaComponent } from './formula.component';
import { KatexModule } from 'ng-katex';

describe('FormulaComponent', () => {

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormulaComponent ],
      imports: [
        BrowserModule,
        FontAwesomeModule,
        KatexModule,
      ]
    })
    .compileComponents();
  }));

  it('should create', () => {
    const fixture = TestBed.createComponent(FormulaComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  });
});
