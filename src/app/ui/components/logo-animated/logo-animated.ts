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

  ngAfterViewInit(): void {
    this.animateLetters();
  }

  private convertElementRefToNativeElement() {
    return this.lettersRef.toArray().reverse().map(
      ref => ref.nativeElement as SVGPathElement
    );
  }

  private prepareAllPaths(letters: SVGPathElement[]) {
    letters.forEach(letterRef => {
      const len = letterRef.getTotalLength();
      gsap.set(letterRef, {
        strokeDasharray: len,
        strokeDashoffset: len
      });
    })
  }

  private setTimeline(nativeLetters: SVGPathElement[]) {
    const timeline = gsap.timeline({ defaults: { ease: 'back.out'} });

    nativeLetters.forEach((letter, i) => {
      timeline.to(letter, { strokeDashoffset: 0, duration: 2 }, i * 0.12);
    })
  }

  private animateLetters() {
    if(!this.lettersRef) return;
    const nativeLetters = this.convertElementRefToNativeElement();
    
    this.prepareAllPaths(nativeLetters);
    this.setTimeline(nativeLetters);
  }
}
