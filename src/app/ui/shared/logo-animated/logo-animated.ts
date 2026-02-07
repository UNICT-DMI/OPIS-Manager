import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  inject,
  QueryList,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import { DepartmentsService } from '@services/departments/departments.service';
import { gsap } from 'gsap';

@Component({
  selector: 'opis-logo-animated',
  templateUrl: './logo-animated.html',
  styleUrl: './logo-animated.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LogoAnimated implements AfterViewInit {
  private readonly _departmentService = inject(DepartmentsService);

  private readonly TOTAL_DURATION = 3;
  private readonly PHASES_PERCENTAGE = {
    arrows: 0.2,
    bars: 0.27,
    circle: 0.13,
    letters: 0.4,
  } as const;

  // eslint-disable-next-line @angular-eslint/prefer-signals
  @ViewChildren('letter', { read: ElementRef })
  private lettersRef: QueryList<ElementRef<SVGPathElement>>;

  // eslint-disable-next-line @angular-eslint/prefer-signals
  @ViewChildren('bar', { read: ElementRef })
  private barsRef: QueryList<ElementRef<SVGPathElement>>;

  // eslint-disable-next-line @angular-eslint/prefer-signals
  @ViewChildren('arrow', { read: ElementRef })
  private arrowsRef: QueryList<ElementRef<SVGPathElement>>;

  // eslint-disable-next-line @angular-eslint/prefer-signals
  @ViewChild('circle', { read: ElementRef })
  private circleRef: ElementRef<SVGPathElement>;

  private timeline = gsap.timeline({ defaults: { ease: 'back.out' } });

  ngAfterViewInit(): void {
    if (this._departmentService.logoAlreadyAnimated()) {
      this.showFinalState();
      return;
    }

    this._departmentService.logoAlreadyAnimated.set(true);
    this.animateLogo();
  }

  private phaseDuration(phase: keyof typeof this.PHASES_PERCENTAGE): number {
    return this.TOTAL_DURATION * this.PHASES_PERCENTAGE[phase];
  }

  private asNative(elements: QueryList<ElementRef<SVGPathElement>>): SVGPathElement[] {
    const arrayElements = elements.toArray().reverse();

    return arrayElements.map((ref) => ref.nativeElement as SVGPathElement);
  }

  private prepareLetters(letters: SVGPathElement[]): void {
    for (const letter of letters) {
      const len = letter.getTotalLength();
      gsap.set(letter, {
        strokeDasharray: len,
        strokeDashoffset: len,
      });
    }
  }

  private prepareArrows(arrows: SVGPathElement[]): void {
    const startEffectArrow = new Map([
      ['arrow_top', { scaleY: 0, transformOrigin: 'bottom center' }],
      ['arrow_bottom', { scaleX: 0, transformOrigin: 'left center' }],
    ]);

    for (const arrow of arrows) {
      const id = arrow.id;
      if (id) {
        const configGsap = startEffectArrow.get(id);
        if (!configGsap) return;
        gsap.set(arrow, configGsap);
      }
    }
  }

  private prepareBars(bars: SVGPathElement[]): void {
    gsap.set(bars, {
      scaleY: 0,
      transformOrigin: 'bottom center',
    });
  }

  private animateLogo(): void {
    const circle = this.circleRef.nativeElement;
    const arrows = this.asNative(this.arrowsRef);
    const bars = this.asNative(this.barsRef);
    const letters = this.asNative(this.lettersRef);

    if (!arrows.length && !bars.length && !letters.length) return;

    this.prepareArrows(arrows);
    this.prepareBars(bars);
    this.prepareLetters(letters);
    gsap.set(circle, { opacity: 0 });

    this.timeline
      .to(arrows, {
        scaleY: 1,
        scaleX: 1,
        duration: this.phaseDuration('arrows'),
        ease: 'power2.out',
        stagger: 0.1,
      })
      .to(bars, {
        scaleY: 1,
        duration: this.phaseDuration('bars'),
        ease: 'power2.out',
        stagger: 0.15,
      })
      .to(
        circle,
        {
          opacity: 1,
          duration: this.phaseDuration('circle'),
          ease: 'power1.out',
        },
        `>-${this.phaseDuration('circle') * 0.5}`,
      )
      .to(
        letters,
        {
          strokeDashoffset: 0,
          duration: this.phaseDuration('letters'),
          stagger: 0.12,
        },
        `>-${this.phaseDuration('letters') * 0.3}`,
      )
      .eventCallback('onComplete', () => this._departmentService.canStartUserFlow.set(true));
  }

  private showFinalState(): void {
    const circle = this.circleRef.nativeElement;
    const arrows = this.asNative(this.arrowsRef);
    const bars = this.asNative(this.barsRef);
    const letters = this.asNative(this.lettersRef);

    gsap.set(arrows, { scaleX: 1, scaleY: 1 });
    gsap.set(bars, { scaleY: 1 });
    gsap.set(circle, { opacity: 1 });
    gsap.set(letters, { strokeDashoffset: 0 });

    this._departmentService.canStartUserFlow.set(true);
  }
}
