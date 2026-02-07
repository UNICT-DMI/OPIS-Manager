import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeaderNav } from './header-nav';

describe('HeaderNav', () => {
  let component: HeaderNav;
  let fixture: ComponentFixture<HeaderNav>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeaderNav]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HeaderNav);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
