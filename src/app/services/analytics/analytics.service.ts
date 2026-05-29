import { Injectable } from '@angular/core';
import { env } from '@env';

type GtagFn = (...args: unknown[]) => void;

declare global {
  interface Window {
    dataLayer: unknown[];
    gtag: GtagFn;
  }
}

@Injectable({ providedIn: 'root' })
export class AnalyticsService {
  private initialized = false;

  init(): void {
    if (this.initialized || !env.ga_enabled || !env.ga_measurement_id) return;
    this.initialized = true;

    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${env.ga_measurement_id}`;
    document.head.appendChild(script);

    window.dataLayer = window.dataLayer || [];
    window.gtag = function gtag(): void {
      // GA's gtag pushes the raw `arguments` object exactly as in Google's snippet;
      // spreading into an array changes the shape GA expects.
      // eslint-disable-next-line prefer-rest-params
      window.dataLayer.push(arguments);
    };
    window.gtag('js', new Date());
    // Route changes are tracked manually via trackPageView, so disable automatic page_view.
    window.gtag('config', env.ga_measurement_id, { send_page_view: false });
  }

  trackPageView(path: string, title: string = document.title): void {
    if (!this.initialized) return;
    window.gtag('event', 'page_view', {
      page_path: path,
      page_title: title,
      page_location: window.location.href,
    });
  }

  trackEvent(name: string, params: Record<string, unknown> = {}): void {
    if (!this.initialized) return;
    window.gtag('event', name, params);
  }
}
