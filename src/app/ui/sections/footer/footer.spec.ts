import { ComponentFixture, TestBed } from '@angular/core/testing';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { of } from 'rxjs';
import { Footer } from './footer';
import { IconRegistryService } from '@services/icon-registry/icon-registry.service';

describe('Footer', () => {
  let component: Footer;
  let fixture: ComponentFixture<Footer>;
  let mockIconRegistry: { load: ReturnType<typeof vi.fn> };

  beforeEach(async () => {
    mockIconRegistry = { load: vi.fn(() => of('<svg id="gh"/>')) };

    await TestBed.configureTestingModule({
      imports: [Footer],
      providers: [{ provide: IconRegistryService, useValue: mockIconRegistry }],
    }).compileComponents();

    fixture = TestBed.createComponent(Footer);
    component = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('[FOOTER]: Created', () => expect(component).toBeTruthy());

  it('[FOOTER]: ngOnInit loads the github icon', () => {
    expect(mockIconRegistry.load).toHaveBeenCalledWith('github');
    expect(component['githubIcon']()).toBe('<svg id="gh"/>');
  });
});
