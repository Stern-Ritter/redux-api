type CombineReducer<Config, Action> = (
  state: { [key in keyof Config]: Config[key] } | undefined,
  action: Action
) => { [key in keyof Config]: Config[key] }

export default function combineReducer< Config = any, Action = { type: string; payload?: any }> (
  reducersMap: {
  [key in keyof Config]: ( state: Config[key] | undefined, action: Action) => Config[key];
}): CombineReducer<Config, Action>  {
  const reducers = Object.entries(reducersMap) as [keyof Config, any][];
  const newState = {} as { [key in keyof Config]: any };

  return(state, action) =>  reducers.reduce((updatedState, [property, reducer]) => {
    updatedState[property] = reducer(state && state[property], action);
    return updatedState;
  }, newState);
}
