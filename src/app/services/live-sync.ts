// import { Service } from '@angular/core';

// @Service()
// export class LiveSync {}

// import { Service } from '@angular/core';

import { inject, Service, signal, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Subject } from 'rxjs';
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';

// @Service()
// export class LiveSync {}

export interface EnrollmentStatusEvent {
  id: string;
  status: 'Pending' | 'Approved' | 'Rejected';
}

@Service()
export class LiveSyncService {
  private platformId = inject(PLATFORM_ID);
  private connection: HubConnection | null = null;
  private eventsSubject = new Subject<EnrollmentStatusEvent>();

  // Expose events as an observable — the store will subscribe to this
  events$ = this.eventsSubject.asObservable();

  // Connection state signal for UI status feedback
  connectionState = signal<'connected' | 'reconnecting' | 'disconnected'>('disconnected');

  connect() {
    // Guard against duplicate connections if called more than once
    if (this.connection) return;

    // SignalR uses WebSocket which only exists in browsers, not on the Node.js server.
    // If SSR is enabled (Extension 1), this method runs during server render — skip it.
    if (!isPlatformBrowser(this.platformId)) return;

    // Same hub URL and reconnect strategy you tested in M7 Session 3 browser DevTools
    this.connection = new HubConnectionBuilder()
      .withUrl('/hubs/tms')
      .withAutomaticReconnect([0, 2000, 10000, 30000])
      .build();

    // The event name matches the ITmsHubClient method you just added on the backend.
    // SignalR strongly-typed hubs send the method name as the event name automatically.
    this.connection.on(
      'ReceiveEnrollmentStatusUpdated',
      (enrollmentId: string, status: 'Pending' | 'Approved' | 'Rejected') => {
        this.eventsSubject.next({ id: enrollmentId, status });
      },
    );

    this.connection.onreconnecting(() => this.connectionState.set('reconnecting'));

    this.connection.onreconnected(() => this.connectionState.set('connected'));

    this.connection.onclose(() => this.connectionState.set('disconnected'));

    this.connection
      .start()
      .then(() => this.connectionState.set('connected'))
      .catch((err) => console.error('SignalR connection error:', err));
  }
}
