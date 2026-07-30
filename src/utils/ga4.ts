import { GA4Event } from '../types';

type EventListener = (event: GA4Event) => void;

class GA4Tracker {
  private events: GA4Event[] = [];
  private listeners: EventListener[] = [];
  private measurementId: string = 'G-CYBERAD2026'; // Default GA4 Measurement ID placeholder for blog.cyberad.in

  constructor() {
    // Check if window.gtag exists, otherwise initialize mock container
    if (typeof window !== 'undefined') {
      (window as any).dataLayer = (window as any).dataLayer || [];
    }
  }

  public getMeasurementId(): string {
    return this.measurementId;
  }

  public trackEvent(name: string, params: Record<string, any> = {}): void {
    const event: GA4Event = {
      id: Math.random().toString(36).substring(2, 9),
      timestamp: new Date().toLocaleTimeString(),
      name,
      params: {
        ...params,
        page_location: typeof window !== 'undefined' ? window.location.href : '',
        page_title: typeof document !== 'undefined' ? document.title : '',
      },
    };

    this.events.unshift(event);
    if (this.events.length > 50) {
      this.events.pop();
    }

    // Call window.gtag if present
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', name, params);
    }

    // Console logging in dev mode
    console.log(`[GA4 Event - ${this.measurementId}]`, name, params);

    // Notify UI listeners
    this.listeners.forEach((listener) => listener(event));
  }

  public getEvents(): GA4Event[] {
    return [...this.events];
  }

  public subscribe(listener: EventListener): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  public clearEvents(): void {
    this.events = [];
    this.listeners.forEach((listener) => listener({ id: '0', timestamp: '', name: 'clear', params: {} }));
  }
}

export const ga4 = new GA4Tracker();

export function setSEO(title: string, description: string, path: string = '/') {
  if (typeof document === 'undefined') return;

  const fullTitle = `${title} | blog.cyberad.in`;
  document.title = fullTitle;

  // Meta description
  let metaDesc = document.querySelector('meta[name="description"]');
  if (!metaDesc) {
    metaDesc = document.createElement('meta');
    metaDesc.setAttribute('name', 'description');
    document.head.appendChild(metaDesc);
  }
  metaDesc.setAttribute('content', description);

  // Canonical link
  let canonical = document.querySelector('link[rel="canonical"]');
  if (!canonical) {
    canonical = document.createElement('link');
    canonical.setAttribute('rel', 'canonical');
    document.head.appendChild(canonical);
  }
  canonical.setAttribute('href', `https://blog.cyberad.in${path}`);

  // Track page view event in GA4
  ga4.trackEvent('page_view', {
    page_title: fullTitle,
    page_path: path,
  });
}
