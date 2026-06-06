import { TestBed } from '@angular/core/testing';
import { env } from '@env';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { AnalyticsService } from './analytics.service';

type GtagFn = (...args: unknown[]) => void;
const win = window as unknown as { gtag?: GtagFn; dataLayer?: unknown[] };

const lastCall = (): unknown[] => {
  const layer = win.dataLayer ?? [];
  return Array.from(layer[layer.length - 1] as ArrayLike<unknown>);
};

describe('[SERVICE] == Analytics', () => {
  let service: AnalyticsService;
  const originalEnabled = env.ga_enabled;
  const originalId = env.ga_measurement_id;

  beforeEach(() => {
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({});
    service = TestBed.inject(AnalyticsService);
    win.gtag = undefined;
    win.dataLayer = undefined;
    env.ga_enabled = true;
    env.ga_measurement_id = 'G-TEST123';
  });

  afterEach(() => {
    env.ga_enabled = originalEnabled;
    env.ga_measurement_id = originalId;
    document.head
      .querySelectorAll('script[src*="googletagmanager"]')
      .forEach((el) => el.remove());
  });

  it('[INIT]: injects the gtag script and bootstraps gtag/dataLayer', () => {
    service.init();

    const script = document.head.querySelector(
      'script[src*="googletagmanager.com/gtag/js?id=G-TEST123"]',
    );
    expect(script).not.toBeNull();
    expect(typeof win.gtag).toBe('function');
    expect(Array.isArray(win.dataLayer)).toBe(true);
    expect(lastCall()[0]).toBe('config');
  });

  it('[INIT]: is idempotent — a second call injects no second script', () => {
    service.init();
    service.init();

    expect(document.head.querySelectorAll('script[src*="googletagmanager"]').length).toBe(1);
  });

  it('[INIT]: does nothing when GA is disabled', () => {
    env.ga_enabled = false;

    service.init();

    expect(document.head.querySelector('script[src*="googletagmanager"]')).toBeNull();
    expect(win.gtag).toBeUndefined();
  });

  it('[INIT]: does nothing when the measurement id is missing', () => {
    env.ga_measurement_id = '';

    service.init();

    expect(document.head.querySelector('script[src*="googletagmanager"]')).toBeNull();
  });

  it('[TRACK]: trackPageView forwards a page_view event after init', () => {
    service.init();

    service.trackPageView('/home', 'Home');

    const args = lastCall();
    expect(args[0]).toBe('event');
    expect(args[1]).toBe('page_view');
    expect(args[2]).toMatchObject({ page_path: '/home', page_title: 'Home' });
  });

  it('[TRACK]: trackEvent forwards a custom event after init', () => {
    service.init();

    service.trackEvent('cta_click', { id: 1 });

    const args = lastCall();
    expect(args[0]).toBe('event');
    expect(args[1]).toBe('cta_click');
    expect(args[2]).toEqual({ id: 1 });
  });

  it('[TRACK]: trackPageView and trackEvent are no-ops before init', () => {
    expect(() => {
      service.trackPageView('/home');
      service.trackEvent('cta_click');
    }).not.toThrow();
    expect(win.dataLayer).toBeUndefined();
  });
});
