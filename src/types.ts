export type Reducer<State, Action> = (
  state: State | undefined,
  action: Action
) => State;
