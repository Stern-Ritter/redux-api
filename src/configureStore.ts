import Store from "./Store";
import { Reducer } from "./types";

export default function configureStore<
  State = any,
  Action = { type: string; payload?: any }
>(
  reducer: Reducer<State, Action>,
  initialState?: State
): Store<State, Action> {
  const state = initialState as State;
  const store = new Store(reducer, state);
  return store;
}
