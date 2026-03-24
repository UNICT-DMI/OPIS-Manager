import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Disclaimers } from './disclaimers';
import { ComponentRef } from '@angular/core';
import { DisclaimerInfo } from '@interfaces/graph-config.interface';
import { IconComponent } from '@shared-ui/icon/icon';
import { exampleDisclaimer } from '@mocks/disclaimer-mock';

describe('[DISCLAIMER]: init', () => {
  let fixture: ComponentFixture<Disclaimers>;
  let component: Disclaimers;
  let componentRef: ComponentRef<Disclaimers>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Disclaimers, IconComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(Disclaimers);
    component = fixture.componentInstance;
    componentRef = fixture.componentRef;
  });

  const setInput = (disclaimers: DisclaimerInfo[]) => {
    componentRef.setInput('disclaimers', disclaimers);
    fixture.detectChanges();
  };

  it('[DISCLAIMERS]: Created', () => {
    setInput([exampleDisclaimer()]);
    expect(component).toBeTruthy();
  });

  it('[DISCLAIMERS]: isOpen returns false if disclaimer is not accordion', () => {
    const disclaimer = exampleDisclaimer({ isAccordion: false });
    setInput([disclaimer]);

    expect(component['isOpen'](disclaimer)).toBe(false);
  });

  it('[DISCLAIMERS]: isOpen return false if isAccordion and NOT opened', () => {
    setInput([exampleDisclaimer()]);

    expect(component['isOpen'](exampleDisclaimer())).toBe(false);
  });

  it('[DISCLAIMERS]: isOpen return true if isAccordion and marked as default open', () => {
    const disclaimer = exampleDisclaimer({ isOpen: true });
    setInput([disclaimer]);

    expect(component['isOpen'](disclaimer)).toBe(true);
  });

  it('[DISCLAIMERS]: manageOpening does nothing if not accordion', () => {
    const disclaimer = exampleDisclaimer({ isAccordion: false });
    setInput([disclaimer]);

    component['manageOpening'](disclaimer);

    expect(component['isOpen'](disclaimer)).toBe(false);
  });

  it('[DISCLAIMERS]: manageOpening opens a closed accordion', () => {
    setInput([exampleDisclaimer()]);

    component['manageOpening'](exampleDisclaimer());
    expect(component['isOpen'](exampleDisclaimer())).toBe(true);
  });

  it('[DISCLAIMERS]: manageOpening closes an open accordion', () => {
    const disclaimer = exampleDisclaimer({ isOpen: true });
    setInput([disclaimer]);

    component['manageOpening'](disclaimer);
    expect(component['isOpen'](disclaimer)).toBe(false);
  });

  it('[DISCLAIMERS]: manageOpening closes current and opens another', () => {
    const first = exampleDisclaimer({ title: 'First', isAccordion: true, isOpen: true });
    const second = exampleDisclaimer({ title: 'Second', isAccordion: true, isOpen: false });
    setInput([first, second]);

    component['manageOpening'](second);

    expect(component['isOpen'](first)).toBe(false);
    expect(component['isOpen'](second)).toBe(true);
  });
});
