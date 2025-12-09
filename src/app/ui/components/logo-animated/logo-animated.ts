import { AfterViewInit, Component, ElementRef, QueryList, ViewChildren } from '@angular/core';
import gsap from 'gsap';

@Component({
  selector: 'opis-logo-animated',
  imports: [],
  templateUrl: './logo-animated.html',
  styleUrl: './logo-animated.scss',
})
export class LogoAnimated implements AfterViewInit {
  @ViewChildren('letter', { read: ElementRef })
  private lettersRef: QueryList<ElementRef<SVGPathElement>>;

  @ViewChildren('bar', { read: ElementRef })
  private barsRef: QueryList<ElementRef<SVGPathElement>>;

  private timeline = gsap.timeline({ defaults: { ease: 'back.out' } });

  ngAfterViewInit(): void {
    this.animateLogo();
  }

  private asNative(elements: QueryList<ElementRef<SVGPathElement>>) {
    return elements
      .toArray()
      .reverse()
      .map((ref) => ref.nativeElement as SVGPathElement);
  }

  private prepareLetters(letters: SVGPathElement[]) {
    letters.forEach((letter) => {
      const len = letter.getTotalLength();
      gsap.set(letter, {
        strokeDasharray: len,
        strokeDashoffset: len,
      });
    });
  }

  private animateLogo() {
    const bars = this.asNative(this.barsRef);
    const letters = this.asNative(this.lettersRef);

    if (!bars.length || !letters.length) return;

    gsap.set(bars, {
      scaleY: 0,
      transformOrigin: 'bottom center',
    });

    this.prepareLetters(letters);

    this.timeline.to(bars, {
      scaleY: 1,
      duration: 1.2,
      ease: 'power2.out',
      stagger: 0.15,
    });

    this.timeline.to(
      letters,
      {
        strokeDashoffset: 0,
        duration: 1.8,
        stagger: 0.12,
      },
      '>-0.5',
    );
  }
}
