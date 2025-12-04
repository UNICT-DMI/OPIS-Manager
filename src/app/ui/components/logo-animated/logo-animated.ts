import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import gsap from 'gsap';

@Component({
  selector: 'opis-logo-animated',
  imports: [],
  templateUrl: './logo-animated.html',
  styleUrl: './logo-animated.scss',
})
export class LogoAnimated implements AfterViewInit {
  @ViewChild('logo') logo: ElementRef<SVGElement>;

  ngAfterViewInit(): void {
    // example
    gsap.from(this.logo.nativeElement, { opacity: 0, scale: 0.5, duration: 1.5 });
  }
}
