interface Window {
  tracker: Tracker;
}

interface TrackData {
  event: string;
  tags: string[];
  url: string;
  title: string;
  ts: number;
}

class Tracker {
  private buffer: TrackData[] = [];
  private lastSent: number = Date.now();
  private readonly interval: number = 1000;
  private readonly minEvents: number = 3;
  private readonly trackEndpoint: string = "http://localhost:8888/track";

  constructor() {
    window.addEventListener("beforeunload", () => this.sendBufferedEvents());
  }

  public track(event: string, ...tags: string[]): void {
    const trackData = this.createTrackData(event, tags);
    this.buffer.push(trackData);
    this.checkAndSendBufferedEvents();
  }

  private createTrackData(event: string, tags: string[]): TrackData {
    return {
      event,
      tags,
      url: window.location.href,
      title: document.title,
      ts: Math.floor(Date.now() / 1000),
    };
  }

  private checkAndSendBufferedEvents(): void {
    if (this.isIntervalExceeded()) {
      this.sendBufferedEvents();
    }
  }

  private isIntervalExceeded(): boolean {
    return Date.now() - this.lastSent >= this.interval;
  }

  private sendBufferedEvents(): void {
    if (this.hasMinimumEvents()) {
      const tracks = [...this.buffer];
      this.buffer = [];
      this.sendTrackData(tracks);
    }
  }

  private hasMinimumEvents(): boolean {
    return this.buffer.length >= this.minEvents;
  }

  private sendTrackData(tracks: TrackData[]): void {
    
    fetch(this.trackEndpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(tracks),
    })
      .then(() => {
        this.updateLastSentTime();
      })
      .catch(() => {
        this.handleSendError(tracks);
      });
  }

  private updateLastSentTime(): void {
    this.lastSent = Date.now();
  }

  private handleSendError(tracks: TrackData[]): void {
    this.buffer.unshift(...tracks);
    this.scheduleRetry();
  }

  private scheduleRetry(): void {
    if (this.buffer.length) {
      setTimeout(() => this.checkAndSendBufferedEvents(), this.interval);
    }
  }
}

(window as any).tracker = new Tracker();
