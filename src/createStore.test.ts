import createStore from './createStore';

describe("createStore", () => {
  describe("public interface", () => {
    it("is a function", () => {
      expect(createStore).toBeInstanceOf(Function);
    });
    it("generates store with reducer", () => {
      const store = createStore(() => 'state');

      expect(store.getState).toBeInstanceOf(Function);
      expect(store.replaceReducer).toBeInstanceOf(Function);
      expect(store.dispatch).toBeInstanceOf(Function);
      expect(store.subscribe).toBeInstanceOf(Function);
      expect(store.subscribe(() => 'handler')).toBeInstanceOf(Function);
    });
  });

  describe("functional interface", () => {
    it("returns state based on initial state", () => {
      const state = { status: "initial" };
      expect(createStore(() => null).getState()).toBe(undefined);
      expect(createStore(() => null, state).getState()).toBe(state);
    });

    it("calculates new state with reducer call", () => {
      const firstAction = { type: "plus", payload: 100};
      const secondAction = { type: "minus", payload: 99 };
      const reducer = jest.fn((state, action) => {
        switch(action.type) {
          case 'plus':
            return {
              ...state,
              value: state.value + action.payload
            };
          case 'minus':
            return {
              ...state,
              value: state.value - action.payload
            };
          default:
            return state;
        }
      });
      const initialState = { value: 10 };
      const store = createStore(reducer, initialState);
      store.dispatch(firstAction);
      expect(reducer).toHaveBeenCalledWith({ value: 10 }, firstAction);
      expect(store.getState()).toEqual({ value: 110 });
      store.dispatch(secondAction);
      expect(reducer).toHaveBeenCalledWith({ value: 110 }, secondAction);
      expect(store.getState()).toEqual({ value: 11 });
    });

    it("notifies listeners about updates", () => {
      const firstAction = { type: "multiply", payload: 4 };
      const secondAction = { type: "divide", payload: 2 };
      const reducer = jest.fn((state, action) => {
        switch(action.type) {
          case 'multiply':
            return {
              ...state,
              value: state.value * action.payload
            };
          case 'divide':
            return {
              ...state,
              value: state.value / action.payload
            };
          default:
            return state;
        }
      });
      const initialState = { value: 21 };
      const store = createStore(reducer, initialState);
      const handler = jest.fn();
      store.subscribe(handler);
      expect(handler).not.toHaveBeenCalled();
      store.dispatch(firstAction);
      expect(reducer).toHaveBeenCalledWith({ value: 21 }, firstAction);
      expect(store.getState()).toEqual({ value: 84 });
      expect(handler).toHaveBeenCalledTimes(1);
      store.dispatch(secondAction);
      expect(reducer).toHaveBeenCalledWith({ value: 84 }, secondAction);
      expect(store.getState()).toEqual({ value: 42 });
      expect(handler).toHaveBeenCalledTimes(2);
    });

    it("allows to unsubscribe from the events", () => {
      const firstAction = { type: "add", payload: 'third' };
      const secondAction = { type: "remove", payload: 1 };
      const reducer = jest.fn((state, action) => {
        switch(action.type) {
          case 'add':
            return {
              ...state,
              value: `${state.value} ${action.payload}`
            };
          case 'remove':
            return {
              ...state,
              value: state.value.split(' ').slice(0, -1).join(' ')
            };
          default:
            return state;
        }
      });
      const initialState = { value: 'first second' };
      const store = createStore(reducer, initialState);
      const handler = jest.fn();
      const unsubscribe = store.subscribe(handler);
      expect(handler).not.toHaveBeenCalled();
      store.dispatch(firstAction);
      expect(reducer).toHaveBeenCalledWith({ value: 'first second' }, firstAction);
      expect(store.getState()).toEqual({ value: 'first second third' });
      expect(handler).toHaveBeenCalledTimes(1);
      store.dispatch(secondAction);
      expect(reducer).toHaveBeenCalledWith({ value: 'first second third' }, secondAction);
      expect(store.getState()).toEqual({ value: 'first second' });
      expect(handler).toHaveBeenCalledTimes(2);
      unsubscribe();
      store.dispatch(secondAction);
      expect(reducer).toHaveBeenCalledWith({ value: 'first second' }, secondAction);
      expect(store.getState()).toEqual({ value: 'first' });
      expect(handler).toHaveBeenCalledTimes(2);
    });
  });
});
