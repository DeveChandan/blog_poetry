// lib/event-bus.ts
type EventHandler = (data?: any) => void;

class EventBus {
  private events: { [key: string]: EventHandler[] } = {};

  on(event: string, handler: EventHandler): void {
    if (!this.events[event]) {
      this.events[event] = [];
    }
    this.events[event].push(handler);
  }

  off(event: string, handler: EventHandler): void {
    if (!this.events[event]) {
      return;
    }
    this.events[event] = this.events[event].filter(h => h !== handler);
  }

  dispatch(event: string, data?: any): void {
    if (!this.events[event]) {
      return;
    }
    this.events[event].forEach(handler => handler(data));
  }
}

const eventBus = new EventBus();
export default eventBus;
