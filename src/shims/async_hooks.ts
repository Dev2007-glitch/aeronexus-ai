export class AsyncLocalStorage {
  #store = new Map();
  getStore() {
    return this.#store.get('store');
  }
  run(store: any, callback: (...args: any[]) => any, ...args: any[]) {
    const previous = this.getStore();
    this.#store.set('store', store);
    try {
      return callback(...args);
    } finally {
      this.#store.set('store', previous);
    }
  }
  enterWith(store: any) {
    this.#store.set('store', store);
  }
}
