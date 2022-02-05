import { Reducer } from "./types";

export default class Store<
  State = any,
  Action = { type: string; payload?: any }
> {
  private reducer: Reducer<State, Action>;
  private state: State;
  private subscribers: Set<() => void>;

  constructor(reducer: Reducer<State, Action>, state: State) {
    this.reducer = reducer;
    this.state = state;
    this.subscribers = new Set([]);
  }

  getState(): State {
    return this.state;
  }

  dispatch(action: Action): void {
    this.state = this.reducer(this.state, action);
    this.subscribers.forEach((handler) => handler());
  }

  subscribe(handler: () => void): () => void {
    this.subscribers.add(handler);
    return () => this.subscribers.delete(handler);
  }
}
