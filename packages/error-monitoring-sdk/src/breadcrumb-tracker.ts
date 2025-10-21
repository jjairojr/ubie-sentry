import { Breadcrumb } from './types';

interface ClickTrack {
  element: string;
  timestamp: number;
}

export class BreadcrumbTracker {
  private breadcrumbs: Breadcrumb[] = [];
  private maxBreadcrumbs: number = 50;
  private recentClicks: ClickTrack[] = [];
  private clickWindow: number = 1000;
  private rageClickThreshold: number = 3;

  addBreadcrumb(breadcrumb: Breadcrumb): void {
    this.breadcrumbs.push(breadcrumb);

    if (this.breadcrumbs.length > this.maxBreadcrumbs) {
      this.breadcrumbs = this.breadcrumbs.slice(-this.maxBreadcrumbs);
    }
  }

  getBreadcrumbs(): Breadcrumb[] {
    return [...this.breadcrumbs];
  }

  clear(): void {
    this.breadcrumbs = [];
  }

  private getElementIdentifier(element: HTMLElement): string {
    let label = element.tagName;

    if (element.id) {
      label += `#${element.id}`;
    } else if (element.className) {
      label += `.${element.className.split(' ').join('.')}`;
    }

    return label;
  }

  private detectRageClick(elementId: string, now: number): boolean {
    this.recentClicks.push({
      element: elementId,
      timestamp: now
    });

    this.recentClicks = this.recentClicks.filter(
      click => now - click.timestamp < this.clickWindow
    );

    const sameElementClicks = this.recentClicks.filter(
      click => click.element === elementId
    ).length;

    return sameElementClicks >= this.rageClickThreshold;
  }

  captureClick(event: MouseEvent): void {
    let target = event.target as HTMLElement;
    const elementId = this.getElementIdentifier(target);
    const now = Date.now();

    const isRageClick = this.detectRageClick(elementId, now);

    if (isRageClick) {
      this.addBreadcrumb({
        category: 'user-interaction',
        message: `Rage clicked on ${elementId}`,
        timestamp: now,
        level: 'warning',
        data: {
          element: elementId,
          coords: { x: event.clientX, y: event.clientY },
          isRageClick: true,
          clickCount: this.recentClicks.filter(c => c.element === elementId).length
        }
      });
    } else {
      this.addBreadcrumb({
        category: 'user-interaction',
        message: `Clicked on ${elementId}`,
        timestamp: now,
        level: 'info',
        data: {
          element: elementId,
          coords: { x: event.clientX, y: event.clientY },
          isRageClick: false
        }
      });
    }
  }

  captureNavigation(url: string): void {
    this.addBreadcrumb({
      category: 'navigation',
      message: `Navigated to ${url}`,
      timestamp: Date.now(),
      level: 'info',
      data: { url }
    });
  }

  captureConsole(level: 'log' | 'warn' | 'error', args: any[]): void {
    this.addBreadcrumb({
      category: 'console',
      message: args.map(arg => String(arg)).join(' '),
      timestamp: Date.now(),
      level: level === 'error' ? 'error' : level === 'warn' ? 'warning' : 'info',
      data: { args }
    });
  }
}
