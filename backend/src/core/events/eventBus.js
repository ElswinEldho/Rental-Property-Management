import EventEmitter from 'node:events';
import { logger } from '../logger/logger.js';

class DomainEventBus extends EventEmitter {
  constructor() {
    super();
    // Allow generous listeners across business modules without warnings
    this.setMaxListeners(50);
  }

  /**
   * Publishes a domain event asynchronously to all registered listeners.
   * Listeners are executed in parallel; errors are caught and logged to prevent
   * one subscriber from interrupting the system.
   *
   * @param {string} eventName
   * @param {any} payload
   */
  async publish(eventName, payload) {
    logger.debug({ eventName, payload }, 'Domain event dispatched');
    const listeners = this.rawListeners(eventName);

    await Promise.allSettled(
      listeners.map(async (listener) => {
        try {
          await listener(payload);
        } catch (error) {
          logger.error({ eventName, error: error.message, stack: error.stack }, 'Error in domain event listener');
        }
      })
    );
  }

  /**
   * Subscribes a handler to a domain event.
   *
   * @param {string} eventName
   * @param {(payload: any) => Promise<void>|void} handler
   */
  subscribe(eventName, handler) {
    this.on(eventName, handler);
  }
}

export const eventBus = new DomainEventBus();
export default eventBus;

