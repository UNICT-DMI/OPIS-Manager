import { async, TestBed } from '@angular/core/testing';
import { CdsComponent } from './cds.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('CdsComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CdsComponent ],
      imports: [
        HttpClientTestingModule,
      ]
    })
    .compileComponents();
  }));

  it('should create', () => {
    const fixture = TestBed.createComponent(CdsComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  });
});
